/* eslint-disable perfectionist/sort-objects */
import { ensurePackages, interopDefault } from '../utils'
import type { FlatConfigItem, OptionsFiles, OptionsHasTypeScript, OptionsOverrides } from '../types'
import { GLOB_JSX, GLOB_TSX } from '../globs'

export async function react(
  options: OptionsHasTypeScript & OptionsOverrides & OptionsFiles = {},
): Promise<FlatConfigItem[]> {
  const {
    files = [GLOB_JSX, GLOB_TSX],
    typescript = true,
  } = options

  let { overrides = {} } = options

  overrides = Object.assign(overrides, {
    files: [
      '*.tsx',
    ],
    excludedFiles: [
      '*.story.tsx',
    ],
    rules: {
      'react-hooks/rules-of-hooks': 'error',
    },
  })

  await ensurePackages([
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
  ])

  const [
    pluginReact,
    pluginReactHooks,
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-react')),
    interopDefault(import('eslint-plugin-react-hooks')),
  ] as const)

  return [
    {
      name: 'style:react:setup',
      plugins: {
        'react': pluginReact,
        'react-hooks': pluginReactHooks,
      },
      settings: {
        react: {
          version: '17.0',
        },
      },
    },
    {
      files,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      name: 'style:react:rules',
      rules: {
        // recommended rules react-hooks
        'react-hooks/exhaustive-deps': 'warn',
        'react-hooks/rules-of-hooks': 'off',

        // recommended rules react
        'react/jsx-key': [
          'error',
          {
            checkFragmentShorthand: true,
            checkKeyMustBeforeSpread: true,
            warnOnDuplicates: true,
          },
        ],
        'react/jsx-no-duplicate-props': 'error',
        'react/jsx-no-undef': 'error',
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        'react/no-children-prop': 'error',
        'react/no-direct-mutation-state': 'error',
        'react/no-unsafe': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/require-render-return': 'error',
        'react/destructuring-assignment': [
          'error',
          'always',
          {
            destructureInSignature: 'always',
          },
        ],
        'react/jsx-no-leaked-render': [
          'error',
          {
            validStrategies: [
              'ternary',
            ],
          },
        ],
        'react/jsx-max-depth': [
          'error',
          {
            max: 5,
          },
        ],
        'react/function-component-definition': 'error',
        'react/prefer-read-only-props': 'error',
        'react/jsx-no-bind': 'error',
        'react/prefer-stateless-function': 'error',
        'react/no-unused-prop-types': 'error',
        'react/jsx-pascal-case': 'error',
        'react/no-unstable-nested-components': [
          'error',
          {
            allowAsProps: true,
          },
        ],

        // non-relevant rules for roblox-ts
        'react/display-name': 'off',
        'react/jsx-no-target-blank': 'off',
        'react/jsx-no-comment-textnodes': 'off',
        'react/no-danger-with-children': 'off',
        'react/no-deprecated': 'off',
        'react/no-find-dom-node': 'off',
        'react/no-is-mounted': 'off',
        'react/no-render-return-value': 'off',
        'react/no-string-refs': 'off',
        'react/no-unescaped-entities': 'off',
        'react/no-unknown-property': 'off',
        'react/prop-types': 'off',
        'style/jsx-self-closing-comp': [
          'error',
          {
            component: true,
          },
        ],
        'style/jsx-curly-brace-presence': [
          'warn',
          {
            props: 'never',
            children: 'never',
            propElementValues: 'always',
          },
        ],

        ...typescript
          ? {
              'react/jsx-no-undef': 'off',
              'react/prop-type': 'off',
            }
          : {},

        // overrides
        ...overrides,
      },
    },
  ]
}
