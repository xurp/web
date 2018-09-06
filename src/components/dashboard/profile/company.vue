<template>
  <a-card title="Company Profile" style="margin-bottom: 16px">
    <div align="center" style="font-size: 24px">{{window.user.companyName}}</div>
    <a-divider/>
    <div align="center">{{window.user.legalPerson}}</div>
  </a-card>
</template>

<script>
export default {
  name: 'company-profile'
}
</script>

<style scoped>
</style>
