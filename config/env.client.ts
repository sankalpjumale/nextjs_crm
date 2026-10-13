import { z } from "zod";

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  //RLS still applies to publishable key
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .startsWith("sb_publishable_", {
      message: "Must be a Supabase Publishable key (sb_publishable_...)"
    }),
  
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .startsWith("pk_", { message: "Must be a Clerk publishable key (pk_...)" }),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().startsWith("/"),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().startsWith("/")
});

const parsed = clientSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL:process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:process.env. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL:process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  NEXT_PUBLIC_CLERK_SIGN_UP_URL:process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL
});

if (!parsed.success) {
  const problems = parsed.error.issues
    .map((issue) => ` - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n")

  throw new Error("Invalid client environment variables");
}

export const clientEnv = parsed.data;
