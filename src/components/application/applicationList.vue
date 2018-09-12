<template>
  <div class="application-container">
    <a-form class="filter-container">
      <a-form-item label="Position" :labelCol="{span:5}" :wrapperCol="{span:17}">
        <a-select @change="handleJobChange" :value="this.curJobId">
          <a-select-option v-for="job in jobList" :value="job.id" :key="job.id">{{job.name}}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
    <a-divider/>
    <posDetail v-bind:curPosition="curPosition"></posDetail>
    <a-divider/>
    <a-steps>
      <a-step v-for="(curstep,index) in steps" :key="curstep.index" :title="curstep.name" :status="statuses[index]" v-on:click="handleStepClick(index)">
        <a-icon v-bind:type="getIconType(index)" slot="icon"/>
      </a-step>
    </a-steps>
    <a-divider/>

    <a-table :dataSource="applicationList">
      <a-table-column>
        <!--<a-checkbox slot="title" :indeterminate="checkIndeterminate" @change="totalCheckChange" :checked="totalChecked"></a-checkbox>-->
        <a-dropdown slot="title" :placement="'bottomCenter'">
          <a class="ant-dropdown-link" href="#">
            Selection <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a @click="selectAllPassed">all passed</a>
            </a-menu-item>
            <a-menu-item>
              <a @click="selectAllFailed">all failed</a>
            </a-menu-item>
            <a-menu-item>
              <a @click="selectAllAssessing">all assessing</a>
            </a-menu-item>
            <a-menu-item>
              <a @click="clearSelection">clear selection</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <a-checkbox slot-scope="text,record" :disabled="record.disableStatus" :checked="record.checkStatus" @change="singleCheckChange(record)"></a-checkbox>
      </a-table-column>
      <a-table-column title="Name" key="name" dataIndex="name"></a-table-column>
      <a-table-column title="School" key="school" dataIndex="school"></a-table-column>
      <a-table-column title="Major" key="major" dataIndex="major"></a-table-column>
      <a-table-column title="Age" key="age" dataIndex="age"></a-table-column>
      <a-table-column title="Gender" key="gender" dataIndex="gender"></a-table-column>
      <a-table-column title="Status" key="status" dataIndex="status">
        <span slot-scope="text,record" :style="{color:getStatusColor(record.status)}">{{text}}</span>
      </a-table-column>
      <a-table-column title="Action" key="action">
        <a slot-scope="text,record" v-on:click="detailApplication(record)">Detail/Operation</a>
      </a-table-column>
    </a-table>
    <div class="operation-div">
      <a-button class="decline-btn" type="danger" :disabled="!declineEnable" @click="handleDecline">Decline</a-button>
      <a-button class="accept-btn" type="primary" :disabled="!nextStepEnable" @click="openMailModal">Next Step</a-button>
    </div>

    <a-modal class="mail-modal" :confirmLoading="mailConfirmLoading" width="680px" okText="Send" title="batch assessment arrangement" :visible="popMailVisible" v-on:cancel="handleMailCancel" @ok="handleMailSend" :maskClosable="false" :closable="true">
      <div class="mail-form-container">
        <a-form>
          <a-form-item label="Cooperator" :labelCol="formLabelCol" :wrapperCol="formWrapperCol">
            <a-select v-model="mail.cooperators" mode="tags" :tokenSeparators="[',']" @change="handleReceiverChange">
              <a-select-option v-if="bBatchNextStep" v-for="re in cooperatorList" :key="re.id">{{re.department + '/' + re.name}}</a-select-option>
              <a-select-option v-if="!bBatchNextStep" v-for="re in selectedRows" :key="re.id">{{re.name}}</a-select-option>
            </a-select>
            <a style="position:absolute" @click="handleAddCooperatorClick"><a-icon type="plus-circle-o"></a-icon></a>
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
          <a-form-item v-if="bBatchNextStep" label="AssessDate" :labelCol="formLabelCol" :wrapperCol="formWrapperCol">
            <a-range-picker v-model="mail.timerange"></a-range-picker>
          </a-form-item>
          <a-form-item :labelCol="formLabelCol">
            <a-textarea v-model="mail.content" :autosize="{maxRows: 12, minRows: 8}" :value="mail.content"></a-textarea>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script>
