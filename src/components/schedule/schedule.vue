<template>
  <div class="schedule-container">
    <h1 align="center">Interview Schedule</h1>
    <template v-if="alreadyDone">
      <a-alert
        v-if="alreadyDone"
        type="success" show-icon
        message="Operation Done"
        description="You have already done the schedule arrange"
      />
    </template>
    <template v-else>
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
          :disabled="numberOfTime !== chosenTimes.length"
        >
          <span v-if="numberOfTime === 1 || numberOfTime === chosenTimes.length">Submit</span>
          <span v-else>{{chosenTimes.length}} / {{numberOfTime}}</span>
        </a-button>
      </div>
    </template>
  </div>
</template>

<script>
import moment from 'moment'
import axios from '../../service'
export default {
  name: 'schedule',
  data () {
    return {
      alreadyDone: false,
      days: [],
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
      availableTimes: true,
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
      if (this.isCurrentInterviewer) {
        axios.get('appointedTime', {params: this.$route.params}).then(r => {
          this.processRange(moment(r.data.startDate), moment(r.data.endDate))
          this.numberOfTime = r.data.number
        }).catch(e => {
          this.alreadyDone = true
        })
      } else {
        this.availableTimes = []
        this.numberOfTime = 1
        const params = {
          operationId: this.$route.params.operationId
        }
        axios.get('appointedTime/schedule', { params }).then(r => {
          let start, end
          r.data.map(o => moment(o.startTime)).forEach(o => {
            if (!start || o.isBefore(start)) {
              start = o
            }
            if (!end || o.isAfter(end)) {
              end = o
            }
            const daytime = {
              day: o.format('YYYY-MM-DD'),
              time: this.timePeriods.find(t => t.substr(0, 2) === o.format('HH'))
            }
            console.log(daytime)
            this.availableTimes.push(daytime)
          })
          if (start && end) {
            this.processRange(start, end)
          }
        })
      }
    },
    processRange (start, end) {
      const days = []
      for (const day = start; day.isSameOrBefore(end); day.add(1, 'day')) {
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
    isDisabled (day, time) {
      if (this.availableTimes === true) {
        return false
      }
      const idx = this.availableTimes.findIndex(o => o.day === day && o.time === time)
      return idx === -1
    },
    submit () {
      if (this.chosenTimes.length !== this.numberOfTime) {
        this.$message.warning(`Please choose ${this.numberOfTime} time periods`)
        return
      }
      if (this.isCurrentInterviewer) {
        const data = {
          ...this.$route.params,
          startTimes: this.chosenTimes.map(o => `${o.day}T${o.time.substr(0, 5)}:00.000+0000`)
        }
        axios.put('appointedTime', data).then(r => {
          this.alreadyDone = true
        })
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
