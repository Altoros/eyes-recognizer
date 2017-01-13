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
