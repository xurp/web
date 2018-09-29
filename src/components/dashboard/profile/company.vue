<template>
  <a-card title="Company Profile" style="margin-bottom: 16px">
    <div @click.ctrl="downloadDemoExcel" align="center" style="font-size: 24px">{{window.user.companyName}}</div>
    <a-divider/>
    <div align="center">{{window.user.legalPerson}}</div>
  </a-card>
</template>

<script>
export default {
  name: 'company-profile',
  methods: {
    downloadDemoExcel () {
      console.log(1)
      let link = document.createElement('a')
      link.style.display = 'none'
      // link.target = '_blank'
      link.href = '/static/Demo_RecruitRecord.xls'
      document.body.appendChild(link)
      link.click()
    }
  }
}
</script>

<style scoped>
</style>
