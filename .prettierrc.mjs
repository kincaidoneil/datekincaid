/** @type {import("prettier").Config} */
export default {
  semi: false,
  bracketSameLine: true,
  plugins: [
    "prettier-plugin-tailwindcss",
    "@trivago/prettier-plugin-sort-imports",
  ],
  importOrder: ["<THIRD_PARTY_MODULES>", "^@/(.*)$", "^[./]"],
  importOrderSeparation: true,
  tailwindFunctions: ["cva", "twMerge", "twJoin"],
}
