<template>
  <div class="schedule-container">
    <h1 align="center">Interview Schedule</h1>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
    >
      <span slot="checkboxTitle">{{chosenTimes.length}} / {{numberOfTime}}</span>
      <span slot="checkbox" slot-scope="record">
        <template v-if="numberOfTime > 1">
          <a-checkbox
            :checked="isChecked(record)"
            @change="handleTimeChoose(record)"
          />
        </template>
        <template v-else>
          <a-radio
            :checked="isChecked(record)"
            @change="handleTimeChooseSingle(record)"
          />
        </template>
      </span>
    </a-table>
    <a-button type="primary" @click="submit">Submit</a-button>
  </div>
</template>

<script>
export default {
  name: 'schedule',
  data () {
    return {
      columns: [{
        key: '#',
        slots: { title: 'checkboxTitle' },
        scopedSlots: { customRender: 'checkbox' }
      }, {
        key: 'time',
        title: 'Time',
        dataIndex: 'time'
      }],
      dataSource: [
        {time: '2018-09-10 09:00 - 10:00'},
        {time: '2018-09-10 10:00 - 11:00'},
        {time: '2018-09-10 11:00 - 12:00'},
        {time: '2018-09-10 13:00 - 14:00'},
        {time: '2018-09-10 14:00 - 15:00'},
        {time: '2018-09-10 15:00 - 16:00'},
        {time: '2018-09-10 16:00 - 17:00'},
        {time: '2018-09-10 17:00 - 18:00'}
      ],
      numberOfTime: 1,
      chosenTimes: []
    }
  },
  methods: {
    handleTimeChooseSingle (item) {
      this.chosenTimes = [item]
    },
    handleTimeChoose (item) {
      const idx = this.chosenTimes.findIndex(o => o.time === item.time)
      if (idx === -1) {
        if (this.chosenTimes.length === this.numberOfTime) {
          this.$message.warning(`Only ${this.numberOfTime} time periods can be chosen`)
        } else {
          this.chosenTimes.push(item)
        }
      } else {
        this.chosenTimes.splice(idx, 1)
      }
      console.log(this.chosenTimes)
    },
    isChecked (item) {
      const idx = this.chosenTimes.findIndex(o => o.time === item.time)
      return idx !== -1
    },
    submit () {
      if (this.chosenTimes.length !== this.numberOfTime) {
        this.$message.warning(`Please choose ${this.numberOfTime} time periods`)
        return
      }
      console.log('submit')
    }
  }
}
</script>

<style scoped lang="less">
  .schedule-container{
    width: 70vw;
    margin: 0 auto;
  }
</style>
