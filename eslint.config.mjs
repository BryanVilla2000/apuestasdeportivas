import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { globalIgnores } from "eslint/config";
import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

const webRoot = fileURLToPath(new URL("./apps/web", import.meta.url));

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["apps/web/**/*.{js,jsx,ts,tsx}"],
    plugins: { "@next/next": nextPlugin },
    rules: nextPlugin.configs.recommended.rules,
    settings: { next: { rootDir: webRoot } },
  },
  globalIgnores([
    "**/node_modules/**",
    "**/.next/**",
    "**/dist/**",
    "**/coverage/**",
  ]),
];
