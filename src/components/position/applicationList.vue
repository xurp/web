<template>
  <div class="application-container">
    <posDetail v-bind:curPosition="curPosition"></posDetail>
    <a-divider/>
    <a-steps :current="2">
      <a-step v-for="(curstep,index) in steps" :key="curstep.index" :title="curstep.name" :status="statuses[index]" v-on:click="handleStepClick(index)">
        <a-icon v-bind:type="getIconType(index)" slot="icon"/>
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
        <a slot-scope="text,record" v-on:click="detailApplication(record)">Detail/Operation</a>
        <!--<router-link slot-scope="text,record" :to="{name: 'Application Detail', params:{id: record.id}}">Detail/Operation</router-link>-->
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
      steps: [],
      statuses: []
    }
  },
  created () {
    this.fetchJobDetail()
    this.fetchList()
  },
  methods: {
    handleStepClick (index) {
      this.statuses = this.statuses.map((tr, ind) => {
        if (index === ind) {
          return 'process'
        } else {
          return 'wait'
        }
      })
      this.step = this.steps[index].index
      this.fetchList()
    },
    fetchJobDetail () {
      axios.get('job/' + localStorage.getItem('positionId')).then(response => {
        this.curPosition = response.data
        this.curPosition.createTime = moment(new Date(response.data.createTime).getTime()).format('YYYY-MM-DD HH:mm:ss')
        this.curPosition.updateTime = moment(new Date(response.data.updateTime).getTime()).format('YYYY-MM-DD HH:mm:ss')
        this.steps = this.curPosition.step
        this.statuses = this.steps.map(tr => {
          return 'wait'
        })
      })
    },
    fetchList () {
      axios.get('application?jobId=' + localStorage.getItem('positionId') + '&step=' + this.step).then(response => {
        this.applicationList = response.data.map(tr => {
          return {
            ...tr,
            ...tr.user,
            ...tr.resume,
            id: tr.id
          }
        })
      }, error => {
        console.error(error)
      })
    },
    detailApplication (record) {
      localStorage.setItem('applicationId', record.id)
      this.$router.push({name: 'Application Detail'})
    },
    getIconType (index) {
      if (index === 0) {
        return 'solution'
      }
      if (index === this.steps.length - 1) {
        return 'usergroup-add'
      } else {
        return 'clock-circle-o'
      }
    }
  }
}
</script>

<style scoped lang="less">
.application-container{
  margin-top: -24px;
}
</style>
