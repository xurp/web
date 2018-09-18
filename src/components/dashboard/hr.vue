<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="8">
        <position-statistics v-bind:totalPositionNum="totalPositionNum"/>
      </a-col>
      <a-col :span="8">
        <candidate-statistics v-bind:totalCandidateNum="totalCandidateNum"/>
      </a-col>
      <a-col :span="8">
        <hr-statistics :totalHrNum="totalHrNum"/>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col :span="12">
        <candidate-chart-statistics :dataByDepartment="dataByDepartment"/>
      </a-col>
      <a-col :span="12">
        <offer-chart-statistics :dataByDepartment="dataByDepartment"/>
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
import axios from '../../service'
export default {
  name: 'hr-dashboard',
  data () {
    return {
      totalPositionNum: 0,
      totalCandidateNum: 0,
      totalHrNum: 0,
      dataByDepartment: []
    }
  },
  components: {
    OfferChartStatistics,
    CandidateChartStatistics,
    HrStatistics,
    CandidateStatistics,
    PositionStatistics
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      axios.get('dashboard/hr').then(response => {
        const data = response.data
        this.totalCandidateNum = data.candidateCnt
        this.totalHrNum = data.hrCnt
        this.totalPositionNum = data.jobCnt
        this.dataByDepartment = data.deptList.map(tr => {
          return {
            Department: tr.split('-')[0],
            Candidates: parseInt(tr.split('-')[1]),
            Offers: parseInt(tr.split('-')[2])
          }
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
