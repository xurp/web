<template>
  <a-card style="margin-bottom: 16px">
    <div slot="title" align="center">HRs</div>
    <div align="center">{{totalHrNum}}</div>
  </a-card>
</template>

<script>
export default {
  name: 'hr-statistics',
  props: {
    totalHrNum: 0
  }
}
</script>

<style scoped>

</style>
