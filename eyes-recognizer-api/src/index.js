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
  // with GET
  // const recognitionResponse = await request({
  //   url: config.url + '/v3/classify',
  //   qs: { api_key: config.apiKey, version: config.version, url: 'http://kingofwallpapers.com/driver/driver-005.jpg' },
  //   method: 'GET',
  //   json: true
  // })

  // with POST
  const image = ctx.request.body.files.image
  const recognitionResponse = await request({
    url: config.url + '/v3/classify',
    qs: { api_key: config.apiKey, version: config.version },
    method: 'POST',
    formData: {
      images_file: {
        value: fs.createReadStream(image.path),
        options: { filename: image.name, contentType: image.type }
      }
    }
  })

  ctx.response.body = recognitionResponse
})

app
  .use(cors)
  .use(bodyParser)
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(config.port)
