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
