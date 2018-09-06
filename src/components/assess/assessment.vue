<template>
  <div class="assess-container">
    <div v-if="finished" style="width:100%;height:100%;text-align:center;vertical-align:middle;"><h1>Thank you for assessment.</h1></div>
    <div v-else>
      <resumePanel :resumeData="resume"></resumePanel>
      <a-divider/>
      <assessComponent v-bind:steps="steps" v-bind:assesses="assesses"></assessComponent>
      <a-form>
        <a-form-item>
          <a-textarea v-model="assessData.comment" :autosize="{minRows: 3, maxRows: 12}" placeholder="please input your assessment about the job seeker."></a-textarea>
        </a-form-item>
        <a-form-item class="btn-container">
          <a-button class="submit-btn cancel-btn" @click="handleDecline" type="danger" htmlType="submit">Decline</a-button>
          <a-button class="submit-btn accept-btn" @click="handleAccept" type="primary" htmlType="submit">Accept</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import resumePanel from '../position/resumePanel'
import assessComponent from '../position/assessComponent'
import axios from '../../service'
import moment from 'moment'
export default {
  name: 'assessment',
  components: {resumePanel, assessComponent},
  data () {
    return {
      resume: {},
      assesses: [],
      steps: [],
      assessData: {},
      assessId: '',
      finished: false,
      applicationId: '',
      step: ''
    }
  },
  created () {
    this.assessId = this.$route.params['id']
    this.getData()
  },
  methods: {
    getData () {
      axios.get('assessment/' + this.assessId).then(response => {
        console.log(response.data)
        this.resume = response.data.resume
        this.assesses = response.data.assessments.map(tr => {
          return {
            department: tr.cooperator.department,
            name: tr.cooperator.name,
            time: moment(new Date(tr.assessmentTime).getTime()).format('YYYY-MM-DD HH-mm:ss'),
            content: tr.comment,
            step: tr.step,
            pass: tr.pass
          }
        })
        this.steps = response.data.stepList
        this.step = response.data.step
        this.applicationId = response.data.applicationId
        console.log(this.assesses)
      }, error => {
        console.error(error)
        this.finished = true
      })
    },
    handleAccept () {
      axios.put('assessment/' + this.assessId, {...this.assessData, id: this.assessId, pass: 'pass', applicationId: this.applicationId, step: this.step}).then(response => {
        this.finished = true
      })
    },
    handleDecline () {
      axios.put('assessment/' + this.assessId, {...this.assessData, id: this.assessId, pass: 'fail', applicationId: this.applicationId, step: this.step}).then(response => {
        this.finished = true
      })
    }
  }
}
</script>

<style scoped lang="less">
.assess-container{
  width: 70vw;
  margin: auto;
  .btn-container{
    text-align:center;
  }
  .submit-btn{
    width: 20vh;
  }
  .cancel-btn{
    margin-right: 5vh
  }
  .accept-btn{
    margin-left: 5vh;
  }
}
</style>
