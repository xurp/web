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
            :disabled="isDisabled(day, record.time)"
            @change="handleTimeChoose(day, record.time)"
          />
        </template>
        <template v-else>
          <a-radio
            :checked="isChecked(day, record.time)"
            :disabled="isDisabled(day, record.time)"
            @change="handleTimeChooseSingle(day, record.time)"
          />
        </template>
      </div>
    </a-table>
    <div style="margin-top: 16px; text-align: center">
      <a-button
        size="large" type="primary"
        @click="submit"
      >Submit</a-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import uuid from 'uuid'
import axios from '../../service'
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
      disabledTimes: [],
      numberOfTime: 1,
      chosenTimes: []
    }
  },
  computed: {
    isCurrentInterviewer () {
      return this.$route.name.substr(11).toLowerCase() === 'interviewer'
    },
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
      axios.get(`operation/${this.$route.params.operationId}`).then(r => {
        // TODO: fetch range
      })
      // convert range to days
      const range = [moment('2018-09-10'), moment('2018-09-17')]
      const days = []
      for (const day = range[0]; day.isSameOrBefore(range[1]); day.add(1, 'day')) {
        days.push(day.format('YYYY-MM-DD'))
      }
      this.days = days

      if (this.isCurrentInterviewer) {
        // TODO: fetch numberOfTime
      } else {
        this.numberOfTime = 1
      }

      if (!this.isCurrentInterviewer) { // candidate
        axios.get('schedule', { params: this.$route.params }).then(r => {
          // TODO: fetch disabledTimes
        })
        this.disabledTimes = [
          {day: '2018-09-11', time: '10:00 ~ 11:00'}
        ]
      }
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
    isDisabled (day, time) {
      const idx = this.disabledTimes.findIndex(o => o.day === day && o.time === time)
      return idx !== -1
    },
    submit () {
      if (this.chosenTimes.length !== this.numberOfTime) {
        this.$message.warning(`Please choose ${this.numberOfTime} time periods`)
        return
      }
      if (this.isCurrentInterviewer) {
        // TODO: update chosenTimes
        axios.post('schedule', this.chosenTimes)
      } else {
        // TODO: create assessment
        const url = `${window.location.origin}/#/assess/${uuid()}`
        console.log(url)
      }
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

<style lang="less" scoped>
  .schedule-container {
    width: 80vw;
    margin: 0 auto;
    padding-top: 64px;
  }
</style>
