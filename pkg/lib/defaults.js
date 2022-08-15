module.exports = {
  'globals': {
    'MyGlobal': true
  },
  'env': {
    'browser': true,
    'es2021': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  'plugins': [
    'react',
    'react-hooks',
    '@typescript-eslint'
  ],
  'settings': {
    'react': {
      'version': 'detect'
    }
  },
  'rules': {
    // react hooks validations
    'react-hooks/rules-of-hooks': 'error',
    // suppress errors for missing "import React" in files
    'react/react-in-jsx-scope': 'off',
    // allow jsx syntax in js files (for next.js project)
    'react/jsx-filename-extension': [
      1,
      {
        'extensions': [
          '.js',
          '.jsx',
          '.ts',
          '.tsx'
        ]
      }
    ],
    'quotes': [
      2,
      'single',
      {
        'avoidEscape': true,
        'allowTemplateLiterals': true
      }
    ],
    'consistent-return': 2,
    'indent': [
      2,
      2,
      {
        'SwitchCase': 1
      }
    ],
    'no-else-return': 1,
    'semi': [
      1,
      'never'
    ],
    'space-unary-ops': 2,
    'comma-dangle': [
      'error',
      {
        'arrays': 'never',
        'objects': 'never',
        'imports': 'never',
        'exports': 'never',
        'functions': 'never'
      }
    ],
    'one-var': [
      2,
      'never'
    ],
    'no-var': 'error',
    'arrow-body-style': [
      'error',
      'always'
    ],
    'no-console': 'error',
    'no-multi-spaces': [
      'error',
      {
        'exceptions': {
          'BinaryExpression': true
        }
      }
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        'max': 1,
        'maxBOF': 1
      }
    ],
    'jsx-quotes': [
      'error',
      'prefer-single'
    ],
    "react/jsx-sort-props": [
      'error',
      {
        "noSortAlphabetically": false,
      }
    ],
    "react/jsx-first-prop-new-line": [
      "error",
      "multiline"
    ],
    "react/jsx-max-props-per-line": [
      "error",
      {
        "maximum": {
          "single": 2,
          "multi": 1
        }
      }
    ],
    "react/jsx-closing-bracket-location": [
      "error",
      "line-aligned"
    ]
  }
}