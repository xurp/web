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
      rows: [
        { 'Department': 'QC', 'Candidates': 13 },
        { 'Department': 'Dev', 'Candidates': 35 },
        { 'Department': 'Sales', 'Candidates': 29 },
        { 'Department': 'HR', 'Candidates': 17 }
      ]
    }
  })
}
</script>

<style scoped>

</style>
