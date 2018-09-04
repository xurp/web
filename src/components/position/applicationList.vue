<template>
  <div class="application-container">
    <posDetail v-bind:curPosition="curPosition"></posDetail>
    <a-divider/>
    <a-steps>
      <a-step v-for="curstep in steps" :key="curstep.index" :title="curstep.name" status="process">
        <a-icon type="user" slot="icon"/>
      </a-step>
    </a-steps>
    <a-divider/>
    <a-table :dataSource="applicationList">
      <a-table-column title="Name" key="name" dataIndex="name"></a-table-column>
      <a-table-column title="School" key="school" dataIndex="school"></a-table-column>
      <a-table-column title="Major" key="major" dataIndex="major"></a-table-column>
      <a-table-column title="Age" key="age" dataIndex="age"></a-table-column>
      <a-table-column title="Gender" key="gender" dataIndex="gender"></a-table-column>
      <a-column title="Action" key="action">
        <!--<a slot-scope="text,record" v-on:click="detailApplicatioin(record)">Detail/Operation</a>-->
        <router-link slot-scope="text,record" :to="{name: 'Application Detail', params:{id: record.id}}">Detail/Operation</router-link>
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
      applicationList: [],
      steps: []
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
        this.steps = this.curPosition.step
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
        console.log(this.applicationList)
      })
    }/*,
    detailApplicatioin (record) {
      axios.get('application/' + record.id).then(response => {
        console.log(response.data)
      })
      this.$router.push('/position/')
    } */
  }
}
</script>

<style scoped lang="less">
.application-container{
  margin-top: -24px;
}
</style>
