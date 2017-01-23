import Koa from 'koa'
import koaCors from 'kcors'
import koaBody from 'koa-body'
import koaRouter from 'koa-router'
import koaLogger from 'koa-logger'
import request from 'request-promise'
import loadConfig from './config'
import fs from 'fs'

const app = new Koa()
const logger = koaLogger()
const router = koaRouter()
const bodyParser = koaBody({ multipart: true, formidable: { multiples: false }, keepExtensions: true })
const cors = koaCors()
const config = loadConfig()

router.post('/recognize', async (ctx, next) => {
  const image = ctx.request.body.files.image

  const classifiersResponse = await request({
    url: config.url + '/v3/classifiers',
    qs: { api_key: config.apiKey, version: config.version },
    method: 'GET',
    json: true
  })

  const existingClassifier = classifiersResponse.classifiers[0]
  if (!existingClassifier) {
    throw new Error(`Couldn't find a classifier. You forgot to train it?`)
  }

  const recognitionResponse = await request({
    url: config.url + '/v3/classify',
    qs: { api_key: config.apiKey, version: config.version },
    method: 'POST',
    json: true,
    formData: {
      images_file: {
        value: fs.createReadStream(image.path),
        options: { filename: image.name, contentType: image.type }
      },
      parameters: Buffer.from(JSON.stringify({
        classifier_ids: [existingClassifier.classifier_id],
        threshold: '0.1'
      }))
    }
  })

  ctx.response.body = recognitionResponse.images[0]
})

app
  .use(logger)
  .use(cors)
  .use(bodyParser)
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(config.port, () => console.log(`Listening on port ${config.port}`))
