<template>
  <div class="progress-container">
    <singleProgress v-for="app in applications" :key="app.id" :title="app.job.name"
                               :steps="app.stepList" :curStep="app.step">
    </singleProgress>
  </div>
</template>

<script>
import axios from '../../service'
import singleProgress from './singleAppProgressComponent'

export default {
  name: 'list',
  components: {singleProgress},
  data () {
    return {
      applications: []
    }
  },
  created () {
    this.fetchAppList()
  },
  methods: {
    fetchAppList () {
      axios.get('application/candidate').then(response => {
        console.log(response.data)
        this.applications = response.data
      })
    }
  }
}
</script>

<style scoped>

</style>
