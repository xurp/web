<template>
    <div class="offer-form">
      <a-table :dataSource="list">
        <a-table-column title="Name" dataIndex="name"></a-table-column>
        <a-table-column title="Department" dataIndex="department"></a-table-column>
        <a-table-column title="Position" dataIndex="position"></a-table-column>
        <a-table-column title="Result" dataIndex="result"></a-table-column>
        <a-table-column title="Action" key="action" slot-scope="text,record">
          <span v-if="record.sendStatus!=='sent'"><a @click="openSendOfferModal" @cancel="closeSendOfferModal">Send Offer</a></span>
          <span v-else>Offer Sent!</span>
        </a-table-column>
      </a-table>

      <a-modal :visible="mailModalVisible" :maskClosable="false" :closable="true" @ok="startSendOffer" cancleText="Cancel" okText="Send">

      </a-modal>
    </div>
</template>

<script>
import axios from '../../service'
export default {
  name: 'offer-list',
  data () {
    return {
      list: [],
      mailModalVisible: false
    }
  },
  created () {
    this.fetchList()
  },
  methods: {
    fetchList () {
      axios.get('offer').then(response => {
        console.log(response.data)
        this.list = response.data
      })
    },
    openSendOfferModal () {
      this.mailModalVisible = true
    },
    startSendOffer () {

    },
    closeSendOfferModal () {
      this.mailModalVisible = false
    }
  }
}
</script>

<style scoped>

</style>
