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
        <a-table-column
          title="Department" dataIndex="department"
          :filters="list.map(o => o.department).unique().map(o => ({text: o, value: o}))"
          @filter="(value, record) => record.department === value"
        ></a-table-column>
        <a-table-column
          title="Position" dataIndex="position"
          :filters="list.map(o => o.position).unique().map(o => ({text: o, value: o}))"
          @filter="(value, record) => record.position === value"
        ></a-table-column>
        <a-table-column
          title="Result" dataIndex="result"
          :filters="list.map(o => o.result).unique().map(o => ({text: o, value: o}))"
          @filter="(value, record) => record.result === value"
        ></a-table-column>
        <a-table-column title="Action" key="action">
          <span slot-scope="text,record">
            <span v-if="record.sendStatus!=='1'"><a @click="openSendOfferModal(record)">Send Offer</a></span>
            <span v-else>Offer Sent!</span>
          </span>
        </a-table-column>
      </a-table>

      <a-modal width="680px" :visible="mailModalVisible" :confirmLoading="mailSendLoading" :maskClosable="false" :closable="false" @ok="batchSend" @cancel="closeSendOfferModal" cancleText="Cancel" okText="Send">
        <div class="mail-form-container">
          <mail-component :mail="mail" :is-receiver-list="true" :show-add-receiver="false" :email-type="'offer'" :receiver-list="receiverList" :select-mode="'tags'"
                          :show-date="false" @receiverChange="handleReceiverChange"></mail-component>
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
export default {
  name: 'offer-list',
  components: {mailComponent},
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
        subject: 'you pass',
        content: 'Congratulations'
      },
      curData: {},
      mailSendLoading: false,
      batch: {
        offers: [],
        status: [],
        dialog: false,
        sending: false
      },
      receiverList: []
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
        this.list = response.data.map(tr => {
          return {
            id: tr.id,
            name: tr.applicationDTO.resume.name,
            email: tr.applicationDTO.resume.email,
            department: tr.applicationDTO.job.department,
            position: tr.applicationDTO.job.name,
            result: tr.result,
            sendStatus: tr.sendStatus
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
      this.curData = Object.assign({}, record)
      this.mail.receivers = record.id
      this.batch.offers = [this.list.find(tr => tr.id === record.id)]
      this.mailModalVisible = true
    },
    openMultiSendModal () {
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
      return axios.put('offer', {offerId: this.curData.id, receiver: this.mail.email, subject: this.mail.subject, content: this.mail.content}).then(response => {
        this.mailSendLoading = false
        this.mailModalVisible = false
        this.fetchList()
      }, error => {
        this.mailSendLoading = false
        console.error(error)
      })
    },
    closeSendOfferModal () {
      this.mailModalVisible = false
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
        let message = `Sending offer to ${offer.name} ... `
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
