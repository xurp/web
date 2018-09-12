<template>
    <div class="offer-form">
      <a v-if="batch.offers.length" @click="batch.dialog = true">Send Offer to Selected</a>
      <a-table :loading="listLoading" :dataSource="list">
        <a-table-column>
          <a-checkbox
            slot="title"
            :checked="isAllChosen()"
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
        <a-table-column title="Department" dataIndex="department"></a-table-column>
        <a-table-column title="Position" dataIndex="position"></a-table-column>
        <a-table-column title="Result" dataIndex="result"></a-table-column>
        <a-table-column title="Action" key="action">
          <span slot-scope="text,record">
            <span v-if="record.sendStatus!=='1'"><a @click="openSendOfferModal(record)">Send Offer</a></span>
            <span v-else>Offer Sent!</span>
          </span>
        </a-table-column>
      </a-table>

      <a-modal width="680px" :visible="mailModalVisible" :confirmLoading="mailSendLoading" :maskClosable="false" :closable="false" @ok="startSendOffer" @cancel="closeSendOfferModal" cancleText="Cancel" okText="Send">
        <div class="mail-form-container">
          <a-form>
            <a-form-item label="MailTo" :labelCol="formLabelCol" :wrapperCol="formWrapperCol">
              <a-input v-model="mail.email"></a-input>
            </a-form-item>
            <a-form-item label="Subject" :labelCol="formLabelCol" :wrapperCol="formWrapperCol">
              <a-input v-model="mail.subject"></a-input>
            </a-form-item>
            <a-form-item :labelCol="formLabelCol">
              <a-textarea v-model="mail.content" :autosize="{maxRows: 12, minRows: 8}"></a-textarea>
            </a-form-item>
          </a-form>
        </div>
      </a-modal>

      <a-modal
        title="Sending Offers ..."
        :visible="batch.dialog"
        @cancel="batch.dialog = false"
        :closable="!batch.sending"
        :maskClosable="!batch.sending"
      >
        <p v-for="(status, idx) in batch.status" :key="idx">{{status}}</p>
        <template slot="footer">
          <a-button
            type="primary"
            v-if="batch.offers.length > 0 && !batch.sending"
            @click="batchSend"
          >Start</a-button>
          <a-button
            v-if="batch.offers.length === 0 && !batch.sending"
            @click="batch.dialog = false"
          >DONE</a-button>
        </template>
      </a-modal>
    </div>
</template>

<script>
import axios from '../../service'
export default {
  name: 'offer-list',
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
      }
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
        this.listLoading = false
      }, error => {
        console.error(error)
        this.listLoading = false
      })
    },
    openSendOfferModal (record) {
      this.mail.email = record.email
      this.curData = Object.assign({}, record)
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
    isAllChosen () {
      return this.batch.offers.length === this.list.filter(o => o.sendStatus !== '1').length
    },
    chooseOffer (offer) {
      console.log(offer)
      const idx = this.batch.offers.findIndex(o => o === offer)
      if (idx === -1) {
        this.batch.offers.push(offer)
      } else {
        this.batch.offers.splice(idx, 1)
      }
    },
    chooseAllOffer () {
      if (this.isAllChosen()) {
        this.batch.offers = []
      } else {
        this.batch.offers = [...this.list.filter(o => o.sendStatus !== '1')]
      }
    },
    async batchSend () {
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
    }
  }
}
</script>

<style scoped>

</style>
