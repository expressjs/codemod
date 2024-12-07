export const TRANSFORM_OPTIONS = [
  {
    description: 'Transform the deprecated magic string "back"',
    value: 'magic-redirect',
    version: '5.0.0',
  },
  {
    description: 'Transform the methods to their pluralized versions',
    value: 'pluralized-methods',
    version: '5.0.0',
  },
  {
    description: 'Transform the deprecated signatures in Express v4',
    value: 'v4-deprecated-signatures',
    version: '5.0.0',
  },
  {
    description: 'Reverse param order for "redirect" method',
    value: 'redirect',
    version: '5.0.0',
  },
  {
    description: 'Change request.param() to dedicated methods',
    value: 'req-param',
    version: '5.0.0',
  },
  {
    description: 'Convert method name "sendfile" to "sendFile"',
    value: 'send-file',
    version: '5.0.0',
  },
  {
    description: 'Convert method name "del" to "delete"',
    value: 'full-name-delete',
    version: '5.0.0',
  },
]
