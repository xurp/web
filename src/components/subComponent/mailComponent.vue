<template>
  <a-form>
    <a-form-item label="Receiver" :labelCol="formLabelCol" :wrapperCol="formWrapperCol">
      <a-select v-if="isReceiverList" v-model="mail.receivers" :mode="selectMode" :tokenSeparators="[',']" @change="handleReceiverChange">
        <a-select-option v-for="re in receiverList" :key="re.id">{{re.name}}</a-select-option>
      </a-select>
      <a-input v-else v-model="mail.receivers"></a-input>
      <a v-if="showAddReceiver" style="position:absolute" @click="handleAddCooperatorClick"><a-icon type="plus-circle-o"></a-icon></a>
      <div v-if="applicationCount && mail.receivers instanceof Array && showDate">
        <span>{{applicationCount}} candidates</span>
        <a-divider type="vertical"/>
        <span>{{mail.receivers.length}} interviewers</span>
        <a-divider type="vertical"/>
        <span>{{Math.floor(applicationCount / mail.receivers.length)}}</span>
        <span v-if="Math.floor(applicationCount / mail.receivers.length) < Math.ceil(applicationCount / mail.receivers.length)">~ {{Math.ceil(applicationCount / mail.receivers.length)}}</span>
        <span>sessions / interviewer</span>
      </div>
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
    <a-form-item v-if="showDate" label="AssessDate" :labelCol="formLabelCol" :wrapperCol="formWrapperCol">
      <a-range-picker v-model="mail.timerange"></a-range-picker>
    </a-form-item>
    <a-form-item v-if="showDate" label="TimeSlots" :labelCol="formLabelCol" :wrapperCol="formWrapperCol">
      <time-slots v-model="mail.times"/>
      <div>{{(mail.times || []).length}} Sessions Per day</div>
    </a-form-item>
    <slot name="place"></slot>
    <a-form-item label="Template" :labelCol="formLabelCol" :wrapperCol="formWrapperCol">
      <a-select @change="handleTemplateChange" v-model="curTemplateName">
        <a-select-option v-for="template in templates" :key="Math.random()+template.name" :value="template.name">{{template.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item :labelCol="formLabelCol">
      <a-textarea v-model="mail.content" :autosize="{maxRows: 12, minRows: 8}" :value="mail.content"></a-textarea>
    </a-form-item>
  </a-form>
</template>

<script>
import axios from '../../service'
import TimeSlots from '../application/time-slots'
export default {
  name: 'mailComponent',
  components: {TimeSlots},
  data: () => ({
    coopConfirmLoading: false,
    toBeAddCoop: {},
    coopModalVisible: false,
    formLabelCol: {
      span: 3
    },
    formWrapperCol: {
      span: 20
    },
    templates: [],
    curTemplateName: ''
  }),
  props: {
    mail: {
      type: Object
    },
    showDate: {
      type: Boolean
    },
    isReceiverList: {
      type: Boolean
    },
    receiverList: {
      type: Array
    },
    showAddReceiver: {
      type: Boolean
    },
    /**
     * interviewerDate, decline, resend, rearrange,方便设置邮件模板的获取地址
     */
    emailType: {
      type: String
    },
    selectMode: {
      type: String
    },
    /**
     * applicationCount
     * to estimate number of sessions for each interviewer
     */
    applicationCount: {
      type: Number,
      default: () => 0
    }
  },
  created () {
    this.fetchMailTemplate()
  },
  watch: {
    emailType (newVal, oldVal) {
      this.fetchMailTemplate()
    }
  },
  methods: {
    fetchMailTemplate () {
      axios.get('email/' + this.emailType).then(response => {
        this.templates = response.data
        this.curTemplateName = this.templates[0].name
        this.mail.content = this.templates[0].content
      })
    },
    handleTemplateChange (value) {
      this.mail.content = this.templates.find(tr => {
        return tr.name === value
      }).content
      this.curTemplateName = value
    },
    /**
     * 发送邮件页面点添加协作者
     */
    handleAddCooperatorClick () {
      this.coopModalVisible = true
      this.toBeAddCoop = {}
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
    handleReceiverChange (value) {
      this.$emit('receiverChange', value)
    }
  }
}
</script>

<style scoped>

</style>
