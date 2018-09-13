<template>
  <div>
    <a-card
      v-for="invitation in invitations" :key="invitation.id"
      style="margin-bottom: 16px"
    >
      <a-row type="flex" align="middle">
        <a-col :span="20">
          <div style="color: gray; float: right">Invitation sent at {{invitation.inviteTime}}</div>
          <div style="font-size: 1.3em">{{invitation.job.name}}</div>
          <div style="color: gray">
            <span>{{invitation.job.company.companyName}}</span>
            <a-divider type="vertical"/>
            <span>{{invitation.job.department}}</span>
            <a-divider type="vertical"/>
            <span>{{invitation.job.name}}</span>
          </div>
          <a-divider/>
          <div style="color: darkgray">{{invitation.job.detail}}</div>
        </a-col>
        <a-col :span="4">
          <div align="right">
            <template v-if="invitation.applied === true">
              <span style="color: gray">Applied</span>
            </template>
            <template v-else-if="invitation.applied === false">
              <a @click="apply(invitation)">Apply</a>
            </template>
            <template v-else>
              <span style="color: gray">Applying</span>
            </template>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import axios from '../../service'
import moment from 'moment'
export default {
  name: 'invitation-list',
  data () {
    return {
      invitations: [],
      jobs: [],
      applications: []
    }
  },
  methods: {
    async fetchData () {
      await this.fetchJobs()
      await this.fetchApplications()
      this.fetchInvitations()
    },
    fetchInvitations () {
      axios.get('invitation').then(r => {
        this.invitations = r.data.map(o => ({
          ...o,
          inviteTime: moment(o.inviteTime).format('YYYY-MM-DD HH:mm:ss'),
          job: this.jobs.find(t => t.id === o.jobId),
          applied: this.applications.findIndex(t => t.job.id === o.jobId) !== -1
        }))
      })
    },
    fetchJobs () {
      return axios.get('job').then(r => {
        this.jobs = r.data
      })
    },
    fetchApplications () {
      return axios.get('application/candidate').then(r => {
        this.applications = r.data
      })
    },
    apply (invitation) {
      invitation.applied = null
      axios.post('application', invitation.job.id).then(r => {
        this.$message.success('Apply Succeed!')
        this.fetchData()
      })
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

<style scoped>

</style>
