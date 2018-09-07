<!--suppress ALL -->
<template>
  <div class="app-container">
    <a-table :columns="columns"
             :rowKey="record => record.id"
             :dataSource="list"
             :pagination="false"
             :loading="listLoading">
      <span slot="action" slot-scope="text, record">
        <a v-on:click="detailPosition(record)">Application Management</a>
    </span>
    </a-table>
  </div>
</template>

<script>
import axios from '../../service'
import moment from 'moment'
export default {
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      popVisible: false,
      tmpData: {},
      popLoading: false,
      viewMode: true,
      popTitle: '',
      formLabelCol: {xs: { span: 24 }, sm: { span: 5 }},
      formWrapCol: {xs: { span: 24 }, sm: { span: 18 }},
      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name'
        }, {
          title: 'CreateAt',
          dataIndex: 'createTime',
          key: 'createTime'
        }, {
          title: 'UpdateAt',
          dataIndex: 'updateTime',
          key: 'updateTime'
        }, {
          title: 'Amount',
          dataIndex: 'count',
          key: 'count'
        }, {
          title: 'Department',
          dataIndex: 'department',
          key: 'department'
        }, {
          title: 'Remark',
          dataIndex: 'remark',
          key: 'remark'
        }, {
          title: 'Action',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }]
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
            createTime: ''
          }
          Object.assign(as, tr)
          as['updateTime'] = moment(new Date(tr.updateTime).getTime()).format('YYYY-MM-DD HH:mm:ss')
          as['createTime'] = moment(new Date(tr.createTime).getTime()).format('YYYY-MM-DD HH:mm:ss')
          return as
        })
        this.listLoading = false
      }, error => {
        console.error(error)
      })
    },
    detailPosition (record) {
      localStorage.setItem('positionId', record.id)
      this.$router.push({name: 'Application List'})
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
