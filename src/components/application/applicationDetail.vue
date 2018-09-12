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
    <div>
      If assessors misoperated assessment result, please
      <a @click="resetAssessment">Reset current assessment result and resend assess link.</a>
      <br/>
      Or, if arrangement is unsuitable, you can
      <a @click="reArrange">Rearrange assessment time.</a>
    </div>
    <router-link v-if="stepIndex===steps.length-1" :to="{name: 'Offer List'}">Candidate has passed all assessment process, Click to go to offer management.</router-link>
    <div class="bottom-container" slot="footer">
      <a-button :disabled="!(assesses.length > 0 && assesses[assesses.length - 1].pass==='fail' || stepIndex ==0) || step.indexOf('--')>-1" class="fail-btn" type="danger" v-on:click="handleDecline">Decline</a-button>
      <a-button :disabled="!(assesses.length > 0 && assesses[assesses.length - 1].pass==='pass' || stepIndex ==0 && step.indexOf('-')===-1) || stepIndex===steps.length-1" :confirmLoading="nextBtnConfirmLoading" class="next-btn" type="primary" v-on:click="handleNextStep">Next</a-button>
    </div>
    <a-modal class="mail-modal" :confirmLoading="mailConfirmLoading" width="680px" okText="Send" :title="'operation for ' + resume.name" :visible="popMailVisible" v-on:cancel="handleMailCancel" @ok="handleMailSend" :maskClosable="false" :closable="true">
      <div class="mail-form-container">
        <a-form>
          <a-form-item label="Cooperator" :labelCol="formLabelCol" :wrapperCol="formWrapperCol">
            <a-select v-if="bSendToAssess" v-model="mail.cooperatorId" mode="default" :tokenSeparators="[',']" @change="handleCooperChange">
              <a-select-option v-for="re in cooperatorList" :key="re.id">{{re.department + '/' + re.name}}</a-select-option>
            </a-select>
            <a-input v-else v-model="resume.email"></a-input>
            <a v-if="!bResetAsessResult" style="position:absolute" @click="handleAddCooperatorClick"><a-icon type="plus-circle-o"></a-icon></a>
            <a-modal :confirmLoading="coopConfirmLoading" :visible="coopModalVisible" @ok="coopModalOk" @cancel="coopModalCancel" :maskCancel="true">
              <a-form>
                <a-form-item label="Name">
                  <a-input v-model="toBeAddCoop.name" placeholder="Name of cooperator"></a-input>
                </a-form-item>
                <a-form-item label="Email">
                  <a-input v-model="toBeAddCoop.email" placeholder="Email of cooperator"></a-input>
                </a-form-item>
                <a-form-item label="Department">
                  <a-input v-model="toBeAddCoop.department" placeholder="Branch of cooperator"></a-input>
                </a-form-item>
              </a-form>
            </a-modal>
          </a-form-item>
          <a-form-item label="MailSubject" :labelCol="formLabelCol" :wrapperCol="formWrapperCol">
            <a-input v-model="mail.subject"></a-input>
          </a-form-item>
          <a-form-item v-if="bReArrange || (bSendToAssess&&!bResetAsessResult)" label="AssessDate" :labelCol="formLabelCol" :wrapperCol="formWrapperCol">
            <a-range-picker v-model="mail.timerange"></a-range-picker>
          </a-form-item>
          <a-form-item :labelCol="formLabelCol">
            <a-textarea v-model="mail.content" :autosize="{maxRows: 12, minRows: 8}" :value="mailContent"></a-textarea>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script>
import axios from '../../service'
import moment from 'moment'
import resumePanel from './resumePanel'
import assessComponent from './assessComponent'
import AModal from 'ant-design-vue/es/modal/Modal'
import AForm from 'ant-design-vue/es/form/Form'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import AInput from 'ant-design-vue/es/input/Input'
import uuid from 'uuid'

