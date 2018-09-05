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
    <div class="bottom-container" slot="footer">
      <a-button :disabled="!(assesses.length > 0 && assesses[assesses.length - 1].pass==='fail' || stepIndex ==0)" class="fail-btn" type="danger" v-on:click="handleDecline">Decline</a-button>
      <a-button :disabled="!(assesses.length > 0 && assesses[assesses.length - 1].pass==='pass' || stepIndex ==0)" class="next-btn" type="primary" v-on:click="handleNextStep">Next</a-button>
    </div>
    <a-modal class="mail-modal" :confirmLoading="mailConfirmLoading" width="680px" okText="Send" :title="'operation for ' + resume.name" :visible="popMailVisible" v-on:cancel="handleMailCancel" @ok="handleMailSend" :maskClosable="false" :closable="true">
      <div class="mail-form-container">
        <a-form>
          <a-form-item label="Cooperator" :labelCol="formLabelCol" :wrapperCol="formWrapperCol">
            <a-select v-model="mail.cooperatorId" mode="default" :tokenSeparators="[',']">
              <a-select-option v-for="re in receivers" :key="re.id">{{re.department + '/' + re.name}}</a-select-option>
            </a-select>
            <a style="position:absolute" @click="handleAddCooperatorClick"><a-icon type="plus-circle-o"></a-icon></a>
            <a-modal :confirmLoading="coopConfirmLoading" :visible="coopModalVisible" @ok="coopModalOk" @cancel="coopModalCancel" :maskCancel="true">
              <a-form>
                <a-form-item label="Name">
                  <a-input v-model="toBeAddCoop.name" value="张之洞" placeholder="Name of cooperator"></a-input>
                </a-form-item>
                <a-form-item label="Email">
                  <a-input v-model="toBeAddCoop.email" value="Zhai_g@gmail.com" placeholder="Email of cooperator"></a-input>
                </a-form-item>
                <a-form-item label="Department">
                  <a-input v-model="toBeAddCoop.department" value="开发" placeholder="Branch of cooperator"></a-input>
                </a-form-item>
              </a-form>
            </a-modal>
          </a-form-item>
          <a-form-item label="MailSubject" :labelCol="formLabelCol" :wrapperCol="formWrapperCol">
            <a-input v-model="mail.subject"></a-input>
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
      receivers: [],
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
      assessId: '',
      baseMailContent: 'Dear Evaluator:\r\n \tPlease help to give assessment to this job seeker, detailed information about this person ' +
        'is listed in the link below. The assessment can only be make once, so please MADE YOUR DECISION CAUTIOUSLY! \r\n' +
        '\t\t\t\t',
      baseMailSubject: 'Assessment Invitation to '
    }
  },
  created () {
    this.fetchData()
    this.receivers.push({
      id: 1,
      name: 'ZhangZhe',
      department: 'develop',
      email: '896028602@qq.com'
    })
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
          // 下面这行为了列表白底的动态增加
          document.getElementsByClassName('ant-layout-content')[0].style.removeProperty('min-height')
        })
      })
      axios.get('assessment?applicationId=' + localStorage.getItem('applicationId')).then(response => {
        this.assesses = response.data.map(tr => {
          return {id: tr.id,
            department: tr.cooperator.department,
            name: tr.cooperator.name,
            time: moment(new Date(tr.assessmentTime).getTime()).format('YYYY-MM-DD HH-mm:ss'),
            content: tr.comment,
            step: tr.step,
            pass: tr.pass
          }
        })
        console.log(this.assesses)
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
    },
    handleNextStep () {
      this.assessId = uuid('http://localhost:4000/assessment/?', uuid.URL)
      let url = location.origin + '/' + location.pathname + '/#/assessment/'
      url = url.replace(/([^(http:)])\/{2,}/gi, '$1/')
      this.mail.content = this.baseMailContent + url + this.assessId
      this.mail.subject = this.baseMailSubject + this.resume.name
      this.mail.cooperatorId = ''
      this.popMailVisible = true
    },
    handleMailSend: function () {
      this.mailConfirmLoading = true
      axios.post('assessment', {applicationId: this.curApplication.id, ...this.mail, assessId: this.assessId}).then(response => {
        this.mailConfirmLoading = false
        this.fetchData()
        this.popMailVisible = false
      }, error => {
        this.mailConfirmLoading = false
        this.$message.error(error)
      })
    },
    handleMailCancel () {
      this.popMailVisible = false
    },
    coopModalOk () {
      this.coopConfirmLoading = true
      axios.put('cooperator', {}).then(response => {
        this.coopConfirmLoading = false
        // TODO 重新获取协作者列表
      }, error => {
        this.coopConfirmLoading = false
        console.log(error)
      })
    },
    coopModalCancel () {
      this.coopModalVisible = false
    },
    handleAddCooperatorClick () {
      this.coopModalVisible = true
      this.toBeAddCoop = {}
    },
    handleDecline () {
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
