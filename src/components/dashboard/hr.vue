<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="8">
        <position-statistics/>
      </a-col>
      <a-col :span="8">
        <candidate-statistics/>
      </a-col>
      <a-col :span="8">
        <hr-statistics/>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col :span="12">
        <candidate-chart-statistics/>
      </a-col>
      <a-col :span="12">
        <offer-chart-statistics/>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import PositionStatistics from './statistics/position'
import CandidateStatistics from './statistics/candidate'
import HrStatistics from './statistics/hr'
import CandidateChartStatistics from './statistics/candidate-chart'
import OfferChartStatistics from './statistics/offer-chart'
export default {
  name: 'hr-dashboard',
  components: {
    OfferChartStatistics,
    CandidateChartStatistics,
    HrStatistics,
    CandidateStatistics,
    PositionStatistics
  }
}
</script>

<style scoped>
</style>
