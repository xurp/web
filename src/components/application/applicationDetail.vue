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
    <assessComponent v-bind:steps="steps" v-bind:assesses="assesses"></assessComponent>
    <a-divider/>
    <!--<div v-if="step.indexOf('+')===-1 && step.indexOf('-')===-1 && assesses.length > 0 && stepIndex!==steps.length-1">-->
    <div v-if="stepIndex!==steps.length-1">
      If assessors misoperated assessment result, please
      <a @click="resetAssessment">Reset current assessment result and resend assess link.</a>
      <br/>
      Or, if arrangement is unsuitable, you can
      <a @click="reArrange">Rearrange assessment time.</a>
    </div>
    <router-link v-if="stepIndex===steps.length-1" :to="{name: 'Offer List'}">Candidate has passed all assessment process, Click to go to offer management.</router-link>
    <div class="bottom-container" slot="footer">
      <a-button :disabled="!(assesses.length > 0 && assesses[assesses.length - 1].pass==='fail' || stepIndex ==0) || step.indexOf('--')>-1" class="fail-btn" type="danger" v-on:click="handleDecline">Decline</a-button>
      <a-button :disabled="!(assesses.length > 0 && assesses[assesses.length - 1].pass==='pass' || stepIndex ==0 && step.indexOf('-')===-1) || stepIndex===steps.length-1" :loading="nextBtnConfirmLoading" class="next-btn" type="primary" v-on:click="handleNextStep">Next</a-button>
    </div>
    <a-modal class="mail-modal" :confirmLoading="mailConfirmLoading" width="680px" okText="Send" :title="'operation for ' + resume.name" :visible="popMailVisible" v-on:cancel="handleMailCancel" @ok="handleMailSend" :maskClosable="false" :closable="true">
      <div class="mail-form-container">
        <mail-component :mail="mail" :is-receiver-list="bSendToAssess||bReArrange||bResetAsessResult" :receiver-list="cooperatorList" :show-add-receiver="!bResetAsessResult||bDecline" select-mode="default"
                        :show-date="bReArrange||(bSendToAssess&&!bResetAsessResult)" :email-type="emailType" @receiverChange="handleReceiverChange"></mail-component>
      </div>
    </a-modal>
  </div>
</template>

<script>
import axios from '../../service'
import moment from 'moment'
import resumePanel from '../subComponent/resumePanel'
import assessComponent from './assessComponent'
import AModal from 'ant-design-vue/es/modal/Modal'
import AForm from 'ant-design-vue/es/form/Form'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import AInput from 'ant-design-vue/es/input/Input'
import uuid from 'uuid'
import mailComponent from '../subComponent/mailComponent'

