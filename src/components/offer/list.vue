<template>
    <div class="offer-form">
      <a v-if="batch.offers.length" @click="openMultiSendModal">Send Offer to Selected</a>
      <a-table :loading="listLoading" :dataSource="list">
        <a-table-column>
          <a-checkbox
            slot="title"
            :checked="isAllChosen"
            @change="chooseAllOffer"
          />
          <a-checkbox
            slot-scope="text, record"
            :disabled="record.sendStatus === '1'"
            :checked="batch.offers.findIndex(o => o === record) !== -1"
            @change="chooseOffer(record)"
          />
        </a-table-column>
        <a-table-column title="Name" dataIndex="name"></a-table-column>
        <a-table-column title="Phone" dataIndex="phone"></a-table-column>
        <a-table-column
          title="Position" dataIndex="position"
          :filters="list.map(o => o.position).unique().map(o => ({text: o, value: o}))"
          @filter="(value, record) => record.position === value"
        ></a-table-column>
        <a-table-column
          title="Department" dataIndex="department"
          :filters="list.map(o => o.department).unique().map(o => ({text: o, value: o}))"
          @filter="(value, record) => record.department === value"
        ></a-table-column>
        <a-table-column
          title="Result" dataIndex="result"
          :filters="list.map(o => o.result).unique().map(o => ({text: o, value: o}))"
          @filter="(value, record) => record.result === value">
          <span slot-scope="text" :style="{color: text==='reject'?'red':'green'}">{{text}}</span>
        </a-table-column>
        <a-table-column title="Remark" dataIndex="remark"></a-table-column>
        <a-table-column title="Action" key="action">
          <span slot-scope="text,record">
            <a @click="openDetailModal(record)">Detail</a>
              <a-divider type="vertical"></a-divider>
            <span v-if="record.sendStatus!=='1'">
              <a @click="openSendOfferModal(record)">Accept Offer</a>
              <a-divider type="vertical"></a-divider>
              <a @click="openDeclineModal(record)">Decline Offer</a>
            </span>
            <span v-else>Offer Sent!</span>
          </span>
        </a-table-column>
      </a-table>

      <a-modal width="680px" :visible="mailModalVisible" :confirmLoading="mailSendLoading" :maskClosable="false" :closable="false" @ok="batchSend" @cancel="closeSendOfferModal" cancleText="Cancel" okText="Send">
        <div class="mail-form-container">
          <mail-component :mail="mail" :is-receiver-list="true" :show-add-receiver="false" :email-type="offerType" :receiver-list="receiverList" :select-mode="'tags'"
                          :show-date="false" @receiverChange="handleReceiverChange"></mail-component>
          <a-form>
            <a-form-item label="Remark" :labelCol="{span: 2}" :wrapperCol="{span: 22}">
              <a-textarea v-model="curRemark"></a-textarea>
            </a-form-item>
          </a-form>
        </div>
      </a-modal>

      <a-modal width="680px" :visible="detailModalVisible" :maskClosable="true" :closable="false" :footer="null" @cancel="closeDetailModal" cancelText="close">
        <div class="detail-container">
          <resume-panel title="Resume Detail" :resume-data="curDetailRecord.resume"></resume-panel>
          <titled-card title="Assessment Detail">
            <assess-component :assesses="curDetailRecord.assesses" :steps="curDetailRecord.steps"></assess-component>
          </titled-card>
        </div>
      </a-modal>

      <a-modal
        title="Sending Offers ..."
        :visible="batch.dialog"
        @cancel="clearBatch"
        :closable="!batch.sending"
        :maskClosable="!batch.sending"
      >
        <p v-for="(status, idx) in batch.status" :key="idx">{{status}}</p>
        <template slot="footer">
          <template v-if="batch.offers.length > 0 && !batch.sending">
            <a-button type="primary" @click="batchSend">Start</a-button>
          </template>
          <template v-else-if="batch.offers.length === 0 && !batch.sending">
            <a-button @click="clearBatch">DONE</a-button>
          </template>
          <template v-else>
            Please wait ...
          </template>
        </template>
      </a-modal>
    </div>
</template>

