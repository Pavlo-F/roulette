module.exports = {
  bracketSpacing: true,
  jsxBracketSameLine: true,
  singleQuote: false,
  jsxSingleQuote: false,
  trailingComma: 'es5',
  arrowParens: 'avoid',
  printWidth: 120,
  
  importOrder: [
    "^react(.*)$",
    "^((?!\\./|src/).)*$",
    "^src/(.*)$",
    "^../components(.*)$",
    "^./(.*)$",
    "^../(.*)$",
    "^../../(.*)$",
    "^../../../(.*)$",
    "^../../../../(.*)$",
    "^../../../../../(.*)$",
  ],
  "importOrderSeparation": false,
  "importOrderSortSpecifiers": true,
  
  "plugins": ["@trivago/prettier-plugin-sort-imports"]
};