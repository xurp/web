<template>
  <div class="application-container">
    <posDetail v-bind:curPosition="curPosition"></posDetail>
    <a-divider/>
    <a-steps>
      <a-step status="finish" title="Login">
        <a-icon type="user" slot="icon"/>
      </a-step>
      <a-step status="finish" title="Verification">
        <a-icon type="solution" slot="icon"/>
      </a-step>
      <a-step status="process" title="Pay">
        <a-icon type="loading" slot="icon"/>
      </a-step>
      <a-step status="wait" title="Done">
        <a-icon type="smile-o" slot="icon"/>
      </a-step>
    </a-steps>
    <a-table :dataSource="applicationList">
      <a-table-column title="Name" key="name" dataIndex="name"></a-table-column>
      <a-table-column title="School" key="school" dataIndex="school"></a-table-column>
      <a-table-column title="Major" key="major" dataIndex="major"></a-table-column>
      <a-table-column title="Age" key="age" dataIndex="age"></a-table-column>
      <a-table-column title="Gender" key="gender" dataIndex="gender"></a-table-column>
      <a-column title="Action" key="action">
        <a slot-scope="text,record" v-on:click="detailApplicatioin(record)">Detail/Operation</a>
      </a-column>
    </a-table>
  </div>
</template>

<script>
import posDetail from './posDetailComponent'
import axios from '../../service'
import moment from 'moment'
export default {
  name: 'application-list',
  components: {posDetail},
  data () {
    return {
      curPosition: {},
      step: 'ALL',
      applicationList: []
    }
  },
  created () {
    this.fetchList()
  },
  methods: {
    fetchList () {
      axios.get('job/' + this.$route.params.id).then(response => {
        this.curPosition = response.data
        this.curPosition.createTime = moment(new Date(response.data.createTime).getTime()).format('YYYY-MM-DD HH:mm:ss')
        this.curPosition.updateTime = moment(new Date(response.data.updateTime).getTime()).format('YYYY-MM-DD HH:mm:ss')
      })
      axios.get('application?jobId=' + this.$route.params.id + '&step=' + this.step).then(response => {
        this.applicationList = response.data.map(tr => {
          return {
            ...tr,
            ...tr.user,
            ...tr.resume,
            id: tr.id
          }
        })
      })
    },
    detailApplicatioin (record) {
      axios.get('application/' + record.id).then(response => {
        console.log(response.data)
      })
    }
  }
}
</script>

<style scoped lang="less">
.application-container{
  margin-top: -24px;
}
</style>
