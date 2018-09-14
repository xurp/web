<template>
  <div>
    <a-input-search v-model="queryStr" @search="fetchResumes"></a-input-search>
    <a-list :dataSource="resumes" itemLayout="vertical">
      <a-list-item slot="renderItem" slot-scope="resume, index" key="index">
        <a-list-item-meta>
          <span slot="title">{{resume.name}}</span>
          <span slot="description">
            <a-icon :type="{male: 'man', female: 'woman'}[resume.gender]"/>
            <span>{{resume.age}}</span>
            <a-divider type="vertical"/>
            <span>{{resume.email}}</span>
            <a-divider type="vertical"/>
            <span>{{resume.school}}</span>
            <a-divider type="vertical"/>
            <span>{{resume.major}}</span>
          </span>
        </a-list-item-meta>
        <div>{{resume.intro}}</div>
        <div
          v-if="isInvited(resume)"
          slot="actions"
        >
          <a-icon type="check-circle-o"/>
          <span>Already invited</span>
          <strong>{{invitedToJob(resume).department}} / {{invitedToJob(resume).name}}</strong>
        </div>
        <div
          v-else
          slot="actions"
          @click="openApplication(resume)"
        >
          <span>Interested in this resume?</span>
          <a>Invite</a>
          <span>him to interview!</span>
        </div>
      </a-list-item>
    </a-list>
    <a-modal
      v-if="!!invite.resume"
      :title="`Invite ${invite.resume.name} to apply job`"
      :visible="!!invite.resume"
      @ok="confirmApplication"
      @cancel="closeApplication"
      :confirmLoading="inviting"
    >
      <a-select
        showSearch
        placeholder="Search & Select a job"
        optionFilterProp="children"
        style="width: 200px"
        @change="chooseJob"
      >
        <a-select-option
          v-for="(job, idx) in jobs" :key="idx"
          :value="job.id"
        >
          <div style="font-size: 0.9em; color: gray; float: right">{{job.company.name}}</div>
          <div>{{job.name}}</div>
        </a-select-option>
      </a-select>
    </a-modal>
  </div>
</template>

<script>
import axios from '../../service'
export default {
  name: 'resume-list',
  data () {
    return {
      resumes: [],
      invitations: [],
      jobs: [],
      invite: {
        resume: null,
        job: null
      },
      inviting: false,
      queryStr: ''
    }
  },
  computed: {
    isInvited () {
      return resume => {
        return this.invitations.findIndex(o => o.userId === resume.userId) !== -1
      }
    },
    invitedToJob () {
      return resume => {
        const invitation = this.invitations.find(o => o.userId === resume.userId)
        return this.jobs.find(o => o.id === invitation.jobId) || {}
      }
    }
  },
  methods: {
    fetchResumes () {
      axios.get('resume', {params: {keyword: this.queryStr}}).then(r => {
        this.resumes = r.data
      })
    },
    fetchInvitations () {
      axios.get('invitation').then(r => {
        this.invitations = r.data
      })
    },
    fetchJobs () {
      axios.get('job').then(r => {
        this.jobs = r.data
      })
    },
    chooseJob (jobId) {
      this.invite.job = this.jobs.find(o => o.id === jobId)
    },
    openApplication (resume) {
      this.invite.resume = resume
      this.invite.job = null
    },
    closeApplication () {
      this.invite.resume = null
      this.invite.job = null
    },
    confirmApplication () {
      this.inviting = true
      const q = new URLSearchParams()
      q.set('resumeId', this.invite.resume.id)
      q.set('jobId', this.invite.job.id)
      axios.post('invitation?' + q.toString()).then(r => {
        this.inviting = false
        this.invite.resume = null
        this.invite.job = null
        this.$message.success('Invitation sent!')
        this.fetchInvitations()
      }).catch(e => {
        this.inviting = false
      })
    }
  },
  created () {
    this.fetchResumes()
    this.fetchInvitations()
    this.fetchJobs()
  }
}
</script>

<style scoped>
</style>