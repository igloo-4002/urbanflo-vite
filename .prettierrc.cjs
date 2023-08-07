module.exports = {
  printWidth: 80,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  arrowParens: 'avoid',
  importOrder: ['^react', '^[@a-z0-9]', '^[~/]', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
};
