<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import axios from './service'
export default {
  name: 'App',
  created () {
    axios.get('auth').then(r => {
      window.user = r.data
    })
  }
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
