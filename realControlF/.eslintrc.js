module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ["vue", 'eslint:recommended', 'plugin:vue/essential', "plugin:vue/recommended"],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaFeatures: {
        jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  plugins: ['vue', 'promise'],
  rules: {
    'vue/html-indent': ['error', 2],
    'vue/order-in-components': 0,
    'vue/html-closing-bracket-newline': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/max-attributes-per-line': 0,
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'no-console': 1,
    'no-debugger': 1,
    'no-var': 2,
    'no-unused-vars': 1,
    'prefer-const': 2,
    'comma-style': [2, 'last'],
    'no-multiple-empty-lines': [1, { max: 1 }],
    'no-spaced-func': 2,
    'space-before-blocks': 2,
    'no-case-declarations': 0
  }
}
