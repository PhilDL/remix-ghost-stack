module.exports = {
  printWidth: 80,
  tabWidth: 2,
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(remix/(.*)$)|^(remix$)",
    "<THIRD_PARTY_MODULES>",
    "",
    ".*(?:component|layout).*",
    ".*(?:hooks).*",
    "",
    ".*.server$",
    "^types$",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  plugins: [require("@ianvs/prettier-plugin-sort-imports")],
};
