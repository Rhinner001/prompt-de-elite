import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Suas regras personalizadas aqui
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      // Se quiser pode desligar outros avisos chatos também
      "@typescript-eslint/no-unused-vars": "warn", // Ou "off" para desabilitar total
      "react-hooks/exhaustive-deps": "warn", // Ou "off"
    }
  }
];

export default eslintConfig;
