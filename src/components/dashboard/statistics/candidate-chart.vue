<template>
  <a-card style="margin-bottom: 16px">
    <div slot="title" align="center">Candidate Applied in Departments</div>
    <ve-pie :data="chartData" :settings="{roseType: 'radius'}"/>
  </a-card>
</template>

<script>
export default {
  name: 'candidate-chart-statistics',
  data: () => ({
    chartData: {
      columns: ['Department', 'Candidates'],
      rows: []
    }
  }),
  props: {
    dataByDepartment: {
      type: Array
    }
  },
  watch: {
    dataByDepartment () {
      this.chartData = {
        columns: ['Department', 'Candidates'],
        rows: this.dataByDepartment
      }
    }
  }
}
</script>

<style scoped>

</style>
