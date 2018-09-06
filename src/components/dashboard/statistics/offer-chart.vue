<template>
  <a-card style="margin-bottom: 16px">
    <div slot="title" align="center">Offer Ratio in Departments</div>
    <ve-pie :data="chartData" :settings="{roseType: 'radius'}"/>
  </a-card>
</template>

<script>
export default {
  name: 'offer-chart-statistics',
  data: () => ({
    chartData: {
      columns: ['Department', 'Candidates'],
      rows: [
        { 'Department': 'QC', 'Candidates': 7 / 13 },
        { 'Department': 'Dev', 'Candidates': 22 / 35 },
        { 'Department': 'Sales', 'Candidates': 3 / 29 },
        { 'Department': 'HR', 'Candidates': 9 / 17 }
      ]
    }
  })
}
</script>

<style scoped>

</style>
