module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  plugins: ['react', 'jest'],
  rules: {
    curly: ['error', 'multi-line'],
    'no-shadow': 'warn',
    'no-trailing-spaces': 'error',
    'no-undef': 'error',
    'no-underscore-dangle': 'error',
    'no-unused-expressions': 'error',
    'no-unused-vars': [
      'error',
      {
        args: 'after-used',
        ignoreRestSiblings: true,
        vars: 'all',
      },
    ],
    'object-curly-spacing': ['error', 'always'],
    quotes: ['error', 'single', 'avoid-escape'],
    'react/jsx-boolean-value': 'warn',
    'react/jsx-no-undef': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-wrap-multilines': 'warn',
    'react/no-did-mount-set-state': 'warn',
    'react/no-did-update-set-state': 'warn',
    'react/no-unknown-property': 'warn',
    'react/react-in-jsx-scope': 'error',
    'react/self-closing-comp': 'warn',
    'react/sort-prop-types': 'warn',
    'react/react-in-jsx-scope': 'off',
    semi: 'error',
    strict: 'off',
    'quote-props': 'off',
  },
  "extends": ["plugin:jest/recommended"]
};
