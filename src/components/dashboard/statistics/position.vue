<template>
  <a-card style="margin-bottom: 16px">
    <div slot="title" align="center">Positions</div>
    <div align="center">{{totalPositionNum}}</div>
  </a-card>
</template>

<script>
export default {
  name: 'position-statistics',
  props: {
    totalPositionNum: 0
  }
}
</script>

<style scoped>

</style>
