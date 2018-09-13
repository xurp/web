<template>
  <div>
    <a-steps>
      <span slot="progressDot" slot-scope="{index, status, prefixCls}">
        <a-popover v-if="index != steps.length -1">
          <template slot="content">
            <a v-if="index != 0" @click="deleteCurrent(index)">delete current</a>
            <a-divider v-if="index != 0" type="vertical"></a-divider>
            <a @click="insertAfter(index)">insert after</a>
          </template>
          <a-button type="primary" v-if="getIsEditing(index)" @click="confirmStep(index)">OK</a-button>
          <span v-else :class="`${prefixCls}-icon-dot`"></span>
        </a-popover>
        <span v-else :class="`${prefixCls}-icon-dot`"></span>
      </span>
      <a-step v-for="step in steps" :key="step.index">
        <span slot="title">
          <a-input v-if="step.isEditing" v-model="step.name" placeholder="input step name"></a-input>
          <span v-else>{{step.name}}</span>
        </span>
        <span slot="description">
          <a-textarea v-if="step.isEditing" v-model="step.description" placeholder="input step description(optional)"></a-textarea>
          <span v-else>{{step.description}}</span>
        </span>
      </a-step>
    </a-steps>
    <a-divider></a-divider>
    <div class="submit-container">
      <a-button type="primary" :loading="submitLoading" @click="submitStepChange">Submit Step Change</a-button>
    </div>
  </div>
</template>

<script>
import axios from '../../service'
export default {
  name: 'stepConfig',
  data: () => ({
    steps: [],
    jobId: '',
    editingIndex: 1,
    submitLoading: false
  }),
  created () {
    this.jobId = localStorage.getItem('jobId4Step')
    this.fetchStep()
    // this.steps = [
    //   {index: 0, name: 'Resume Filter', description: 'filter the resume'},
    //   {index: 1, name: 'Interview', description: 'assess the candidates'},
    //   {index: 3, name: 'Offer', description: 'send offer to candidates'}
    // ]
  },
  methods: {
    fetchStep () {
      axios.get('job/steps', {params: {jobId: this.jobId}}).then(response => {
        this.steps = response.data
      })
    },
    deleteCurrent (index) {
      this.steps.splice(index, 1)
    },
    insertAfter (index) {
      this.steps.splice(index + 1, 0, {index: 0, name: '', description: '', isEditing: true})
      this.steps = this.steps.map((tr, ind) => {
        return {
          index: ind,
          name: tr.name,
          description: tr.description,
          isEditing: tr.isEditing
        }
      })
    },
    getIsEditing (index) {
      return this.steps[index].isEditing
    },
    confirmStep (index) {
      this.steps[index].isEditing = false
    },
    submitStepChange () {
      this.submitLoading = true
      axios.put('job/steps', {jobId: this.jobId, steps: this.steps}).then(response => {
        this.fetchStep()
        this.submitLoading = false
      }, error => {
        this.submitLoading = false
        console.error(error)
      })
    }
  }
}
</script>

<style lang="less">
  .ant-steps-item-icon{
    .ant-btn{
      margin-left: -25px;
      margin-top: -35px;
    }
  }
  .ant-steps-label-vertical .ant-steps-item-content{
    margin-top: 25px !important;
    .ant-steps-item-title{
      color: rgba(0, 0, 0, 0.85);
      line-height: 1.5;
      font-weight: 500;
      font-size: 16px;
    }
    .ant-steps-item-description{
      margin-top: 8px;
    }
  }
  .submit-container{
    text-align: center;
  }
</style>
