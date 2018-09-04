<template>
  <div class="application-container">
    <a-divider/>
    <a-steps :current="stepIndex">
      <a-step v-for="curstep in steps" :key="curstep.index" :title="curstep.name" :status="getStepStatus(curstep)">
        <a-icon v-if="getIfIcon(curstep)" type="loading" slot="icon"/>
      </a-step>
    </a-steps>
    <a-divider/>
    <!--TODO 这里加个人简历，下面加评价列表，最后是操作按钮-->
    <resumePanel :resumeData="resume"></resumePanel>
    <a-divider/>
    <a-table :dataSource="applicationList">
      <a-table-column title="Name" key="name" dataIndex="name"></a-table-column>
      <a-table-column title="School" key="school" dataIndex="school"></a-table-column>
      <a-table-column title="Major" key="major" dataIndex="major"></a-table-column>
      <a-table-column title="Age" key="age" dataIndex="age"></a-table-column>
      <a-table-column title="Gender" key="gender" dataIndex="gender"></a-table-column>
      <a-column title="Action" key="action">
        <a slot-scope="text,record" v-on:click="detailApplicatioin(record)">Detail/Operation</a>
      </a-column>
    </a-table>
  </div>
</template>

<script>
import axios from '../../service'
import moment from 'moment'
import resumePanel from './resumePanel'
export default {
  name: 'application-detail',
  components: {resumePanel},
  data () {
    return {
      curApplication: {},
      step: '',
      applicationList: [],
      steps: [],
      stepIndex: 0,
      resume: {}
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      axios.get('application/' + this.$route.params.id).then(response => {
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
    },
    detailApplicatioin (record) {
      axios.get('application/' + record.id).then(response => {
      })
      this.$router.push('/position/')
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
