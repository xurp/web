<template>
  <div class="schedule-container">
    <h1 align="center">Interview Schedule</h1>
    <a-table
      :columns="columns"
      :dataSource="timePeriods.map(o => ({ time: o }))"
      :pagination="false"
    >
      <div
        v-for="day in days" :key="day"
        :slot="'checkbox-' + day" slot-scope="text, record"
      >
        <template v-if="numberOfTime > 1">
          <a-checkbox
            :checked="isChecked(day, record.time)"
            @change="handleTimeChoose(day, record.time)"
          />
        </template>
        <template v-else>
          <a-radio
            :checked="isChecked(day, record.time)"
            @change="handleTimeChooseSingle(day, record.time)"
          />
        </template>
      </div>
    </a-table>
    <a-button type="primary" @click="submit">Submit</a-button>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'schedule',
  data () {
    return {
      days: [
        '2018-09-10',
        '2018-09-11',
        '2018-09-12',
        '2018-09-13',
        '2018-09-14',
        '2018-09-15',
        '2018-09-16',
        '2018-09-17'
      ],
      timePeriods: [
        '09:00 ~ 10:00',
        '10:00 ~ 11:00',
        '11:00 ~ 12:00',
        '12:00 ~ 13:00',
        '13:00 ~ 14:00',
        '14:00 ~ 15:00',
        '15:00 ~ 16:00',
        '16:00 ~ 17:00',
        '17:00 ~ 18:00'
      ],
      numberOfTime: 3,
      chosenTimes: []
    }
  },
  computed: {
    columns () {
      return [{
        dataIndex: 'time'
      }, ...this.days.map(o => ({
        title: o,
        scopedSlots: { customRender: 'checkbox-' + o }
      }))]
    }
  },
  methods: {
    fetchData () {
      const range = [moment('2018-09-10'), moment('2018-09-17')]
      // TODO: fetch range
      const days = []
      for (const day = range[0]; day.isSameOrBefore(range[1]); day.add(1, 'day')) {
        days.push(day.format('YYYY-MM-DD'))
      }
      this.days = days
    },
    handleTimeChooseSingle (day, time) {
      this.chosenTimes = [{day, time}]
    },
    handleTimeChoose (day, time) {
      const idx = this.chosenTimes.findIndex(o => o.day === day && o.time === time)
      if (idx === -1) {
        if (this.chosenTimes.length === this.numberOfTime) {
          this.$message.warning(`Only ${this.numberOfTime} time periods can be chosen`)
        } else {
          this.chosenTimes.push({day, time})
        }
      } else {
        this.chosenTimes.splice(idx, 1)
      }
    },
    isChecked (day, time) {
      const idx = this.chosenTimes.findIndex(o => o.day === day && o.time === time)
      return idx !== -1
    },
    submit () {
      if (this.chosenTimes.length !== this.numberOfTime) {
        this.$message.warning(`Please choose ${this.numberOfTime} time periods`)
        return
      }
      console.log(this.chosenTimes)
      // TODO: update chosenTimes
      // TODO: create assessment if candidate
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

<style scoped lang="less">
  .schedule-container{
    width: 70vw;
    margin: 0 auto;
  }
</style>
