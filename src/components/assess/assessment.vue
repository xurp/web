<template>
  <div class="assess-container">
    <div v-if="finished" style="width:100%;height:100%;text-align:center;vertical-align:middle;"><h1>Thank you for assessment.</h1></div>
    <div v-else>
      <resumePanel :resumeData="resume"></resumePanel>
      <a-divider/>
      <assessPanel v-bind:assesses="assesses" v-bind:steps="steps"></assessPanel>
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
import assessPanel from '../position/assessComponent'
import axios from '../../service'
export default {
  name: 'assessment',
  components: {resumePanel, assessPanel},
  data () {
    return {
      resume: {},
      assesses: [],
      steps: [],
      assessData: {},
      assessId: '',
      finished: false,
      applicationId: ''
    }
  },
  created () {
    this.assessId = this.$route.params['id']
    this.getData()
  },
  methods: {
    getData () {
      axios.get('assessment/' + this.assessId).then(response => {
        this.resume = response.data.resume
        this.assesses = response.data.assessments
        this.steps = response.data.stepList
        this.applicationId = response.data.applicationId
        if (this.assesses === undefined || this.assesses.length === 0) {
          this.finished = true
        }
      }, error => {
        console.log(error)
        this.finished = true
      })
    },
    handleAccept () {
      axios.put('assessment/' + this.assessId, {...this.assessData, id: this.assessId, pass: 'pass', applicationId: this.applicationId}).then(response => {
        this.finished = true
      })
    },
    handleDecline () {
      axios.put('assessment/' + this.assessId, {...this.assessData, id: this.assessId, pass: 'fail', applicationId: this.applicationId}).then(response => {
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
