<template>
  <div class="assess-container">
    <h1 style="width:100%;text-align:center;margin-top:50px;">Interview Assessment</h1>
    <div v-if="finished" style="width:100%;height:100%;">
      <a-alert message="Success Tips" description="You have submitted assessment successfully."
      type="success"
      showIcon/>
    </div>
    <div v-else>
      <resumePanel :resumeData="resume"></resumePanel>
      <a-divider/>
      <assessComponent v-bind:steps="steps" v-bind:assesses="assesses"></assessComponent>
      <a-form>
        <a-form-item>
          <a-textarea v-model="assessData.comment" :autosize="{minRows: 3, maxRows: 12}" placeholder="please input your assessment about the job seeker."></a-textarea>
        </a-form-item>
        <a-form-item class="btn-container">
          <a-modal :visible="modalVisible" :closable="false" @cancel="modalVisible=false" :maskClosable="true" @ok="handleOperationOK" okText="OK">
            <span slot="title" style="color:lightskyblue"><a-icon type="question-circle-o" slot="title"></a-icon>  {{modalTitle}}</span>
            <a-input v-model="typedText"></a-input>
          </a-modal>
          <a-button class="submit-btn cancel-btn" :loading="submitLoading" @click="openDeclineModal" type="danger" htmlType="submit">Decline</a-button>
          <a-button class="submit-btn accept-btn" :loading="submitLoading" @click="openAcceptModal" type="primary" htmlType="submit">Accept</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import resumePanel from '../application/resumePanel'
import assessComponent from '../application/assessComponent'
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
      step: '',
      declineVisible: false,
      typedText: '',
      modalTitle: 'type DECLINE and click OK to proceed decline',
      modalVisible: false,
      operation: 'decline',
      confirmText: 'DECLINE',
      submitLoading: false
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
      }, error => {
        console.error(error)
        this.finished = true
      })
    },
    handleAccept () {
      this.submitLoading = true
      axios.put('assessment/' + this.assessId, {...this.assessData, id: this.assessId, pass: 'pass', applicationId: this.applicationId, step: this.step}).then(response => {
        this.finished = true
        this.submitLoading = false
      })
    },
    handleDecline () {
      this.submitLoading = true
      axios.put('assessment/' + this.assessId, {
        ...this.assessData,
        id: this.assessId,
        pass: 'fail',
        applicationId: this.applicationId,
        step: this.step
      }).then(response => {
        this.finished = true
        this.submitLoading = false
      })
    },
    openDeclineModal () {
      this.typedText = ''
      this.operation = 'decline'
      this.modalTitle = 'type DECLINE and click OK to proceed decline'
      this.confirmText = 'DECLINE'
      this.modalVisible = true
    },
    openAcceptModal () {
      this.typedText = ''
      this.operation = 'accept'
      this.modalTitle = 'type ACCEPT and click OK to proceed accept'
      this.confirmText = 'ACCEPT'
      this.modalVisible = true
    },
    handleOperationOK () {
      if (this.confirmText !== this.typedText) {
        this.$message.error('wrong input')
        return
      }
      switch (this.operation) {
        case 'decline':
          this.handleDecline()
          break
        case 'accept':
          this.handleAccept()
          break
      }
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
