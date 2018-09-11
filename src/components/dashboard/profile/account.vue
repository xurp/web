<template>
  <a-card title="Account Profile" style="margin-bottom: 16px">
    <a-tag slot="extra" color="blue">{{window.user.role}}</a-tag>
    <div align="center" style="font-size: 24px">{{window.user.username}}</div>
    <div align="center">{{window.user.email}}</div>
    <a-divider/>
    <div align="center">
      <a-button type="danger" @click="logout">Safely Sign Out</a-button>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'account-profile',
  methods: {
    logout () {
      localStorage.removeItem('token')
      window.user = {}
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
</style>