export default {
  name: 'application-detail',
  components: {AInput, AFormItem, AForm, AModal, assessComponent, resumePanel, mailComponent},
  data () {
    return {
      curApplication: {},
      step: '',
      steps: [],
      stepIndex: 0,
      resume: {},
      assesses: [],
      popMailVisible: false,
      cooperatorList: [],
      formLabelCol: {
        span: 3
      },
      formWrapperCol: {
        span: 20
      },
      mailContent: '',
      coopModalVisible: false,
      coopConfirmLoading: false,
      toBeAddCoop: {},
      mail: {
        content: '',
        subject: '',
        cooperatorId: ''
      },
      mailConfirmLoading: false,
      /**
       * 是否发送给面试官
       */
      bSendToAssess: true,
      nextBtnConfirmLoading: false,
      bResetAsessResult: false, // 是否是重新发
      bReArrange: false, // 是否重新安排面试
      emailType: '',
      receivers: '',
      bDecline: false
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      axios.get('application/' + localStorage.getItem('applicationId')).then(response => {
        this.curApplication = response.data
        this.fetchCooperatorList()
        this.curApplication.createTime = moment(new Date(response.data.createTime).getTime()).format('YYYY-MM-DD HH:mm:ss')
        this.curApplication.updateTime = moment(new Date(response.data.updateTime).getTime()).format('YYYY-MM-DD HH:mm:ss')
        this.step = this.curApplication.step
        this.resume = this.curApplication.resume
        return response.data.job.id
      }).then(jobId => {
        axios.get('job/' + jobId).then(response => {
          this.steps = response.data.step
          this.stepIndex = this.steps.findIndex(tr => {
            return tr.index === parseFloat(this.step.replace('+', '').replace('-', '').replace('+', '').replace('-', ''))
          })
          // 下面这行为了列表白底的动态增加
          document.getElementsByClassName('ant-layout-content')[0].style.removeProperty('min-height')
        })
      })
      axios.get('assessment?applicationId=' + localStorage.getItem('applicationId')).then(response => {
        this.assesses = response.data.map(tr => { // TODO 这里不管有没有正在进行的任务，都需要新加重新发送链接（如果未分配，禁用）
          const newTr = {id: tr.id,
            department: tr.cooperator === null ? '' : tr.cooperator.department,
            name: tr.cooperator === null ? 'To be arranged' : tr.cooperator.name,
            time: moment(new Date(tr.assessmentTime).getTime()).format('YYYY-MM-DD HH-mm:ss'),
            content: tr.comment,
            step: tr.step,
            pass: tr.pass,
            reviewTime: tr.interviewTime === null ? '' : moment(new Date(tr.interviewTime).getTime()).format('YYYY-MM-DD HH-mm:ss'),
            // fixmefixed 这里先mock一份
            items: tr.score === null ? [] : tr.score.trim().replace(/;$/gi, '').split(';').map(o => {
              return {name: o.split(':')[0], value: parseInt(o.split(':')[1])}
            })
          }
          if (newTr.reviewTime === '') {
            newTr.time = 'interview time to be determined'
          } else {
            newTr.time = 'interview time: ' + newTr.reviewTime
          }
          return newTr
        })
      })
    },
    fetchCooperatorList () {
      return axios.get('review/cooperator').then(response => {
        this.cooperatorList = response.data.filter(tr => tr.department === this.curApplication.job.department)
      })
    },
    getStepStatus (curStep) {
      const stepNum = parseFloat(this.step.replace('+', '').replace('-', '').replace('+', '').replace('-', ''))
      if (curStep.index === stepNum) {
        if (this.step.indexOf('+') > -1 && this.step.indexOf('++') === -1) {
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
    handleReceiverChange (value) {
      this.mail.receivers = value
      this.mail = Object.assign({}, this.mail)
    },
    getIfIcon (curStep) {
      const stepNum = parseFloat(this.step.replace('+', '').replace('-', '').replace('+', '').replace('-', ''))
      if (curStep.index === stepNum && (this.step.indexOf('+') === -1 || this.step.indexOf('++') > -1) && this.step.indexOf('-') === -1) {
        return true
      } else {
        return false
      }
    },
    handleNextStep () {
      this.bDecline = false
      this.bResetAsessResult = false
      this.bSendToAssess = true
      this.bReArrange = false
      this.mail.subject = 'select interview time as an interviewer'
      this.emailType = 'interviewerDate'
      // TODOdone 最后一步offer不进入邮件列表，邮件单独提成新功能（保留进度条上的Offer字样，只更新进度）
      if (this.stepIndex === this.steps.length - 2) { // 最后一步
        this.nextBtnConfirmLoading = true
        axios.put('application/' + localStorage.getItem('applicationId') + '/step').then(response => {
          this.nextBtnConfirmLoading = false
          this.fetchData()
          this.$message.success('Job seeker moved to offer list.')
        })
      } else { // 打开发送邮件给面试官的界面
        this.popMailVisible = true
      }
    },
    /**
     * 点邮件的发送按钮
     */
    handleMailSend: function () {
      this.mailConfirmLoading = true
      if (this.bSendToAssess) {
        if (this.bReArrange) {
          // TODOdone 这里需要重新安排面试，考虑是否需要清除旧的安排
          // 旧安排不需要清除，如果旧安排不存在，需要新建一条空安排
          // 如果已经评估，直接抛错
          this.mailConfirmLoading = true
          axios.put('assessment/rearrange', {assessId: this.assesses[this.assesses.length - 1].id,
            applicationId: this.curApplication.id,
            subject: this.mail.subject,
            content: this.mail.content,
            receiver: this.cooperatorList.find(tr => { return tr.id === this.mail.receivers }).email,
            cooperatorId: this.mail.receivers,
            operationId: uuid('http://localhost:4000/assessment/?', uuid.URL),
            startDate: this.mail.timerange[0].format('YYYY-MM-DD HH:mm:ss'),
            endDate: this.mail.timerange[1].format('YYYY-MM-DD HH:mm:ss'),
            periods: JSON.stringify(this.mail.times)
          }).then(response => {
            this.mailConfirmLoading = false
            this.popMailVisible = false
            this.fetchData()
          }, error => {
            this.mailConfirmLoading = false
            console.error(error)
          })
          return
        }
        if (this.bResetAsessResult) {
          // 重置已经填好的面试结果
          this.mailConfirmLoading = true
          axios.put('assessment/reset', {assessId: this.assesses[this.assesses.length - 1].id,
            subject: this.mail.subject,
            content: this.mail.content,
            receiver: this.cooperatorList.find(tr => { return tr.id === this.mail.receivers }).email,
            cooperatorId: this.mail.receivers
          }).then(response => {
            this.mailConfirmLoading = false
            this.popMailVisible = false
            this.fetchData()
          }, error => {
            this.mailConfirmLoading = false
            console.error(error)
          })
        } else {
          axios.post('assessment', {
            operationId: uuid('http://localhost:4000/assessment/?', uuid.URL),
            applications: [this.curApplication.id],
            ...this.mail,
            startDate: this.mail.timerange[0].format('YYYY-MM-DD HH:mm:ss'),
            endDate: this.mail.timerange[1].format('YYYY-MM-DD HH:mm:ss'),
            periods: JSON.stringify(this.mail.times),
            cooperatorIds: [this.mail.receivers]
          }).then(response => {
            this.mailConfirmLoading = false
            this.popMailVisible = false
            this.fetchData()
            this.popMailVisible = false
          }, error => {
            this.mailConfirmLoading = false
            this.popMailVisible = false
            this.$message.error(error)
          })
        }
      } else {
        axios.put('application/decline', {applicationId: this.curApplication.id, subject: this.mail.subject, content: this.mail.content, receiver: this.resume.email}).then(response => {
          this.mailConfirmLoading = false
          this.popMailVisible = false
          this.fetchData()
        }, error => {
          this.popMailVisible = false
          this.mailConfirmLoading = false
          console.error(error)
        })
      }
    },
    handleMailCancel () {
      this.popMailVisible = false
    },
    /**
     * 添加协作者界面点击OK
     */
    coopModalOk () {
      this.coopConfirmLoading = true
      axios.put('cooperator', {}).then(response => {
        this.coopConfirmLoading = false
        // TODO 重新获取协作者列表
      }, error => {
        this.coopConfirmLoading = false
        console.error(error)
      })
    },
    /**
     * 发送邮件页面点取消
     */
    coopModalCancel () {
      this.coopModalVisible = false
    },
    /**
     * 发送邮件页面点添加协作者
     */
    handleAddCooperatorClick () {
      this.coopModalVisible = true
      this.toBeAddCoop = {}
    },
    /**
     * 点拒绝按钮
     */
    handleDecline () {
      this.bDecline = true
      this.emailType = 'decline'
      this.bResetAsessResult = false
      this.bSendToAssess = false
      this.bReArrange = false
      this.mail.subject = 'Fail asessment notification.'
      this.mail.receivers = this.resume.email
      this.popMailVisible = true
    },
    /**
     * 面试官填错了面试结果时操作
     */
    resetAssessment () { // TODO 这里需要判断，如果是没有安排的，不给点，此时的cooperator是空
      const lastAssess = this.assesses[this.assesses.length - 1]
      if (!(this.step.indexOf('-') > -1 || (this.step.indexOf('+') > -1 && this.step.indexOf('++') === -1))) {
        this.$message.warn('no assessment result can be reset', 1)
        return
      }
      this.bDecline = false
      this.emailType = 'resend'
      const curCooperator = this.cooperatorList.find(tr => {
        return tr.department === lastAssess.department && tr.name === lastAssess.name
      })
      this.mail.receivers = curCooperator.id
      this.mail.subject = 'reset assessment result'
      this.bResetAsessResult = true
      this.bReArrange = false
      this.bSendToAssess = true
      this.popMailVisible = true
    },
    /**
     * 面试官没选时间，并且选时间的链接丢失时操作
     */
    reArrange () {
      const lastAssess = this.assesses[this.assesses.length - 1]
      if ((this.step.indexOf('++') === -1 && this.step.indexOf('+') > -1) || this.step.indexOf('-') > -1) {
        this.$message.warn('already assessed, no need to rearrange', 1)
        return
      }
      this.bDecline = false
      this.emailType = 'rearrange'
      const curCooperator = this.cooperatorList.find(tr => {
        return tr.department === lastAssess.department && tr.name === lastAssess.name
      })
      if (curCooperator) {
        this.mail.receivers = curCooperator.id
      }
      this.mail.subject = 'repick assessment time'
      this.bResetAsessResult = true
      this.bReArrange = true
      this.bSendToAssess = true
      this.popMailVisible = true
    }
  }
}
</script>

<style scoped lang="less">
.application-container{
  margin-top: -24px;

  .mail-modal{
    .ant-form-item-label{
      text-align:left !important;
    }
  }
  .bottom-container{
    text-align: center;
    .fail-btn{
      width: 15vh;
    }
    .next-btn{
      width: 15vh;
    }

  }
}
</style>
