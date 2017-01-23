# Eyes Recognizer Application

Use case for this application is to check whatever the eyes of the person on the photo are open.
It uses Watson Visual Recognition service to train the classifier and yield results.

## Prerequisites
* Git
* Node.js 4.x or higher with NPM 3.x or higher
* Bluemix account

## First steps
* Clone the repo `git clone https://github.com/marvelousNinja/eyes-recognizer.git`
* Repository contains completed application at `master` branch and the starting point at `starting-point` branch. Checkout the starting point with `git checkout starting-point`

## Building the UI
* Using the command line, navigate to the `eyes-recognizer-ui` directory and install dependencies with `npm install`
* Open the `eyes-recognizer-ui` directory in your favourite code editor
* Run the development server with `npm run dev`. That should automatically launch the default web browser
* Observe the contents of `./src` directory. Make some changes to HTML in `./src/App.vue`. Observe how the page in the browser window updates accoridngly
* Pause for the discussion on build artifacts. Create a build artifact for deployment with `npm run build`. Observe the contents of `./dist` directory
* Create a `./manifest.yml` file:
```
applications:
- name: eyes-recognizer-ui
  memory: 64M
  buildpack: https://github.com/cloudfoundry/staticfile-buildpack.git
  path: ./dist
  host: eyes-recognizer-ui-<<YOUR-NAME>>
```
* Finally, deploy the application using the command line: `cf push`
* Pause for the discussion on routes. Observe the command line output for a URL of the deployed app. Open it and validate that it's working. Check both HTTP and HTTPS access
* Pause for the discussion on buildpacks. Observe the contents of `./manifest.yml` and take a look at documentation at http://docs.cloudfoundry.org/buildpacks/staticfile/index.html
* Let's create actual uploader UI. Create `./src/components/ImageList.vue` with the following contents:
```
<template>
  <div>
    <div v-for='image in images'>
      <img :src='image.src'></img>
      <div>{{image.analysis}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['images']
}
</script>

<style scoped>
img {
  max-height: 100px;
}
</style>
```
* Now, let's create `./src/components/Spinner.vue`:
```
<template>
  <div></div>
</template>

<style scoped>
@keyframes spin {
  0% { transform: rotate(0deg) }
  100% { transform: rotate(360deg) }
}

div {
  border-radius: 50%;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(100, 100, 100, 0.2);
  border-top-color: #105CD7;
  animation: spin 1s infinite linear;
  margin: 5px 10px;
}
</style>
```
* Next, the the Uploader component at `./src/components/Uploader.vue`:
```
<template>
  <form @submit.prevent='upload'>
    <input type='file' @change='preview'>
    <button :disabled='uploading' type='submit'>Submit</button>
    <Spinner v-if='uploading'/>
    <div v-if='uploadError'>{{uploadError}}</div>
    <img :src='previewSrc'></img>
  </form>
</template>

<script>
import axios from 'axios'
import Spinner from './Spinner'

export default {
  components: { Spinner },
  data () {
    return {
      previewSrc: null,
      uploadError: null,
      formData: null,
      uploading: false
    }
  },
  methods: {
    preview (e) {
      const reader = new window.FileReader()
      reader.onload = (e) => { this.previewSrc = e.target.result }
      reader.readAsDataURL(e.target.files[0])

      this.formData = new window.FormData()
      this.formData.append('image', e.target.files[0])
    },
    upload (e) {
      this.uploading = true
      axios.post(process.env.API_URL + '/recognize', this.formData)
        .then((response) => {
          this.$emit('uploaded', { src: this.previewSrc, analysis: response.data })
          this.previewSrc = null
          this.uploading = false
          this.formData = null
          e.target.reset()
        })
        .catch((e) => {
          this.uploading = false
          this.uploadError = e.response ? `${e.response.status} ${e.response.data}` : e.message
          setTimeout(() => { this.uploadError = null }, 3000)
        })
    }
  }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

img {
  max-height: 100px;
}
</style>
```
* Finally, replace the contents of `./src/App.vue` to use the components we've just created:
```
<template>
  <div id='app'>
    <ImageList :images='images'/>
    <Uploader @uploaded='onUploaded'/>
  </div>
</template>

<script>
import ImageList from './components/ImageList'
import Uploader from './components/Uploader'

export default {
  name: 'app',
  components: { Uploader, ImageList },
  data () {
    return {
      images: []
    }
  },
  methods: {
    onUploaded (image) {
      this.images.push(image)
    }
  }
}
</script>
```
* Check the UI in the browser. Upload form should be visible, but will fire errors since we don't have API yet. It is time to implement API microservice

## Building the API
* Using the command line, navigate to the `eyes-recognizer-api` directory and install dependencies with `npm install`
* Naviate to Bluemix Catalog and create Visual Recognition service: https://console.ng.bluemix.net/catalog/services/visual-recognition/
* Open the *Service Credentials* tab and click on *View Credentials*. Copy the contents, we will need them later
* Open the `chat-bot-api` directory in your favourite code editor
* Create `.env` file using contents from sample file nearby
* Replace contents of `RECOGNITION_API_URL`, `API_KEY` variables with values collected on previous steps
* Download archives with training images https://drive.google.com/drive/folders/0B09oCGkIGumzbUszMnNCei1KdWM?usp=sharing
* Pause for the discussion on classifiers. Copy files to `./src/tasks`. Train the Watson to recognize the eyes: `npm run train`.
* Run the development server with `npm run dev`
* Pause for the discussion on configuration. Observe the contents of `./src/config.js`.
* Pause for the discussion on build artifacts. Create a build artifact for deployment with `npm run build`. Observe the contents of `./dist` directory
* Create a `./manifest.yml` file:
```
applications:
- name: eyes-recognizer-api
  memory: 128M
  buildpack: https://github.com/cloudfoundry/nodejs-buildpack
  host: eyes-recognizer-api-<<YOUR-NAME>>
```
* Finally, deploy the application using the command line: `cf push`. Observe the command line output for a URL of the deployed app
* Pause for the discussion on logs. Print the logs of the application with `cf logs --recent eyes-recognizer-api`
* Open a `eyes-recognizer-ui` in your code editor and modify `./config/prod.env.js` with the URL of the deployed API
* Rebuild and redeploy the `eyes-recognizer-ui` with `npm run build` and `cf push`
* Open the URL of deployed `eyes-recognizer-ui` and try to analyze a couple of images

## Retraining the classifier
* Open the `eyes-recognizer-api` directory in your code editor and observe contents of `./src/tasks/train.js`
* Modify contents of training archives and execute `npm run train`
* Note, that training destroys the old classifier and creates a new one. Make sure to change the `CLASSIFIER_ID` in the configuration and redeploy the application

## Additional exercises
* Consult with the documentation http://www.ibm.com/watson/developercloud/doc/visual-recognition/classifiers-tutorials.shtml and create your own classifier. Take time to collect the samples

