import Koa from 'koa'
import koaCors from 'kcors'
import koaBody from 'koa-body'
import koaRouter from 'koa-router'
import request from 'request-promise'
import loadConfig from './config'
import fs from 'fs'

const app = new Koa()
const router = koaRouter()
const bodyParser = koaBody({ multipart: true, formidable: { multiples: false }, keepExtensions: true })
const cors = koaCors()
const config = loadConfig()

router.post('/recognize', async (ctx, next) => {
  const image = ctx.request.body.files.image
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
        classifier_ids: [config.classifierId],
        threshold: '0.1'
      }))
    }
  })

  ctx.response.body = recognitionResponse.images[0]
})

app
  .use(cors)
  .use(bodyParser)
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(config.port)
