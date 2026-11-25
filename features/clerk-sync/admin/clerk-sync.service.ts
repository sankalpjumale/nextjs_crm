import "server-only";

import type { PostgrestError } from "@supabase/supabase-js";
import { z } from "zod";

import { createAdminClient } from "@/server/supabase/admin-client";

import { ClerkSyncDatabaseError, InvalidEventPayloadError } from "../errors";
import {
  toMembershipArgs,
  toOrganizationDeleteArgs,
  toOrganizationUpsertArgs,
  toUserDeleteArgs,
  toUserUpsertArgs,
} from "../mappers/clerk-event.mappers";
import {
  deletedEventDataSchema,
  eventEnvelopeSchema,
  membershipEventDataSchema,
  organizationEventDataSchema,
  userEventDataSchema,
} from "../schemas/clerk-event.schemas";

export type ApplyOutcome = "applied" | "ignored";

function parseData<S extends z.ZodType>(schema: S, type: string, data: unknown): z.output<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    // paths and messages only. Never log input values (they can contain personal data).
    const issues = result.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`);
    throw new InvalidEventPayloadError(type, issues);
  }
  return result.data;
}

async function assertOk(
  operation: string,
  query: PromiseLike<{ error: PostgrestError | null }>,
): Promise<void> {
  const { error } = await query;
  if (error) throw new ClerkSyncDatabaseError(operation, error);
}

//applies ONE verified Clerk event to our database. `event` must already have passed signature verification. Safe to call repeatedly and out of order (see the SQL functions).

export async function applyClerkEvent(event: unknown): Promise<ApplyOutcome> {
  const envelope = eventEnvelopeSchema.safeParse(event);
  if (!envelope.success) {
    throw new InvalidEventPayloadError(
      "envelope",
      envelope.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`),
    );
  }

  const { type, timestamp, data } = envelope.data;
  const eventAt = new Date(timestamp).toISOString();
  const supabase = createAdminClient();

  switch (type) {
    case "user.created":
    case "user.updated": {
      const args = toUserUpsertArgs(parseData(userEventDataSchema, type, data), eventAt);
      await assertOk("sync_user_upsert", supabase.rpc("sync_user_upsert", args));
      return "applied";
    }
    case "user.deleted": {
      const { id } = parseData(deletedEventDataSchema, type, data);
      await assertOk("sync_user_delete", supabase.rpc("sync_user_delete", toUserDeleteArgs(id, eventAt)));
      return "applied";
    }
    case "organization.created":
    case "organization.updated": {
      const args = toOrganizationUpsertArgs(parseData(organizationEventDataSchema, type, data), eventAt);
      await assertOk("sync_organization_upsert", supabase.rpc("sync_organization_upsert", args));
      return "applied";
    }
    case "organization.deleted": {
      const { id } = parseData(deletedEventDataSchema, type, data);
      await assertOk(
        "sync_organization_delete",
        supabase.rpc("sync_organization_delete", toOrganizationDeleteArgs(id, eventAt)),
      );
      return "applied";
    }
    case "organizationMembership.created":
    case "organizationMembership.updated": {
      const args = toMembershipArgs(parseData(membershipEventDataSchema, type, data), eventAt);
      await assertOk("sync_membership_upsert", supabase.rpc("sync_membership_upsert", args));
      return "applied";
    }
    case "organizationMembership.deleted": {
      const args = toMembershipArgs(parseData(membershipEventDataSchema, type, data), eventAt);
      await assertOk("sync_membership_delete", supabase.rpc("sync_membership_delete", args));
      return "applied";
    }
    default:
      return "ignored"; // valid event we don't care about: acknowledge, don't retry
  }
}