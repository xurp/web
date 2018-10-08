<template>
  <div>admin dashboard</div>
</template>

<script>
export default {
  name: 'admin-dashboard',
  created () {
    this.$router.push({name: 'HR Verify'})
  }
}
</script>

<style scoped>

</style>
