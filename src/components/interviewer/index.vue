<template>
    <div class="interviewer-container">
      <a-table :columns="cols" :dataSource="list">
        <span slot="action" slot-scope="text,index">
          <a>Detail</a>
          <a-divider type="vertical"></a-divider>
          <a>Modify</a>
          <a-divider type="vertical"></a-divider>
          <a>Delete</a>
        </span>
      </a-table>
      <a-button type="primary" style="width:20vh;margin-left:40vh;">Create New</a-button>
    </div>
</template>

<script>
import axios from '../../service'
export default {
  name: 'interviewer',
  data: () => ({
    cols: [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department'
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: 'Actions',
        dataIndex: 'action',
        scopedSlots: {customRender: 'action'}
      }],
    list: []
  }),
  created () {
    this.fetchList()
  },
  methods: {
    fetchList () {
      axios.get('review/cooperator').then(response => {
        this.list = response.data
      })
    }
  }
}
</script>

<style scoped>

</style>
