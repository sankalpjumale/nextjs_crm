import "server-only";
import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  
  SUPABASE_SECRET_KEY: z
    .string()
    .startsWith("sb_secret_", {
      message: 'Must be a Supabase secret key (sb_secret_...)'
    })
});

//safe parse does not crash if invalid, it returns object for both success true or false
const parsed = serverSchema.safeParse({
  NODE_env: process.env.NODE_ENV,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY
});

if (!parsed.success) {
  const problems = parsed.error.issues
    .map((issue) => ` -${issue.path.join(".")}: ${issue.message}`)
    .join("\n")
  //throwing stop app from starting
  throw new Error(`Invalid server environment variables:\n${problems}`);
}

//instead of using process.env directly
export const serverEnv = parsed.data;