<script>
import axios from '../../service'
import mailComponent from '../subComponent/mailComponent'
import titledCard from '../subComponent/titledCard'
import resumePanel from '../subComponent/resumePanel'
import moment from 'moment'
import AssessComponent from '../application/assessComponent'
export default {
  name: 'offer-list',
  components: {AssessComponent, mailComponent, titledCard, resumePanel},
  data () {
    return {
      listLoading: false,
      list: [],
      mailModalVisible: false,
      formLabelCol: {
        span: 3
      },
      formWrapperCol: {
        span: 20
      },
      mail: {
        email: '',
        subject: 'Offer reject information'
      },
      curData: {},
      mailSendLoading: false,
      batch: {
        offers: [],
        status: [],
        dialog: false,
        sending: false
      },
      receiverList: [],
      detailModalVisible: false,
      curDetailRecord: {},
      offerType: '', // offer 或 rejectoffer
      curRemark: ''
    }
  },
  computed: {
    isAllChosen () {
      return this.batch.offers.length > 0 &&
        this.batch.offers.length === this.list.filter(o => o.sendStatus !== '1').length
    }
  },
  created () {
    this.fetchList()
  },
  methods: {
    fetchList () {
      this.listLoading = true
      axios.get('offer').then(response => {
        console.log(response.data)
        this.list = response.data.map(tr => {
          return {
            id: tr.id,
            name: tr.applicationDTO.resume.name,
            email: tr.applicationDTO.resume.email,
            phone: tr.applicationDTO.resume.phone,
            position: tr.applicationDTO.job.name,
            department: tr.applicationDTO.job.department,
            result: tr.result,
            sendStatus: tr.sendStatus,
            resume: tr.applicationDTO.resume,
            applicationId: tr.applicationDTO.id,
            jobId: tr.applicationDTO.job.id,
            remark: tr.remark
          }
        })
        this.receiverList = this.list.map(tr => {
          return {
            id: tr.id,
            name: tr.name
          }
        })
        this.listLoading = false
      }, error => {
        console.error(error)
        this.listLoading = false
      })
    },
    handleReceiverChange (value) {
      for (const val of value) {
        const idx = this.batch.offers.findIndex(tr => tr.id === val)
        if (idx === -1) {
          this.batch.offers.push(this.list.find(tr => tr.id === val))
        } else {
          this.batch.offers.splice(idx, 1)
        }
      }
      this.receiverList = this.receiverList.map(tr => { return tr })
    },
    openSendOfferModal (record) {
      this.curRemark = ''
      this.offerType = 'offer'
      this.mail.subject = 'Offer accept information'
      this.curData = Object.assign({}, record)
      this.mail.receivers = record.id
      this.batch.offers = [this.list.find(tr => tr.id === record.id)]
      this.mailModalVisible = true
    },
    openMultiSendModal () {
      this.curRemark = ''
      this.offerType = 'offer'
      this.mail.subject = 'Offer accept information'
      this.receiverList = this.batch.offers.map(tr => {
        return {id: tr.id, name: tr.name}
      })
      this.mail.receivers = this.batch.offers.map(tr => {
        return tr.id
      })
      this.mailModalVisible = true
    },
    startSendOffer () {
      this.mailSendLoading = true
      return axios.put('offer', {
        offerId: this.curData.id,
        receiver: this.mail.email,
        subject: this.mail.subject,
        content: this.mail.content,
        remark: this.curRemark,
        result: this.offerType === 'offer' ? 'accept' : 'reject'
      }).then(response => {
        this.mailSendLoading = false
        this.mailModalVisible = false
        this.fetchList()
      }, error => {
        this.mailSendLoading = false
        console.error(error)
      })
    },
    openDetailModal (record) {
      this.curDetailRecord.resume = Object.assign({}, record.resume)
      axios.get('assessment?applicationId=' + record.applicationId).then(response => {
        this.curDetailRecord.assesses = response.data.map(tr => {
          const newTr = {id: tr.id,
            department: tr.cooperator === null ? '' : tr.cooperator.department,
            name: tr.cooperator === null ? 'To be arranged' : tr.cooperator.name,
            time: moment(new Date(tr.assessmentTime).getTime()).format('YYYY-MM-DD HH-mm:ss'),
            content: tr.comment,
            step: tr.step,
            pass: tr.pass,
            reviewTime: tr.interviewTime === null ? '' : moment(new Date(tr.interviewTime).getTime()).format('YYYY-MM-DD HH-mm:ss'),
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
        axios.get('job/' + record.jobId).then(response => {
          this.curDetailRecord.steps = response.data.step
          this.detailModalVisible = true
        })
      })
    },
    closeDetailModal () {
      this.curDetailRecord.resume = {}
      this.curDetailRecord.steps = []
      this.curDetailRecord.assesses = []
      this.detailModalVisible = false
    },
    closeSendOfferModal () {
      this.mailModalVisible = false
    },
    openDeclineModal (record) {
      // TODO 这里和上面的函数一起修改
      this.curRemark = ''
      this.offerType = 'rejectoffer'
      this.mail.subject = 'Offer reject information'
      this.curData = Object.assign({}, record)
      this.mail.receivers = record.id
      this.batch.offers = [this.list.find(tr => tr.id === record.id)]
      this.mailModalVisible = true
    },
    chooseOffer (offer) {
      const idx = this.batch.offers.findIndex(o => o === offer)
      if (idx === -1) {
        this.batch.offers.push(offer)
      } else {
        this.batch.offers.splice(idx, 1)
      }
    },
    chooseAllOffer () {
      if (this.isAllChosen) {
        this.batch.offers = []
      } else {
        this.batch.offers = [...this.list.filter(o => o.sendStatus !== '1')]
      }
    },
    async batchSend () {
      this.batch.dialog = true
      this.batch.sending = true
      for (const offer of this.batch.offers) {
        this.mail.email = offer.email
        this.curData = Object.assign({}, offer)
        let message = this.offerType === `offer` ? `Sending offer to ${offer.name} ... ` : `Sending reject to ${offer.name}`
        this.batch.status.push(message)
        try {
          await this.startSendOffer()
          message += 'Succeed'
        } catch (e) {
          message += 'Failed'
        }
        this.batch.status[this.batch.status.length - 1] = message
      }
      this.batch.offers = []
      this.batch.sending = false
    },
    clearBatch () {
      this.batch.offers = []
      this.batch.status = []
      this.batch.dialog = false
      this.batch.sending = false
    }
  }
}
</script>

<style scoped>

</style>
