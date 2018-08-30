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
    window.user = {}
    axios.get('auth', localStorage.getItem('token')).then(r => {
      window.user = r.data
    })
  }
}
</script>

<style lang="less">
</style>
