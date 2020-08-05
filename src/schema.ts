const noEmptyStr = { type: 'string', minLength: 1 }

export default {
  type: 'object',
  additionalProperties: false,
  properties: {
    entry: {
      oneOf: [noEmptyStr, { type: 'array', items: noEmptyStr }]
    } ,
    file: { type: 'string' },
    esm: {
      oneOf: [
        noEmptyStr,
        { type: 'boolean' },
        {
          type: 'object',
          additionalProperties: false,
          properties: {
            type: {
              type: 'string',
              pattern: '^(rollup|babel)$',
            },
            file: noEmptyStr,
            mjs: { type: 'boolean' },
            minify: { type: 'boolean' },
            importLibToEs: {
              type: 'boolean',
            },
          },
        },
      ]
    },
    cjs: {
      oneOf: [
        noEmptyStr,
        { type: 'boolean' },
        {
          type: 'object',
          additionalProperties: false,
          properties: {
            type: {
              type: 'string',
              pattern: '^(rollup|babel)$',
            },
            file: noEmptyStr,
            minify: { type: 'boolean' },
            lazy: { type: 'boolean' },
          },
        },
      ],
    }
  },
}