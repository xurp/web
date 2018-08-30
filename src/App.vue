<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    window.user = {}
    this.$fetchUser()
  }
}
</script>

<style lang="less">
</style>
