import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { serverEnv } from "@/config/env.server";
import { applyClerkEvent } from "@/features/clerk-sync/admin/clerk-sync.service";
import { InvalidEventPayloadError } from "@/features/clerk-sync/errors";
import { NextRequest } from "next/server";

export const runtime = "nodejs"; //svix verification uses Node crypto

//PUBLIC route: no requireUserId/requireTenantContext. Webhooks have no session.
//authentication here IS the signature check below.
export async function POST(req: NextRequest) {
  const deliveryId = req.headers.get("svix-id") ?? "unknown";

  //verify. Reads the RAW body internally. Never call req.json() before this.
  let event: Awaited<ReturnType<typeof verifyWebhook>>;
  try {
    event = await verifyWebhook(req, {
      signingSecret: serverEnv.CLERK_WEBHOOK_SIGNING_SECRET,
    });
  } catch {
    console.warn(JSON.stringify({ msg: "clerk_webhook_rejected", reason: "invalid_signature", deliveryId }));
    return new Response("Invalid webhook signature", { status: 400 });
  }

  //apply
  try {
    const outcome = await applyClerkEvent(event);
    console.info(JSON.stringify({ msg: "clerk_webhook_processed", type: event.type, outcome, deliveryId }));
    return Response.json({ ok: true, outcome });
  } catch (error) {
    if (error instanceof InvalidEventPayloadError) {
      console.error(
        JSON.stringify({ msg: "clerk_webhook_invalid_payload", type: error.eventType, issues: error.issues, deliveryId }),
      );
      return Response.json({ ok: false, error: "invalid_payload" }, { status: 422 });
    }
    console.error(
      JSON.stringify({
        msg: "clerk_webhook_failed",
        type: event.type,
        deliveryId,
        error: error instanceof Error ? error.message : "unknown",
      }),
    );
    return Response.json({ ok: false, error: "processing_failed" }, { status: 500 });
  }
}