<template>
  <a-calendar class="schedule-calendar">
    <template slot="dateCellRender" slot-scope="value">
      <div
        v-for="(item, idx) in getScheduleList(value)" :key="idx"
        class="schedule-item"
      >
        <a-popover>
          <template v-if="item.assessment" slot="title">
            <div>
              <span>[{{item.assessment.pass.toUpperCase()}}]</span>
              <a-divider type="vertical"/>
              <strong>{{item.assessment.stepObj.name}}</strong>
            </div>
            <div>
              <strong>{{item.assessment.application.job.department}}</strong>
              <a-divider type="vertical"/>
              <strong>{{item.assessment.application.job.name}}</strong>
            </div>
          </template>
          <template v-if="item.assessment" slot="content">
            <div><strong>Interview Time</strong></div>
            <div>{{moment(item.assessment.interviewTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
            <div><strong>Assessment Time</strong></div>
            <div>{{moment(item.assessment.assessmentTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
          </template>
          <template v-if="item.appointment" slot="title">appointment</template>
          <template v-if="item.appointment" slot="content">appointment
          </template>
          <div>
            <a-badge
              :status="item.status"
              :text="item.time"
            />
          </div>
        </a-popover>
      </div>
    </template>
  </a-calendar>
</template>

<script>
import axios from '../../service'
import moment from 'moment'
export default {
  name: 'schedule-list',
  data () {
    return {
      moment,
      applications: [],
      assessments: [],
      appointments: []
    }
  },
  methods: {
    fetchApplications () {
      return axios.get('application/candidate').then(r => {
        this.applications = r.data
      })
    },
    fetchAssessments () {
      const compareStep = (step1, step2) => {
        step1 = (step1 + '').replace(/[+-]/g, '')
        step2 = (step2 + '').replace(/[+-]/g, '')
        return +step1 === +step2
      }
      axios.get('schedule/assessment').then(r => {
        this.assessments = r.data.map(o => {
          const application = this.applications.find(t => t.id === o.applicationId)
          return {
            ...o,
            application,
            stepObj: application.stepList.find(t => compareStep(t.index, o.step))
          }
        })
      })
    },
    fetchAppointedTimes () {
      // TODO: add schedules according to ddl
      // axios.get('schedule/appointment').then(r => {
      //   this.appointments = r.data
      // })
    },
    async fetchData () {
      await this.fetchApplications()
      this.fetchAssessments()
      this.fetchAppointedTimes()
    },
    getScheduleList (date) {
      const schedules = []
      for (const assessment of this.assessments) {
        if (date.format('YYYY-MM-DD') === moment(assessment.interviewTime).format('YYYY-MM-DD')) {
          const schedule = {
            status: 'default',
            time: moment(assessment.interviewTime).format('HH:mm:ss'),
            assessment
          }
          if (assessment.assessmentTime) {
            if (assessment.pass === 'pass') {
              schedule.status = 'success'
            } else {
              schedule.status = 'error'
            }
          } else {
            schedule.status = 'processing'
          }
          schedules.push(schedule)
        }
      }
      for (const appointment of this.appointments) {
        const schedule = {
          status: 'warning',
          time: moment(appointment.time).format('HH:mm:ss'),
          appointment
        }
        schedules.push(schedule)
      }
      return schedules
    },
    arrangeSchedule () {
      window.open(`${window.location.pathname}/#/schedule/candidate/operationId/assessmentId`)
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

<style lang="less">
  .schedule-calendar {
    .ant-fullcalendar-header {
      .ant-radio-group {
        display: none
      }
    }
    .ant-badge-status {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>
