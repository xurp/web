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
  </div>
</template>

<script>
import PositionStatistics from './statistics/position'
import CandidateStatistics from './statistics/candidate'
import HrStatistics from './statistics/hr'
export default {
  name: 'hr-dashboard',
  components: {
    HrStatistics,
    CandidateStatistics,
    PositionStatistics
  }
}
</script>

<style scoped>
</style>
