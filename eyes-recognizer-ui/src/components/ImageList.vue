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
