<template>
  <div id='app'>
    <div class='UploadedImage' v-for='image in images'>
      <img class='UploadedImage__Image' :src='image.src'></img>
      <div class='UploadedImage__Conclusion'>{{image.analysis}}</div>
    </div>
    <form @submit.prevent='upload'>
      <img class='Preview' :src='previewSrc'></img>
      <input ref='fileInput' type='file' @change='preview'>
      <div v-if='uploading' class='Spinner'></div>
      <div v-if='uploadError'>{{uploadError}}</div>
      <button :disabled='uploading' type='submit'>Submit</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'app',
  components: {},
  data () {
    return {
      previewSrc: '',
      images: [],
      uploading: false,
      uploadError: null
    }
  },
  methods: {
    preview (e) {
      const reader = new window.FileReader()
      reader.onload = (e) => { this.previewSrc = e.target.result }
      reader.readAsDataURL(e.target.files[0])
    },
    upload (e) {
      this.uploading = true

      const data = new window.FormData()
      data.append('image', this.$refs.fileInput.files[0])

      axios.post('http://localhost:3000/recognize', data)
        .then((response) => {
          this.images.push({
            src: this.previewSrc,
            analysis: response.data
          })

          this.previewSrc = ''
          e.target.reset()

          this.uploading = false
        })
        .catch((e) => {
          this.uploadError = e.message
          this.uploading = false
          setTimeout(() => { this.uploadError = null }, 3000)
        })
    }
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Lato:100,300,700');

  * {
    margin: 0px;
    padding: 0px;
  }

  #app {
    font-family: 'Lato', sans-serif;
    font-weight: 300;
    min-height: 100vh;
  }

  .Preview {
    max-height: 50px;
  }

  .UploadedImage__Image {
    max-height: 100px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg)
    }
    100% {
      transform: rotate(360deg)
    }
  }

  .Spinner {
    border-radius: 50%;
    width: 12px;
    height: 12px;
    border: 2px solid rgba(100, 100, 100, 0.2);
    border-top-color: #105CD7;
    animation: spin 1s infinite linear;
    margin: 5px 10px;
  }
</style>
