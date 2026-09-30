//call refister() when server start
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("@/config/env.server");
    await import("@/config/env.client");
  }
}
