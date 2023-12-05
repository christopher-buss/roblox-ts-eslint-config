import { GLOB_LESS, GLOB_MARKDOWN } from '../globs'
import type { VendoredPrettierOptions } from '../vender/prettier-types'
import { ensurePackages, interopDefault } from '../utils'
import type { FlatConfigItem, OptionsFormatters, StylisticConfig } from '../types'
import { StylisticConfigDefaults } from './stylistic'

export async function formatters(
  options: OptionsFormatters | true = {},
  stylistic: StylisticConfig = {},
  markdownEnabled = true,
): Promise<FlatConfigItem[]> {
  await ensurePackages([
    'eslint-plugin-format',
  ])

  if (options === true) {
    options = {
      graphql: true,
      markdown: true,
      toml: true,
    }
  }

  const {
    indent,
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...stylistic,
  }

  const prettierOptions: VendoredPrettierOptions = Object.assign(
    {
      semi,
      singleQuote: quotes === 'single',
      tabWidth: typeof indent === 'number' ? indent : 2,
      trailingComma: 'all',
      useTabs: indent === 'tab',
    } satisfies VendoredPrettierOptions,
    options.prettierOptions ?? {},
  )

  const dprintOptions = Object.assign(
    {
      indentWidth: typeof indent === 'number' ? indent : 2,
      quoteStyle: quotes === 'single' ? 'preferSingle' : 'preferDouble',
      useTabs: indent === 'tab',
    },
    options.dprintOptions ?? {},
  )

  const pluginFormat = await interopDefault(import('eslint-plugin-format'))

  const configs: FlatConfigItem[] = [
    {
      name: 'antfu:formatters:setup',
      plugins: {
        format: pluginFormat,
      },
    },
  ]

  if (options.toml) {
    configs.push({
      files: ['**/*.toml'],
      languageOptions: {
        parser: pluginFormat.parserPlain,
      },
      name: 'antfu:formatter:toml',
      rules: {
        'format/dprint': [
          'error',
          {
            ...dprintOptions,
            language: 'toml',
          },
        ],
      },
    })
  }

  if (options.markdown) {
    const formater = options.markdown === true
      ? 'prettier'
      : options.markdown

    configs.push({
      files: markdownEnabled
        ? ['**/*.__markdown_content__']
        : [GLOB_MARKDOWN],
      languageOptions: {
        parser: pluginFormat.parserPlain,
      },
      name: 'antfu:formatter:markdown',
      rules: {
        [`format/${formater}`]: [
          'error',
          formater === 'prettier'
            ? {
                ...prettierOptions,
                embeddedLanguageFormatting: 'off',
                parser: 'markdown',
              }
            : {
                ...dprintOptions,
                language: 'markdown',
              },
        ],
      },
    })
  }

  if (options.graphql) {
    configs.push({
      files: ['**/*.graphql'],
      languageOptions: {
        parser: pluginFormat.parserPlain,
      },
      name: 'antfu:formatter:graphql',
      rules: {
        'format/prettier': [
          'error',
          {
            ...prettierOptions,
            parser: 'graphql',
          },
        ],
      },
    })
  }

  return configs
}
