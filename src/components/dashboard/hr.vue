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
    <a-row>
      <a-col :span="24" style="text-align:center;">
        <a-button class="statics-export" v-on:click="handleExportExcel" :loading="btnLoading">Export all recruitment statics</a-button>
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
      dataByDepartment: [],
      btnLoading: false
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
    },
    handleExportExcel () {
      this.btnLoading = true
      // tododone 待测
      axios.get('/dashboard/export', {responseType: 'blob'}).then(response => {
        this.btnLoading = false
        let url = window.URL.createObjectURL(response.data)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', 'positionApplicationStatics.xlsx')
        document.body.appendChild(link)
        link.click()
      }, error => {
        this.btnLoading = false
        console.error(error)
      })
    }
  }
}
</script>

<style scoped>
</style>
