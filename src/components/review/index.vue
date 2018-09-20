<template>
  <div class="list-container">
    <a-table :loading="listLoading" :dataSource="list">
      <a-table-column title="Username" key="username" dataIndex="username"></a-table-column>
      <a-table-column title="Email" key="email" dataIndex="email"></a-table-column>
      <a-table-column title="CompanyName" key="companyName" dataIndex="companyName"></a-table-column>
      <a-table-column title="LegalPerson" key="legalPerson" dataIndex="legalPerson"></a-table-column>
      <a-table-column title="Role" key="role" dataIndex="role"></a-table-column>
      <a-table-column title="Action" key="operation">
          <a slot-scope="text,record" v-on:click="showDetail(record)">Detail</a>
      </a-table-column>
    </a-table>
    <a-modal :visible="modalVisible" :closable="true" :maskClosable="true" @cancel="modalVisible=false">
      <a-form>
        <a-form-item>
          <a-form-item label="Id" :labelCol="labelStyle" :wrapperCol="wrapperStyle">
            <a-input v-model="editVal.id" :disabled="true"></a-input>
          </a-form-item>
          <a-form-item label="Username" :labelCol="labelStyle" :wrapperCol="wrapperStyle">
            <a-input v-model="editVal.username" :disabled="true"></a-input>
          </a-form-item>
          <a-form-item label="Email" :labelCol="labelStyle" :wrapperCol="wrapperStyle">
            <a-input v-model="editVal.email" :disabled="true"></a-input>
          </a-form-item>
          <a-form-item label="Companyname" :labelCol="labelStyle" :wrapperCol="wrapperStyle">
            <a-input v-model="editVal.companyName" :disabled="true"></a-input>
          </a-form-item>
          <a-form-item label="LegalPerson" :labelCol="labelStyle" :wrapperCol="wrapperStyle">
            <a-input v-model="editVal.legalPerson" :disabled="true"></a-input>
          </a-form-item>
          <a-form-item label="role" :labelCol="labelStyle" :wrapperCol="wrapperStyle">
            <a-input v-model="editVal.role" :disabled="true"></a-input>
          </a-form-item>
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button v-on:click="acceptHR" :loading="operating">Accept</a-button>
        <a-button v-on:click="declineHR" :loading="operating">Decline</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import axios from '../../service'
export default {
  name: 'index',
  data () {
    return {
      labelStyle: {
        xs: {span: 24},
        sm: {span: 5}
      },
      wrapperStyle: {
        xs: {span: 24},
        sm: {span: 16}
      },
      editVal: {},
      listLoading: false,
      modalVisible: false,
      operating: false,
      list: []
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.listLoading = true
      axios.request('review').then(response => {
        this.list = response.data
        this.listLoading = false
      }, error => {
        console.error(error)
      })
    },
    showDetail (record) {
      this.editVal = Object.assign({}, record)
      this.modalVisible = true
    },
    acceptHR (e) {
      this.operating = true
      axios.post('review/' + this.editVal.id, 'true').then(response => {
        this.modalVisible = false
        this.fetchData()
      }).finally(() => {
        this.operating = false
      })
    },
    declineHR () {
      this.operating = true
      axios.post('review/' + this.editVal.id, 'false').then(response => {
        this.modalVisible = false
        this.fetchData()
      }).finally(() => {
        this.operating = false
      })
    }
  }
}
</script>

<style scoped>

</style>
