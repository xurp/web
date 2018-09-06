<template>
  <div>
    <admin-dashboard v-if="window.user.role === 'admin'"/>
    <candidate-dashboard v-if="window.user.role === 'candidate'"/>
    <hr-dashboard v-if="window.user.role === 'hr'"/>
  </div>
</template>

<script>
import AdminDashboard from './admin'
import CandidateDashboard from './candidate'
import HrDashboard from './hr'
export default {
  components: {
    AdminDashboard,
    CandidateDashboard,
    HrDashboard
  }
}
</script>

<style scoped>
</style>
