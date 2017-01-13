import loadConfig from '../config'
import fs from 'fs'
import path from 'path'
import request from 'request-promise'

async function train () {
  const config = loadConfig()

  const classifiersResponse = await request({
    url: config.url + '/v3/classifiers',
    qs: { api_key: config.apiKey, version: config.version },
    method: 'GET',
    json: true
  })

  if (classifiersResponse.classifiers[0]) {
    await request({
      url: config.url + '/v3/classifiers/' + classifiersResponse.classifiers[0].classifier_id,
      qs: { api_key: config.apiKey, version: config.version },
      method: 'DELETE'
    })
  }

  const newClassifier = await request({
    url: config.url + '/v3/classifiers',
    qs: { api_key: config.apiKey, version: config.version },
    method: 'POST',
    formData: {
      name: 'eyes',
      opened_eyes_positive_examples: {
        value: fs.createReadStream(path.join(__dirname, 'opened_eyes.zip')),
        options: { filename: 'opened_eyes.zip', contentType: 'application/zip' }
      },
      negative_examples: {
        value: fs.createReadStream(path.join(__dirname, 'closed_eyes.zip')),
        options: { filename: 'closed_eyes.zip', contentType: 'application/zip' }
      }
    }
  })

  console.log(newClassifier)
}

train()