export default {
  name: 'application-detail',
  components: {AInput, AFormItem, AForm, AModal, assessComponent, resumePanel},
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
      baseMailContent: 'Dear Evaluator:\r\n \tPlease help to give assessment to this job seeker, detailed information about this person ' +
        'is listed in the link below. The assessment can only be make once, so please MADE YOUR DECISION CAUTIOUSLY! \r\n' +
        '\t\t\t\t',
      baseMailSubject: 'Assessment Invitation to ',
      /**
       * 是否发送给面试官
       */
      bSendToAssess: true,
      nextBtnConfirmLoading: false,
      bResetAsessResult: false, // 是否是重新发
      bReArrange: false // 是否重新安排面试
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
            return tr.index === parseFloat(this.step.replace('+', '').replace('-', '').replace('+', '').replace('-', ''))
          })
          // 下面这行为了列表白底的动态增加
          document.getElementsByClassName('ant-layout-content')[0].style.removeProperty('min-height')
        })
      })
      axios.get('assessment?applicationId=' + localStorage.getItem('applicationId')).then(response => {
        this.assesses = response.data.map(tr => { // TODO 这里不管有没有正在进行的任务，都需要新加重新发送链接（如果未分配，禁用）
          console.log(response.data)
          console.log(moment(new Date(response.data[0].interviewTime).getTime()).format('YYYY-MM-DD hh:mm:ss'))
          const newTr = {id: tr.id,
            department: tr.cooperator === null ? '' : tr.cooperator.department,
            name: tr.cooperator === null ? 'To be arranged' : tr.cooperator.name,
            time: moment(new Date(tr.assessmentTime).getTime()).format('YYYY-MM-DD HH-mm:ss'),
            content: tr.comment,
            step: tr.step,
            pass: tr.pass,
            reviewTime: tr.interviewTime === null ? '' : moment(new Date(tr.interviewTime).getTime()).format('YYYY-MM-DD HH-mm:ss')
          }
          if (newTr.reviewTime === '') {
            newTr.time = 'interview time to be determined'
          } else {
            newTr.time = 'interview time: ' + newTr.reviewTime
          }
          return newTr
        })
      })
      this.fetchCooperatorList()
    },
    fetchCooperatorList () {
      axios.get('review/cooperator').then(response => {
        this.cooperatorList = response.data
      })
    },
    getStepStatus (curStep) {
      const stepNum = parseFloat(this.step.replace('+', '').replace('-', '').replace('+', '').replace('-', ''))
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
      const stepNum = parseFloat(this.step.replace('+', '').replace('-', '').replace('+', '').replace('-', ''))
      if (curStep.index === stepNum && this.step.indexOf('+') === -1 && this.step.indexOf('-') === -1) {
        return true
      } else {
        return false
      }
    },
    handleNextStep () {
      this.bResetAsessResult = false
      this.bSendToAssess = true
      this.bReArrange = false
      // TODOdone 最后一步offer不进入邮件列表，邮件单独提成新功能（保留进度条上的Offer字样，只更新进度）
      if (this.stepIndex === this.steps.length - 2) { // 最后一步
        this.nextBtnConfirmLoading = true
        axios.put('application/' + localStorage.getItem('applicationId') + '/step').then(response => {
          this.nextBtnConfirmLoading = false
          this.fetchData()
          this.$message.success('Job seeker moved to offer list.')
        })
      } else { // 打开发送邮件给面试官的界面
        this.mail = {
          content: 'Dear [assessor_name]\r\n\tPlease select the time during which you will be available for the interview. ' +
            'Attention please, once selected, the time table can not be changed! The time selection link is below: \r\n\t\t' +
            (location.origin + '/' + location.pathname + '/#/schedule/interview/[operation_id]/[cooperation_id]').replace(/([^(http:)])\/{2,}/gi, '$1/') +
            '\r\n\tBest Regards\r\n[company_name]',
          subject: 'select interview time as an interviewer',
          cooperators: []
        }
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
            receiver: this.cooperatorList.find(tr => { return tr.id === this.mail.cooperatorId }).email,
            cooperatorId: this.mail.cooperatorId,
            operationId: uuid('http://localhost:4000/assessment/?', uuid.URL),
            startDate: this.mail.timerange[0].format('YYYY-MM-DD HH:mm:ss'),
            endDate: this.mail.timerange[1].format('YYYY-MM-DD HH:mm:ss')
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
            receiver: this.cooperatorList.find(tr => { return tr.id === this.mail.cooperatorId }).email,
            cooperatorId: this.mail.cooperatorId
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
            cooperatorIds: [this.mail.cooperatorId]
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
     * 选择的面试官改变时触发
     * @param value
     */
    handleCooperChange (value, all) {
      this.mail.content = this.mail.content.replace('[assessor_name]', this.cooperatorList.find(tr => {
        return (tr.id === value)
      }).name)
      this.mail.content = this.mail.content.substring(0, 5) + this.cooperatorList.find(tr => {
        return (tr.id === value)
      }).name + this.mail.content.substring(this.mail.content.indexOf('\n'), this.mail.content.length)

      this.mail = Object.assign({}, this.mail)
    },
    /**
     * 点拒绝按钮
     */
    handleDecline () {
      this.bResetAsessResult = false
      this.bSendToAssess = false
      this.bReArrange = false
      this.mail.subject = 'Fail asessment notification.'
      this.mail.content = 'Dear ' + this.resume.name + ':\n' +
        'Thank you for your application for the position. As you can imagine, we received a large number of applications. I am sorry to inform you that you have not passed this position.\n' +
        '\n' +
        'We thanks you for the time you invested in applying for the shipping coordinator position. We encourage you to apply for future openings for which you qualify.\n' +
        '\n' +
        'Best wishes for a successful job search. Thank you, again, for your interest in our company.'
      this.popMailVisible = true
    },
    /**
     * 面试官填错了面试结果时操作
     */
    resetAssessment () { // TODO 这里需要判断，如果是没有安排的，不给点，此时的cooperator是空
      const lastAssess = this.assesses[this.assesses.length - 1]
      if (lastAssess === undefined || lastAssess.name === 'To be arranged') {
        this.$message.warn('assessment not arranged yet', 0.5)
        return
      }
      const curCooperator = this.cooperatorList.find(tr => {
        return tr.department === lastAssess.department && tr.name === lastAssess.name
      })
      this.mail.cooperatorId = curCooperator.id
      this.mail.content = 'Dear ' + curCooperator.name + '\n\tThis is your re-assessing url:\r\n\t\t' +
        (location.origin + '/' + location.pathname + '/#/assess/' + lastAssess.id).replace(/([^(http:)])\/{2,}/gi, '$1/') +
        '\r\n\tBest Regards,\r\n[company_name]'
      this.mail.subject = 're-assess response'
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
      if (lastAssess === undefined || lastAssess.name === 'To be arranged') {
        this.$message.warn('assessment not arranged yet', 0.5)
        return
      }
      const curCooperator = this.cooperatorList.find(tr => {
        return tr.department === lastAssess.department && tr.name === lastAssess.name
      })
      this.mail.cooperatorId = curCooperator.id
      this.mail.content = 'Dear ' + curCooperator.name + '\n\tThis is your re-picking time url:\r\n\t\t' +
        (location.origin + '/' + location.pathname + '/#/schedule/interview/[operation_id]/[cooperation_id]').replace(/([^(http:)])\/{2,}/gi, '$1/') +
        '\r\n\tBest Regards,\r\n[company_name]'
      this.mail.subject = 're-picking time response'
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
