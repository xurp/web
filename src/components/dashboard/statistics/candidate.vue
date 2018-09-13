<template>
  <a-card style="margin-bottom: 16px">
    <div slot="title" align="center">Candidate</div>
    <div align="center">{{totalCandidateNum}}</div>
  </a-card>
</template>

<script>
export default {
  name: 'candidate-statistics',
  props: {
    totalCandidateNum: 0
  }
}
</script>

<style scoped>

</style>
