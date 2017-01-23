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
