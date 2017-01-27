<template>
  <div>
    <div class='Wrapper' v-for='image in images'>
      <img :src='image.src'></img>
      <pre>{{prettyJSON(image.analysis)}}</pre>
    </div>
  </div>
</template>

<script>
export default {
  props: ['images'],
  methods: {
    prettyJSON (json) {
      return JSON.stringify(json, null, 2)
    }
  }
}
</script>

<style scoped>
img {
  height: 200px;
  border: 1px solid rgba(117, 24, 160, 0.2);
  padding: 5px;
  background-color: #FFFFFF;
  border-radius: 5px;
  margin: 5px;
}

pre {
  padding: 10px;
  margin: 5px;
  font-size: 10px;
  background-color: #FFFFFF;
  border-radius: 5px;
}

.Wrapper {
  display: flex;
  flex-direction: row;
  margin: 10px;
}
</style>
