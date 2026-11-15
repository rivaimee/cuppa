import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  { ignores: ["dist"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    plugins: { react, "react-hooks": reactHooks },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "no-unused-vars": [
        "error",
        {
          caughtErrors: "none",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["vite.config.js", "eslint.config.js"],
    languageOptions: { globals: globals.node },
  },
  eslintConfigPrettier,
];
