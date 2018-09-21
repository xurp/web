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
      <a-alert
        v-if="alreadyDone"
        type="info" show-icon
        message="Interview Info"
        style="margin-top: 16px"
      >
        <template slot="description">
          <div style="margin-top: 16px"><strong>Time</strong></div>
          <div v-for="(c, idx) in chosenTimes" :key="idx">{{c.day}} {{c.time}}</div>
          <div style="margin-top: 16px"><strong>Address</strong></div>
          <div>Westgate Mall 9F, No.1038 West Nanjing Road, Jing An District, Shanghai</div>
        </template>
      </a-alert>
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
          <template v-if="isCurrentInterviewer">
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
          </template>
          <template v-else>
            <a-button
              type="primary"
              v-if="isAvailable(day, record.time)"
              @click="occupy(day, record.time)"
            >Select</a-button>
          </template>
        </div>
      </a-table>
      <div v-if="isCurrentInterviewer" style="margin-top: 16px; text-align: center">
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
      timePeriods: [],
      availableTimes: true,
      numberOfTime: 1,
      chosenTimes: []
    }
  },
  computed: {
    isCurrentInterviewer () {
      return this.$route.name.substr(11).toLowerCase() === 'interviewer'
    },
    isChecked () {
      return (day, time) => {
        const idx = this.chosenTimes.findIndex(o => o.day === day && o.time === time)
        return idx !== -1
      }
    },
    isAvailable () {
      return (day, time) => {
        if (this.availableTimes === true) {
          return true
        }
        const idx = this.availableTimes.findIndex(o => o.day === day && o.time === time)
        return idx !== -1
      }
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
          const range = [moment(r.data.startDate), moment(r.data.endDate)]
          const days = []
          for (const day = range[0]; day.isSameOrBefore(range[1]); day.add(1, 'day')) {
            days.push(day.format('YYYY-MM-DD'))
          }
          this.days = days
          this.timePeriods = JSON.parse(r.data.periods)
          this.numberOfTime = r.data.number
        }).catch(e => {
          this.alreadyDone = true
        })
      } else {
        // check done
        axios.get('assessment/' + this.$route.params.assessmentId).then(r => {
          if (r.data.interviewTime) {
            this.alreadyDone = true
          }
        }).catch(e => {
          this.alreadyDone = true
        })

        // fetch available times
        this.availableTimes = []
        this.numberOfTime = 1
        const params = {
          operationId: this.$route.params.operationId
        }
        axios.get('appointedTime/schedule', { params }).then(r => {
          const timePeriods = r.data.map(o => `${moment(o.startTime).format('HH:mm')} ~ ${moment(o.endTime).format('HH:mm')}`).unique()
          const days = r.data.map(o => moment(o.startTime).format('YYYY-MM-DD')).unique().sort()
          r.data.forEach(o => {
            const day = moment(o.startTime).format('YYYY-MM-DD')
            const time = `${moment(o.startTime).format('HH:mm')} ~ ${moment(o.endTime).format('HH:mm')}`
            const daytime = {
              day,
              time: timePeriods.find(t => t === time)
            }
            this.availableTimes.push(daytime)
          })
          this.timePeriods = timePeriods.sort()
          this.days = days
        })
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
    submit () {
      if (this.chosenTimes.length !== this.numberOfTime) {
        this.$message.warning(`Please choose ${this.numberOfTime} time periods`)
        return
      }
      const data = {
        ...this.$route.params,
        startTimes: this.chosenTimes.map(o => moment(`${o.day} ${o.time.substr(0, 5)}`).format()),
        endTimes: this.chosenTimes.map(o => moment(`${o.day} ${o.time.substr(-5)}`).format())
      }
      this.$confirm({
        title: 'Confirm your interview time',
        content: <div>{this.chosenTimes.map(o => <div>{o.day} {o.time}</div>)}</div>,
        onOk: () => axios.put('appointedTime', data).then(r => {
          this.alreadyDone = true
        })
      })
    },
    occupy (day, time) {
      this.chosenTimes = [{day, time}]
      const data = {
        interviewTime: moment(`${day} ${time.substr(0, 5)}`).format(),
        id: this.$route.params.assessmentId,
        operationId: this.$route.params['operationId']
      }
      this.$confirm({
        title: 'Confirm your interview time',
        content: `${day} ${time}`,
        onOk: () => axios.put(`assessment/${this.$route.params.assessmentId}/schedule`, data).then(r => {
          this.alreadyDone = true
        })
      })
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
