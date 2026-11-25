import type { Database } from "@/types/database.types";
import type {
  MembershipEventData,
  OrganizationEventData,
  UserEventData,
} from "../schemas/clerk-event.schemas";

type FnName = keyof Database["public"]["Functions"];
//ties our output to the REAL database function signature. If the SQL changes, this stops compiling
type RpcArgs<F extends FnName> = Database["public"]["Functions"][F]["Args"];

export function toUserUpsertArgs(data: UserEventData, eventAt: string): RpcArgs<"sync_user_upsert"> {
  const primary = data.email_addresses.find((e) => e.id === data.primary_email_address_id);
  return {
    p_id: data.id,
    p_event_at: eventAt,
    p_email: primary?.email_address,
    p_first_name: data.first_name ?? undefined,
    p_last_name: data.last_name ?? undefined,
    p_image_url: data.image_url ?? undefined,
  };
}

export function toUserDeleteArgs(id: string, eventAt: string): RpcArgs<"sync_user_delete"> {
  return { p_id: id, p_event_at: eventAt };
}

export function toOrganizationUpsertArgs(
  data: OrganizationEventData,
  eventAt: string,
): RpcArgs<"sync_organization_upsert"> {
  return {
    p_id: data.id,
    p_event_at: eventAt,
    p_name: data.name,
    p_slug: data.slug ?? undefined,
    p_image_url: data.image_url ?? undefined,
  };
}

export function toOrganizationDeleteArgs(id: string, eventAt: string): RpcArgs<"sync_organization_delete"> {
  return { p_id: id, p_event_at: eventAt };
}

export function toMembershipArgs(data: MembershipEventData, eventAt: string) {
  return {
    p_id: data.id,
    p_organization_id: data.organization.id,
    p_user_id: data.public_user_data.user_id,
    p_role: data.role,
    p_event_at: eventAt,
  } satisfies RpcArgs<"sync_membership_upsert"> & RpcArgs<"sync_membership_delete">;
}