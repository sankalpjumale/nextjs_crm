import { z } from "zod";

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

const parsed = clientSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!parsed.success) {
  console.error(
    "Invalid client environment variables: ",
    parsed.error.flatten().fieldErrors,
  );

  throw new Error("Invalid client environment variables");
}

export const clientEnv = parsed.data;
