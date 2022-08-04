module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  parser: '@typescript-eslint/parser',
  // parserOptions: {
  //   ecmaFeatures: {
  //     jsx: true,
  //   },
  //   ecmaVersion: 12,
  //   sourceType: 'module',
  // },
  plugins: ['react'],
  rules: {
    'max-len': ['error', { code: 200 }],
    semi: ['error', 'never'],
    'no-param-reassign': ['error', { props: false }], // 禁止對參數赋值
    'comma-dangle': 'off',
    'consistent-return': 'off',
    'no-nested-ternary': 'off',
    indent: 'off',
  },
  ignorePatterns: ['dist/*'],
}
