// dev tool: signs a JSON file exactly like Clerk/Svix would and POSTs it.
// usage: node --env-file=.env.local scripts/send-webhook.mjs <file.json> [--msg-id X] [--age-seconds N] [--tamper] [--url U] [--allow-remote]
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { Webhook } from "svix";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1]?.startsWith("--") === false || args.indexOf(a) === 0);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};

const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
if (!secret || !file) {
  console.error("Need CLERK_WEBHOOK_SIGNING_SECRET (use --env-file) and a JSON file path.");
  process.exit(1);
}

const url = new URL(flag("url", "http://localhost:3000/api/webhooks/clerk"));
if (!["localhost", "127.0.0.1"].includes(url.hostname) && !args.includes("--allow-remote")) {
  console.error("Refusing to send fake events to a non-local URL without --allow-remote.");
  process.exit(1);
}

const body = readFileSync(file, "utf8"); // signed byte-for-byte
const msgId = flag("msg-id", `msg_test_${randomUUID()}`);
const signedAt = new Date(Date.now() - Number(flag("age-seconds", "0")) * 1000);
const signature = new Webhook(secret).sign(msgId, signedAt, body);

const res = await fetch(url, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "svix-id": msgId,
    "svix-timestamp": String(Math.floor(signedAt.getTime() / 1000)),
    "svix-signature": signature,
  },
  body: args.includes("--tamper") ? body + " " : body, // altered after signing
});
console.log(res.status, await res.text());