import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// FlatCompat ашиглана
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
    rules: {
      // Хэрэв өөр дүрэм нэмэх бол энд бичнэ
    },
  }),

  {
    // ignore patterns
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];
