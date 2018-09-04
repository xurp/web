<template>
  <div class="application-container">
    <a-divider/>
    <a-steps :current="stepIndex">
      <a-step v-for="curstep in steps" :key="curstep.index" :title="curstep.name" :status="getStepStatus(curstep)">
        <a-icon v-if="getIfIcon(curstep)" type="loading" slot="icon"/>
      </a-step>
    </a-steps>
    <a-divider/>
    <resumePanel :resumeData="resume"></resumePanel>
    <a-divider/>
    <assessComponent :key="assess.time" v-for="assess in assesses" v-bind:assessData="assess">
      <a-divider/>
    </assessComponent>
  </div>
</template>

<script>
import axios from '../../service'
import moment from 'moment'
import resumePanel from './resumePanel'
import assessComponent from './assessComponent'

export default {
  name: 'application-detail',
  components: {assessComponent, resumePanel},
  data () {
    return {
      curApplication: {},
      step: '',
      applicationList: [],
      steps: [],
      stepIndex: 0,
      resume: {},
      assesses: []
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      axios.get('application/' + localStorage.getItem('applicationId')).then(response => {
        this.curApplication = response.data
        this.curApplication.createTime = moment(new Date(response.data.createTime).getTime()).format('YYYY-MM-DD HH:mm:ss')
        this.curApplication.updateTime = moment(new Date(response.data.updateTime).getTime()).format('YYYY-MM-DD HH:mm:ss')
        this.step = this.curApplication.step
        this.resume = this.curApplication.resume
        return response.data.job.id
      }).then(jobId => {
        axios.get('job/' + jobId).then(response => {
          this.steps = response.data.step
          this.stepIndex = this.steps.findIndex(tr => {
            return tr.index === parseFloat(this.step.replace('+', '').replace('-', ''))
          })
        })
      })
      axios.get('assessment?applicationId=' + localStorage.getItem('applicationId')).then(response => {
        console.log(response.data)
        this.assesses = response.data.map(tr => {
          return {id: tr.id, department: tr.cooperator.department, name: tr.cooperator.name, time: moment(new Date(tr.assessmentTime).getTime()).format('YYYY-MM-DD HH-mm:ss'), content: tr.comment}
        })
      })
    },
    getStepStatus (curStep) {
      const stepNum = parseFloat(this.step.replace('+', '').replace('-', ''))
      if (curStep.index === stepNum) {
        if (this.step.indexOf('+') > -1) {
          return 'finish'
        } else if (this.step.indexOf('-') > -1) {
          return 'error'
        } else {
          return 'process'
        }
      } else if (curStep.index < stepNum) {
        return 'finish'
      } else {
        return 'wait'
      }
    },
    getIfIcon (curStep) {
      const stepNum = parseFloat(this.step.replace('+', '').replace('-', ''))
      if (curStep.index === stepNum && this.step.indexOf('+') === -1 && this.step.indexOf('-') === -1) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped lang="less">
.application-container{
  margin-top: -24px;
}
</style>
