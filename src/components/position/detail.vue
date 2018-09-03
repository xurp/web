<template>
  <div>
    <div>job detail</div>
    {{JSON.stringify(this.job)}}
    <a-divider/>
    <div>candidate list</div>
  </div>
</template>

<script>
import axios from '../../service'
export default {
  name: 'detail',
  data: () => ({
    job: null
  }),
  methods: {
    fetchData () {
      axios.get('job/' + this.$route.params.id).then(r => {
        this.job = r.data
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
