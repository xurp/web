<template>
  <div>
    <titled-panel title="Step Config">
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
    </titled-panel>
    <titled-panel title="Assessment item config">
      <a-steps class="bottom-step-cotainer">
        <a-step v-for="step in dbSteps" :key="step.index" :title="step.name" :status="getStepStatus(step)">
          <a-timeline slot="description" style="margin-top:10px;">
            <a-timeline-item v-for="item in step.items" :key="item.id">
              <a-tag v-if="!item.editing" closable @close="removeItem(step, item)">{{item.name}}</a-tag>
              <a-input v-else v-model="item.name" @pressEnter="item.editing=false" placeholder="press enter to confirm"></a-input>
            </a-timeline-item>
            <a-button class="additem-button" type="dashed" @click="addItem(step)">
              <a-icon type="plus"></a-icon>Add
            </a-button>
          </a-timeline>
        </a-step>
      </a-steps>
      <div class="itemform-container">
        <a-form>
          <a-form-item v-for="(item, idx) in curItems" :key="idx" :wrapperCol="itemFormWrapperCol">
            <span v-if="!item.editing" class="itemname-span">{{item.name}}</span>
            <span v-else>
              <a-input class="item-input" v-model="item.name"></a-input>
              <a-icon type="check-circle-o" class="dynamic-delete-button" @click="okItem(idx)"></a-icon>
            </span>
            <a-icon type="minus-circle-o" class='dynamic-delete-button' @click="removeItem(idx)"></a-icon>
          </a-form-item>
          <a-form-item>

          </a-form-item>
        </a-form>
      </div>
      <div class="submit-container">
        <a-button type="primary" :loading="submitLoading" @click="submitItemChange">Save</a-button>
      </div>
    </titled-panel>
  </div>
</template>

<script>
import axios from '../../service'
import titledPanel from '../subComponent/titledCard'
import uuid from 'uuid'
export default {
  name: 'stepConfig',
  components: {titledPanel},
  data: () => ({
    steps: [],
    jobId: '',
    editingIndex: 1,
    submitLoading: false,
    clickIndex: 0,
    dbSteps: [],
    curItems: [],
    itemFormWrapperCol: {
      span: 18,
      offset: 3
    }
  }),
  created () {
    this.jobId = this.$route.params['id']
    this.fetchStep()
  },
  methods: {
    fetchStep () {
      axios.get('job/steps', {params: {jobId: this.jobId}}).then(response => {
        this.steps = response.data
        this.dbSteps = response.data.map(tr => {
          return Object.assign({}, tr)
        })
        this.fetchItems()
      })
    },
    fetchItems () {
      for (const step of this.dbSteps) {
        axios.get('job/items', {params: {stepId: step.id}}).then(response => {
          step.items = response.data.map(tr => {
            return {
              id: tr.id,
              name: tr.name,
              editing: false
            }
          })
        })
      }
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
      axios.put('job/steps', {id: this.jobId, step: this.steps}).then(response => {
        this.fetchStep()
        this.submitLoading = false
        this.$message.success('Steps saved successfully.')
      }, error => {
        this.submitLoading = false
        console.error(error)
      })
    },
    getStepStatus (step) {
      const curIndex = this.steps.findIndex(tr => {
        return tr.index === step.index
      })
      return this.clickIndex === curIndex ? 'process' : 'wait'
    },
    submitItemChange () {
      this.submitLoading = true
      let totalCount = this.dbSteps.length
      for (const step of this.dbSteps) {
        axios.put('/job/items', {itemList: step.items.map(o => { return {id: o.id, name: o.name} }),
          stepId: step.id,
          jobId: this.$route.params['id']
        }).then(response => {
          totalCount--
          if (totalCount === 0) {
            this.submitLoading = false
            this.$message.success('saved successfully')
          }
        })
      }
    },
    fetchCurItem () {
      axios.get('job/items', {params: {stepId: this.dbSteps[this.clickIndex].id}}).then(response => {
        this.curItems = response.data.map(tr => {
          return {
            id: tr.id,
            name: tr.name,
            editing: false
          }
        })
      })
    },
    addItem (step) {
      if (step.items.find(o => o.editing) !== undefined) {
        return
      }
      step.items.push({name: '', editing: true, id: uuid('http://localhost:4000/assessment/?', uuid.URL)})
    },
    removeItem (step, item) {
      const idx = step.items.findIndex(o => o.id === item.id)
      step.items.splice(idx, 1)
    },
    okItem (idx) {
      const oldItem = this.curItems[idx]
      oldItem.editing = false
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
    padding-bottom: 20px;
  }
  .bottom-step-cotainer{
    padding: 20px 40px;
  }
  .itemform-container{
    text-align:center;
    .additem-button{
      width: 40vh;
    }
    size: 18px;
  }
  .dynamic-delete-button {
    cursor: pointer;
    position: relative;
    top: 4px;
    font-size: 24px;
    color: #999;
    transition: all .3s;
  }
  .dynamic-delete-button:hover {
    color: #777;
  }
  .dynamic-delete-button[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .item-input{
    width: 60%;
    margin-right:8px;
  }
  .itemname-span{
    margin-right: 28px
  }
</style>