import posDetail from './posDetailComponent'
import axios from '../../service'
import moment from 'moment'
import uuid from 'uuid'

export default {
  name: 'application-list',
  components: {posDetail},
  data () {
    return {
      curPosition: {},
      step: 'ALL',
      applicationList: [],
      steps: [],
      statuses: [],
      jobList: [],
      curJobId: '',
      cooperatorList: [],
      popMailVisible: false,
      mail: {},
      mailConfirmLoading: false,
      coopConfirmLoading: false,
      coopModalVisible: false,
      formLabelCol: {
        span: 3
      },
      formWrapperCol: {
        span: 20
      },
      toBeAddCoop: {},
      bBatchNextStep: true,
      selectedRows: []
    }
  },
  created () {
    this.fetchJobList()
  },
  computed: {
    declineEnable () {
      const selectedOne = this.applicationList.find(tr => {
        return tr.checkStatus
      })
      if (selectedOne !== undefined) {
        return selectedOne.step.indexOf('-') > -1 || parseFloat(selectedOne.step.replace(/\+/, '').replace('/-/', '')) === 0
      } else {
        return false
      }
    },
    nextStepEnable () {
      const selectedOne = this.applicationList.find(tr => {
        return tr.checkStatus
      })
      if (selectedOne !== undefined) {
        return selectedOne.step.indexOf('+') > -1 || parseFloat(selectedOne.step.replace(/\+/, '').replace('/-/', '')) === 0
      } else {
        return false
      }
    },
    checkIndeterminate () {
      const totalNum = this.applicationList.length
      const checkNum = this.applicationList.filter(tr => {
        return tr.checkStatus
      }).length
      return !(checkNum === 0 || checkNum === totalNum)
    },
    totalChecked () {
      const totalNum = this.applicationList.length
      const checkNum = this.applicationList.filter(tr => {
        return tr.checkStatus
      }).length
      return checkNum === totalNum
    }
  },
  watch: {
    checkIndeterminate (newVal, oldVal) {
      if (newVal) {
        // 选择变为非空，应该将状态不同的设置为disabled
        const curSlectStep = this.applicationList.find(tr => {
          return tr.checkStatus
        }).step
        this.applicationList = this.applicationList.map(tr => {
          const newTr = Object.assign({}, tr)
          if (tr.step === curSlectStep) {
            newTr.disableStatus = false
          } else {
            newTr.disableStatus = true
          }
          return newTr
        })
      } else {
        // 除了不可操作的行，其它全部解禁
        this.applicationList = this.applicationList.map(tr => {
          const newTr = Object.assign({}, tr)
          if (tr.step.indexOf('--') > -1) {
            newTr.disableStatus = true
          } else {
            newTr.disableStatus = false
          }
          return newTr
        })
      }
    }
  },
  methods: {
    /**
     * 获取当前被选择的行数据
     */
    getSelectedRows () {
      const selection = this.applicationList.filter(tr => {
        return tr.checkStatus
      })
      return selection
    },
    /**
     * 根据状态显示颜色
     */
    getStatusColor (status) {
      switch (status) {
        case 'passed':
          return 'green'
        case 'failed':
          return 'red'
        case 'assessing':
          return 'blue'
        case 'rejected':
          return 'darkred'
      }
    },
    /**
     * 选择所有通过的行
     */
    selectAllPassed () {
      this.selectedRows.splice(0, this.selectedRows.length)
      this.applicationList = this.applicationList.map(tr => {
        return {
          ...tr,
          checkStatus: tr.step.indexOf('+') > -1
        }
      })
      this.selectedRows = this.getSelectedRows()
    },
    /**
     * 选择所有未通过但未发拒信的行
     */
    selectAllFailed () {
      this.selectedRows.splice(0, this.selectedRows.length)
      this.applicationList = this.applicationList.map(tr => {
        return {
          ...tr,
          checkStatus: tr.step.indexOf('-') > 0 && tr.step.indexOf('--') === -1
        }
      })
      this.selectedRows = this.getSelectedRows()
    },
    clearSelection () {
      this.applicationList = this.applicationList.map(tr => {
        return {
          ...tr,
          checkStatus: false
        }
      })
      this.selectedRows.splice(0, this.selectedRows.length)
    },
    selectAllAssessing () {
      this.selectedRows.splice(0, this.selectedRows.length)
      this.applicationList = this.applicationList.map(tr => {
        return {
          ...tr,
          checkStatus: tr.step.indexOf('-') === -1 && tr.step.indexOf('+') === -1
        }
      })
      this.selectedRows = this.getSelectedRows()
    },
    /**
     * 单行选择改变时触发
     */
    singleCheckChange (val) {
      val.checkStatus = !val.checkStatus
      this.selectedRows = this.getSelectedRows()
    },
    /**
     * 职位改变时触发
     */
    handleJobChange (value) {
      this.curJobId = value
      this.fetchJobDetail().then(response => {
        this.step = response.index
        this.handleStepClick(0)
      })
    },
    fetchJobList () {
      // TODOdone 加列表的加载
      axios.request('job').then(response => {
        this.jobList = response.data.map(tr => {
          const as = {
            updateTime: '',
            createTime: ''
          }
          Object.assign(as, tr)
          return as
        })
        const aid = localStorage.getItem('Position2ApplicationId')
        localStorage.setItem('Position2ApplicationId', '')
        localStorage.removeItem('Position2ApplicationId')
        let index = 0
        if (aid !== undefined) {
          index = this.jobList.findIndex(tr => {
            return tr.id === aid
          })
        }
        // 加载完选择第一个
        if (this.jobList.length > 0) {
          this.handleJobChange(this.jobList[index].id)
        }
      }, error => {
        console.error(error)
      })
    },
    /**
     * 当step被点击或者初始加载时调用，此时列出所有该步的成员，同时重置选择
     * @param index
     */
    handleStepClick (index) {
      this.selectedRowKeys = []
      this.statuses = this.statuses.map((tr, ind) => {
        if (index === ind) {
          return 'process'
        } else {
          return 'wait'
        }
      })
      this.step = this.steps[index].index
      this.fetchApplicationList()
    },
    fetchJobDetail () {
      return axios.get('job/' + this.curJobId).then(response => {
        this.curPosition = response.data
        this.curPosition.createTime = moment(new Date(response.data.createTime).getTime()).format('YYYY-MM-DD HH:mm:ss')
        this.curPosition.updateTime = moment(new Date(response.data.updateTime).getTime()).format('YYYY-MM-DD HH:mm:ss')
        this.steps = this.curPosition.step
        this.statuses = this.steps.map(tr => {
          return 'wait'
        })
        return this.steps[0]
      })
    },
    fetchApplicationList () {
      axios.get('application?jobId=' + this.curJobId + '&step=' + this.step).then(response => {
        this.applicationList = response.data.map(tr => {
          return {
            ...tr,
            ...tr.user,
            ...tr.resume,
            id: tr.id,
            status: this.getStatusByStep(tr.step),
            checkStatus: false,
            disableStatus: tr.step.indexOf('--') > -1
          }
        })
        // 下面这行为了列表白底的动态增加
        document.getElementsByClassName('ant-layout-content')[0].style.removeProperty('min-height')
      }, error => {
        console.error(error)
      })
    },
    /**
     *  根据当前的step，确定状态为assessing、failed、rejected还是passed
     * @param step
     */
    getStatusByStep (step) {
      if (step === '0' || (step.indexOf('-') === -1 && step.indexOf('+') === -1)) {
        return 'assessing'
      } else
      if (step.indexOf('--') > -1) {
        return 'rejected'
      } else
      if (step.indexOf('-') > -1) {
        return 'failed'
      } else { return 'passed' }
    },
    /**
     * 打开单个申请的详情页面
     * @param record
     */
    detailApplication (record) {
      localStorage.setItem('applicationId', record.id)
      this.$router.push({name: 'Application Detail'})
    },
    /**
     * 获取step条的图标
     */
    getIconType (index) {
      if (index === 0) {
        return 'solution'
      }
      if (index === this.steps.length - 1) {
        return 'usergroup-add'
      } else {
        return 'clock-circle-o'
      }
    },
    openMailModal () {
      this.fetchCooperatorList()
      this.popMailVisible = true
      this.bBatchNextStep = true
      this.mail = {
        content: 'Dear [assessor_name]\r\n\tPlease select the time during which you will be available for the interview. ' +
          'Attention please, once selected, the time table can not be changed! The time selection link is below: \r\n\t\t' +
          (location.origin + '/' + location.pathname + '/#/schedule/interview/[operation_id]/[cooperation_id]').replace(/([^(http:)])\/{2,}/gi, '$1/') +
          '\r\n\tBest Regards\r\n[company_name]',
        subject: 'select interview time as an interviewer',
        cooperators: []
      }
    },
    fetchCooperatorList () {
      axios.get('review/cooperator').then(response => {
        this.cooperatorList = response.data
      })
    },
    /**
     * 点邮件的发送按钮
     */
    handleMailSend: function () {
      this.mailConfirmLoading = true
      if (this.bBatchNextStep) {
        axios.post('assessment', {
          operationId: uuid('http://localhost:4000/assessment/?', uuid.URL),
          applications: this.applicationList.filter(tr => {
            return tr.checkStatus
          }).map(tr => {
            return tr.id
          }),
          startDate: this.mail.timerange[0].format('YYYY-MM-DD HH:mm:ss'),
          endDate: this.mail.timerange[1].format('YYYY-MM-DD HH:mm:ss'),
          ...this.mail,
          cooperatorIds: this.mail.cooperators
        }).then(response => {
          this.mailConfirmLoading = false
          this.popMailVisible = false
          this.fetchApplicationList()
          this.popMailVisible = false
        }, error => {
          this.mailConfirmLoading = false
          this.popMailVisible = false
          this.$message.error(error)
        })
      } else {
        let totalSendCount = this.selectedRows.length
        this.selectedRows.forEach(tr => {
          if (tr.checkStatus) {
            axios.put('application/decline', {
              applicationId: tr.id,
              subject: this.mail.subject,
              content: this.mail.content.replace('[candidate_name]', tr.name),
              receiver: tr.resume.email
            }).then(response => {
              totalSendCount--
              if (totalSendCount === 0) {
                this.mailConfirmLoading = false
                this.popMailVisible = false
                this.fetchApplicationList()
              }
            })
          }
        })
      }
    },
    handleMailCancel () {
      this.popMailVisible = false
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
    handleDecline () {
      this.bBatchNextStep = false
      this.mail.cooperators = this.selectedRows.map(tr => {
        return tr.id
      })
      this.mail.subject = 'Fail asessment notification.'
      this.mail.content = 'Dear [candidate_name]:\n' +
        '\tThank you for your application for the position. As you can imagine, we received a large number of applications. I am sorry to inform you that you have not passed this position.\n' +
        '\n' +
        '\tWe thanks you for the time you invested in applying for the shipping coordinator position. We encourage you to apply for future openings for which you qualify.\n' +
        '\n' +
        'Best wishes for a successful job search. Thank you, again, for your interest in our company.'
      this.popMailVisible = true
    },
    handleReceiverChange (value) {
      if (this.bBatchNextStep) {
        return false
      }
      this.mail.cooperators = value
      // 触发修改
      this.mail = Object.assign({}, this.mail)
      this.applicationList = this.applicationList.map(tr => {
        const newTr = Object.assign({}, tr)
        if (this.mail.cooperators.indexOf(tr.id) === -1) {
          newTr.checkStatus = false
        } else {
          newTr.checkStatus = true
        }
        return newTr
      })
      this.selectedRows = this.getSelectedRows()
    }
  }
}
</script>

<style scoped lang="less">
.application-container{
  /*margin-top: -24px;*/
}
.anticon-down{
  font-size: 12px;
  color: #aaaaaa;
}
  .operation-div{
    padding: 5px 0 20px 0;
    text-align:center;
    .decline-btn{
      width: 20%;
      margin-right: 20px;
    }
    .accept-btn{
      width: 20%;
      margin-left: 20px;
    }
  }
</style>
