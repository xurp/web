<template>
  <div class="single-progress-container">
    <titledCard :title="title">
      <div style="padding: 0 25px">
        <a-steps :current="getStepIndex()">
          <a-step v-for="curstep in steps" :key="curstep.index" :title="curstep.name" :status="getStepStatus(curstep)">
            <a-icon v-if="getIfIcon(curstep)" type="loading" slot="icon"/>
          </a-step>
        </a-steps>
        <a-divider></a-divider>
      </div>
    </titledCard>
  </div>
</template>

<script>
import titledCard from '../application/titledCard'
export default {
  name: 'singleApplicationProgress',
  components: {titledCard},
  props: {
    title: {
      type: String
    },
    steps: {
      type: Array
    },
    curStep: {
      type: String
    }
  },
  methods: {
    getStepIndex () {
      return this.steps.findIndex(tr => {
        return parseFloat(tr.index) === parseFloat(this.curStep.replace('+', '').replace('-', '').replace('+', '').replace('-', ''))
      })
    },
    getIfIcon (curStep) {
      const stepNum = parseFloat(this.curStep.replace('+', '').replace('-', '').replace('+', '').replace('-', ''))
      if (curStep.index === stepNum && this.curStep.indexOf('+') === -1 && this.curStep.indexOf('-') === -1) {
        return true
      } else {
        return false
      }
    },
    getStepStatus (curStep) {
      const stepNum = parseFloat(this.curStep.replace('+', '').replace('-', '').replace('+', '').replace('-', ''))
      if (curStep.index === stepNum) {
        if (this.curStep.indexOf('+') > -1) {
          return 'finish'
        } else if (this.curStep.indexOf('-') > -1) {
          return 'error'
        } else {
          return 'process'
        }
      } else if (curStep.index < stepNum) {
        return 'finish'
      } else {
        return 'wait'
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
