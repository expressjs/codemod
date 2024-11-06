import magicRedirect from './transforms/magic-redirect'
import pluralizedMethods from './transforms/pluralized-methods'

export const TRANSFORM_OPTIONS = [
  {
    description: 'Transform the deprecated magic string "back"',
    value: 'magic-redirect',
    version: '5.0.0',
    codemod: magicRedirect,
  },
  {
    description: 'Transform the methods to their pluralized versions',
    value: 'pluralized-methods',
    version: '5.0.0',
    codemod: pluralizedMethods,
  },
  //{ description: 'Transform the deprecated signatures in Express v4', value: 'signature-deprecated', version: '5.0.0' },
]
