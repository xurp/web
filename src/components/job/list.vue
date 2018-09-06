<template>
  <div class="position-container">
    <a-table :dataSource="list" :loading="listLoading">
      <a-table-column title="Name" key="name" dataIndex="name"></a-table-column>
      <a-table-column title="Count" key="count" dataIndex="count"></a-table-column>
      <a-table-column title="Department" key="department" dataIndex="department"></a-table-column>
      <a-table-column title="Company" key="company" dataIndex="company"></a-table-column>
      <a-table-column title="Status" key="status" dataIndex="status"></a-table-column>
      <a-table-column title="Action" key="action">
        <a v-on:click="detailPosition(record)" slot-scope="text, record">Detail/Apply</a>
      </a-table-column>
    </a-table>

    <a-modal v-model="popVisible" :title="popTitle" onOk="handleOk" class="pop-model" :maskClosable="true">
      <a-form>
        <a-form-item label="Name" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
          <a-input v-model="curData.name" v-bind:disabled="true"></a-input>
        </a-form-item>
        <a-form-item label="Detail" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
          <a-textarea v-model="curData.detail" v-bind:disabled="true"></a-textarea>
        </a-form-item>
        <a-form-item label="Count" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
          <a-input-number class="detail-num" v-model="curData.count" v-bind:disabled="true"></a-input-number>
        </a-form-item>
        <a-form-item label="Department" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
          <a-input v-model="curData.department" v-bind:disabled="true"></a-input>
        </a-form-item>
        <a-form-item label="Company" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
          <a-input v-model="curData.company" v-bind:disabled="true" ></a-input>
        </a-form-item>
        <a-form-item label="Remark" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
          <a-input v-model="curData.remark" v-bind:disabled="true"></a-input>
        </a-form-item>
        <a-form-item label="CreateAt" :labelCol="formLabelCol" :wrapperCol="formWrapCol" v-if="true">
          <a-input v-model="curData.createTime" v-bind:disabled="true"></a-input>
        </a-form-item>
        <a-form-item label="UpdateAt" :labelCol="formLabelCol" :wrapperCol="formWrapCol" v-if="true">
          <a-input v-model="curData.updateTime" v-bind:disabled="true"></a-input>
        </a-form-item>
      </a-form>
      <template slot="footer" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
        <a-button type="dashed" key="back" @click="handlePopCancel">Cancel</a-button>
        <a-button key="submit" type="primary" :loading="btnLoading" @click="handleApply" v-bind:disabled="curData.applied==true">
          <span v-if="curData.applied==true">Already Applied</span>
          <span v-else>Apply</span>
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import axios from '../../service'
import moment from 'moment'

export default{
  data () {
    return {
      listLoading: false,
      curData: {},
      popVisible: false,
      btnLoading: false,
      formWrapCol: {
        xs: {span: 24},
        sm: {span: 16}
      },
      formLabelCol: {
        xs: {span: 24},
        sm: {span: 5}
      },
      popTitle: '',
      list: []
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.listLoading = true
      axios.request('job').then(response => {
        this.list = response.data.map(tr => {
          const as = {
            updateTime: '',
            createTime: '',
            company: ''
          }
          Object.assign(as, tr)
          Object.assign(as, {updateTime: moment(new Date(tr.updateTime).getTime()).format('YYYY-MM-DD HH:mm:ss')})
          Object.assign(as, {createTime: moment(new Date(tr.createTime).getTime()).format('YYYY-MM-DD HH:mm:ss')})
          Object.assign(as, {company: tr.company.companyName})
          Object.assign(as, {status: tr.applied ? 'applied' : 'not applied'})
          return as
        })
        this.listLoading = false
      }, error => {
        this.listLoading = false
        console.error(error)
      })
    },
    detailPosition (record) {
      this.curData = {
        ...record
      }
      this.popVisible = true
      this.popTitle = 'Position Detail - ' + record.name
    },
    handlePopCancel () {
      this.curData = {}
      this.popVisible = false
    },
    handleApply () {
      this.btnLoading = true
      axios.post('application', this.curData.id).then(response => {
        this.btnLoading = false
        this.$message.success('apply successfully!')
        this.popVisible = false
        this.fetchData()
      }, error => {
        // this.$message.error(error)
        this.btnLoading = false
        console.error(error)
      })
    }
  }
}
</script>
<style lang="less">
  .pop-model{
    width: 540px;
  }
  .position-create{
    float: right;
    margin: 20px auto;
  }
  .detail-num{
    width: 100%;
  }
</style>
