import "server-only";
import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  //for app to fail at startup with msg instead cryptic prisma connection error when first time some one queries db
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url()
});

//safe parse does not crash if invalid, it returns object for both success true or false
const parsed = serverSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid server environment variables: ",
    parsed.error.flatten().fieldErrors, //turn error into redable format
  );
  //throwing stop app from starting
  throw new Error("Invalid server environment variables");
}

//instead of using process.env directly
export const serverEnv = parsed.data;
