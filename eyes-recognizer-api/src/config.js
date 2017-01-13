import Ajv from 'ajv'
import dotenv from 'dotenv'

export default function () {
  dotenv.load()

  const schema = {
    type: 'object',
    properties: {
      port: { type: 'string' },
      url: { type: 'string', format: 'uri' },
      apiKey: { type: 'string' },
      version: { type: 'string' },
      classifierId: { type: 'string' }
    },
    required: 'port url apiKey version'.split(' ')
  }

  const config = {
    port: process.env.PORT,
    url: process.env.RECOGNITION_API_URL,
    apiKey: process.env.API_KEY,
    version: process.env.VERSION,
    classifierId: process.env.CLASSIFIER_ID
  }

  const validator = new Ajv({ allErrors: true })

  if (validator.validate(schema, config)) {
    return config
  }

  throw new Error(validator.errorsText())
}
