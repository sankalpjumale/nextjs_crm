import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Safety rule: the admin client bypasses Row Level Security
  // Only system code (webhooks, admin/ folders) may import it because it can see all cutomer's data
  {
    files: ["**/*.{ts,tsx}"],
    ignores: [
      "server/supabase/**",
      "**/admin/**",
      "app/api/webhooks/**",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/server/supabase/admin-client", "**/admin-client"],
              message:
                "The admin client bypasses RLS. Only webhook/system code in an admin/ folder may use it.",
            },
          ],
        },
      ],
    },
  },


  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
