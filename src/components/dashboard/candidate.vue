<template>
  <div>candidate dashboard</div>
</template>

<script>
export default {
  name: 'candidate-dashboard',
  created () {
    this.$router.push({name: 'Resume Edit'})
  }
}
</script>

<style scoped>

</style>
