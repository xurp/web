<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="16">
        <admin-dashboard v-if="window.user.role === 'admin'"/>
        <candidate-dashboard v-if="window.user.role === 'candidate'"/>
        <hr-dashboard v-if="window.user.role === 'hr'"/>
      </a-col>
      <a-col :span="8">
        <account-profile/>
        <company-profile v-if="window.user.role === 'hr'"/>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import AdminDashboard from './admin'
import CandidateDashboard from './candidate'
import HrDashboard from './hr'
import AccountProfile from './profile/account'
import CompanyProfile from './profile/company'
export default {
  name: 'dashboard',
  components: {
    CompanyProfile,
    AccountProfile,
    AdminDashboard,
    CandidateDashboard,
    HrDashboard
  }
}
</script>

<style scoped>
</style>
