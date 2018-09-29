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
        <a-form-item v-for="item in items" :key="item.name" :label="item.name" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="17">
            <a-slider v-model="item.value"></a-slider>
          </a-col>
          <a-col :span="3">
            <a-input-number v-model="item.value" style="marginLeft:16px"></a-input-number>
          </a-col>
        </a-form-item>
        <a-form-item>
          <a-textarea @keyup.alt.81="fillFormQ" @keyup.alt.65="fillFormA" @keyup.alt.90="fillFormZ"
                      @keyup.alt.87="fillFormW" @keyup.alt.83="fillFormS" @keyup.alt.88="fillFormX" v-model="assessData.comment" :autosize="{minRows: 3, maxRows: 12}" placeholder="please input your assessment about the job seeker."></a-textarea>
        </a-form-item>
        <a-form-item class="btn-container">
          <a-modal :visible="modalVisible" :closable="false" @cancel="modalVisible=false" :maskClosable="true" @ok="handleOperationOK" okText="OK" :confirmLoading="submitLoading">
            <span slot="title" style="color:lightskyblue"><a-icon type="question-circle-o" slot="title"></a-icon>  {{modalTitle}}</span>
            <a-input v-model="typedText"></a-input>
          </a-modal>
          <a-button class="submit-btn cancel-btn" :loading="submitLoading" @click="handleDeclineClick" type="danger" htmlType="submit">Decline</a-button>
          <a-button class="submit-btn accept-btn" :loading="submitLoading" @click="handleAcceptClick" type="primary" htmlType="submit">Accept</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import resumePanel from '../subComponent/resumePanel'
import assessComponent from '../subComponent/assessComponent'
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
      modalTitle: 'explain why he/she FAIL',
      modalVisible: false,
      operation: 'decline',
      confirmText: 'DECLINE',
      submitLoading: false,
      items: [],
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      }
    }
  },
  created () {
    this.assessId = this.$route.params['id']
    this.getData()
  },
  methods: {
    fillFormQ () {
      this.assessData.comment = 'just so so'
      this.assessData = Object.assign({}, this.assessData)
      const valArr = [55, 70, 75]
      let idx = 0
      this.items.forEach(tr => {
        tr.value = valArr[idx++]
      })
      this.items = this.items.map(o => Object.assign({}, o))
    },
    fillFormA () {
      this.assessData.comment = 'good worker'
      this.assessData = Object.assign({}, this.assessData)
      const valArr = [85, 90, 90]
      let idx = 0
      this.items.forEach(tr => {
        tr.value = valArr[idx++]
      })
      this.items = this.items.map(o => Object.assign({}, o))
    },
    fillFormZ () {
      this.assessData.comment = 'ordinary'
      this.assessData = Object.assign({}, this.assessData)
      const valArr = [90, 50, 85]
      let idx = 0
      this.items.forEach(tr => {
        tr.value = valArr[idx++]
      })
      this.items = this.items.map(o => Object.assign({}, o))
    },
    fillFormW () {
      this.assessData.comment = 'very good in every aspect'
      this.assessData = Object.assign({}, this.assessData)
      const valArr = [85, 85, 90]
      let idx = 0
      this.items.forEach(tr => {
        tr.value = valArr[idx++]
      })
      this.items = this.items.map(o => Object.assign({}, o))
    },
    fillFormS() {
      this.assessData.comment = 'not so fantanstic'
      this.assessData = Object.assign({}, this.assessData)
      const valArr = [60, 60, 65]
      let idx = 0
      this.items.forEach(tr => {
        tr.value = valArr[idx++]
      })
      this.items = this.items.map(o => Object.assign({}, o))
    },
    fillFormX () {
      this.assessData.comment = 'perfect'
      this.assessData = Object.assign({}, this.assessData)
      const valArr = [90, 90, 95]
      let idx = 0
      this.items.forEach(tr => {
        tr.value = valArr[idx++]
      })
      this.items = this.items.map(o => Object.assign({}, o))
    },
    getData () {
      // todo 这里需要获取item列表
      axios.get('assessment/' + this.assessId).then(response => {
        const stepId = response.data.stepList.find(tr => {
          return parseFloat(tr.index) === parseFloat(response.data.step.replace(/\++/gi, '').replace(/-+/gi, ''))
        }).id
        axios.get('job/items', {params: {stepId: stepId}}).then(res => {
          this.items = res.data
        })
        this.resume = response.data.resume
        this.assesses = response.data.assessments.map(tr => {
          return {
            department: tr.cooperator.department,
            name: tr.cooperator.name,
            time: moment(new Date(tr.assessmentTime).getTime()).format('YYYY-MM-DD HH-mm:ss'),
            content: tr.comment,
            step: tr.step,
            pass: tr.pass,
            items: tr.score === null ? [] : tr.score.trim().replace(/;$/gi, '').split(';').map(o => {
              return {name: o.split(':')[0], value: parseInt(o.split(':')[1])}
            })
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
      axios.put('assessment/' + this.assessId, {...this.assessData,
        id: this.assessId,
        pass: 'pass',
        applicationId: this.applicationId,
        step: this.step,
        items: this.items}).then(response => {
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
        step: this.step,
        items: this.items
      }).then(response => {
        this.finished = true
        this.submitLoading = false
      })
    },
    openDeclineModal () {
      this.typedText = ''
      this.operation = 'decline'
      this.modalTitle = 'there\'s no score lower than 60, explain why he/she FAIL'
      this.confirmText = 'DECLINE'
      this.modalVisible = true
    },
    openAcceptModal () {
      this.typedText = ''
      this.operation = 'accept'
      this.modalTitle = 'there\'s score lower than 60, explain why he/she PASS'
      this.confirmText = 'ACCEPT'
      this.modalVisible = true
    },
    handleOperationOK () {
      if (this.typedText.trim().length === 0) {
        this.$message.error('Please Input Reason!')
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
    },
    handleAcceptClick () {
      if (this.items.findIndex(tr => tr.value < 60) > -1) {
        this.openAcceptModal()
      } else {
        this.handleAccept()
      }
    },
    handleDeclineClick () {
      if (this.items.findIndex(tr => tr.value < 60) === -1) {
        this.openDeclineModal()
      } else {
        this.handleDecline()
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
