<!--suppress ALL -->
<template>
  <div class="app-container">
    <a-table :columns="columns"
             :rowKey="record => record.id"
             :dataSource="list"
             :pagination="false"
             :loading="listLoading">
      <span slot="action" slot-scope="text, record">
        <!--<router-link :to="{name: 'Application List', params: { id: record.id } }">DETAIL</router-link>-->
        <a-button v-on:click="detailPosition(record)">Detail</a-button>
        <a-divider type="vertical" />
        <a-button v-on:click="modifyPosition(record)">Modify</a-button>
        <!--<a-divider type="vertical" />-->
        <!--<a-popconfirm-->
          <!--title="Sure to delete?"-->
          <!--@confirm="() => deletePosition(record.key)">-->
          <!--<a-button v-on:click="deletePosition">Delete</a-button>-->
        <!--</a-popconfirm>-->

    </span>
    </a-table>

    <a-modal v-model="popVisible" :title="popTitle" onOk="handleOk" class="pop-model" :maskClosable="false">
      <a-form>
        <a-form-item label="Name" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
          <a-input v-model="tmpData.name" v-bind:disabled="viewMode" placeholder="Position name"></a-input>
        </a-form-item>
        <a-form-item label="Detail" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
          <a-textarea v-model="tmpData.detail" v-bind:disabled="viewMode" placeholder="Position detail"></a-textarea>
        </a-form-item>
        <a-form-item label="Amount" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
          <a-input-number class="detail-num" v-model="tmpData.count" v-bind:disabled="viewMode" placeholder="Recruitment count"></a-input-number>
        </a-form-item>
        <a-form-item label="Department" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
          <a-input v-model="tmpData.department" v-bind:disabled="viewMode" placeholder="Recruitment department"></a-input>
        </a-form-item>
        <a-form-item label="Remark" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
          <a-input v-model="tmpData.remark" v-bind:disabled="viewMode" placeholder="remark"></a-input>
        </a-form-item>
        <a-form-item label="CreateAt" :labelCol="formLabelCol" :wrapperCol="formWrapCol" v-if="viewMode">
            <a-input v-model="tmpData.createTime" v-bind:disabled="viewMode" placeholder="createAt"></a-input>
        </a-form-item>
        <a-form-item label="UpdateAt" :labelCol="formLabelCol" :wrapperCol="formWrapCol" v-if="viewMode">
          <a-input v-model="tmpData.updateTime" v-bind:disabled="viewMode" placeholder="updateAt"></a-input>
        </a-form-item>
      </a-form>
      <template slot="footer" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
        <a @click="navToAppList">navigate to applications</a>
        <a-button key="back" @click="handlePopCancel">Cancel</a-button>
        <a-button key="submit" type="primary"  v-if="!viewMode" :loading="popLoading" @click="handlePopOK">
          OK
        </a-button>
      </template>
    </a-modal>
    <a-button class="position-create" v-on:click="handleCreate">Create New Position</a-button>
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
      createMode: false,
      formLabelCol: {xs: { span: 24 }, sm: { span: 5 }},
      formWrapCol: {xs: { span: 24 }, sm: { span: 18 }},
      columns: [
        /* {
          title: 'Id',
          dataIndex: 'id',
          key: 'id',
          visible: false
        }, */ {
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
        }, /* {
          title: 'Detail',
          dataIndex: 'detail',
          key: 'detail'
        }, */ {
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
      // localStorage.setItem('positionId', record.id)
      // this.$router.push({name: 'Application List'})
      this.popVisible = true
      this.viewMode = true
      this.popTitle = 'Detail ' + record.name
      this.tmpData = {
        id: record.id,
        name: record.name,
        detail: record.detail,
        createTime: record.createTime,
        updateTime: record.updateTime,
        count: record.count,
        department: record.department,
        remark: record.remark
      }
    },
    modifyPosition (record) {
      this.popTitle = 'Modify ' + record.name
      this.tmpData = {
        id: record.id,
        name: record.name,
        detail: record.detail,
        createTime: record.createTime,
        updateTime: record.updateTime,
        count: record.count,
        department: record.department,
        remark: record.remark
      }
      this.createMode = false
      this.popVisible = true
      this.viewMode = false
    },
    deletePosition (record) {
    },
    handlePopCancel (record) {
      this.popVisible = false
    },
    handlePopOK (record) {
      this.popLoading = true
      const postData = {}
      Object.assign(postData, this.tmpData)
      this.$set(postData, 'updateTime', new Date().getTime())
      this.$set(postData, 'createTime', new Date().getTime())
      if (this.createMode) {
        axios.post('job', postData).then(response => {
          this.popLoading = false
          this.popVisible = false
          this.fetchData()
        }, error => {
          this.popLoading = false
          console.error(error)
        })
      } else {
        axios.put('job/' + this.tmpData.id, postData).then(response => {
          this.popLoading = false
          this.popVisible = false
          this.fetchData()
        }, error => {
          this.popLoading = false
          console.error(error)
        })
      }
    },
    handleCreate () {
      this.popTitle = 'Create New Position'
      this.createMode = true
      this.tmpData = {}
      this.viewMode = false
      this.popVisible = true
    },
    navToAppList () {
      // localStorage中如果存在该值，就直接导航到该列表，然后加载完成时直接移除localStorage
      localStorage.setItem('Position2ApplicationId', this.tmpData.id)
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
