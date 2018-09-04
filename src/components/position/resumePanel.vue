<template>
  <div class="resume-container">
    <a-card title="Resume Information" v-on:click="toggleCard" :bodyStyle="cardBodyStyle">
      <div class="card-title-float" v-on:click="toggleCard"></div>
      <div class="form-container" v-bind:hidden="toggleState">
        <a-form >
          <a-col :span="8">
            <a-form-item label="Name" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
              <a-input :disabled="true" v-model="resumeData.name"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Gender" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
              <a-input :disabled="true" v-model="resumeData.gender"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Age" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
              <a-input :disabled="true" v-model="resumeData.age"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Email" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
              <a-input :disabled="true" v-model="resumeData.email"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="School" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
              <a-input :disabled="true" v-model="resumeData.school"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Major" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
              <a-input :disabled="true" v-model="resumeData.major"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="20">
            <a-form-item label="Introduction" :labelCol="{span: 2}" :wrapperCol="{span: 22}">
              <a-textarea :disabled="true" v-model="resumeData.intro" :autosize="textAreaStyle"></a-textarea>
            </a-form-item>
          </a-col>
        </a-form>
      </div>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'resume-panel',
  data () {
    return {
      formLabelCol: {
        span: 5
      },
      formWrapCol: {
        span: 18
      },
      textAreaStyle: {
        minRows: 2,
        maxRows: 6
      },
      toggleState: false,
      cardBodyStyle: {
        padding: 0
      }
    }
  },
  props: {
    resumeData: {
      name: '',
      gender: ''
    }
  },
  created () {
    this.cardBodyStyle = this.toggleState ? {padding: 0} : {padding: '15px 0 0 0'}
  },
  watch: {
    toggleState (newValue, oldValue) {
      this.cardBodyStyle = this.toggleState ? {padding: 0} : {padding: '15px 0 0 0'}
    }
  },
  methods: {
    toggleCard (e) {
      this.toggleState = !this.toggleState
    }
  }
}
</script>

<style scoped>
  .card-title-float{
    width: 100%;
    right: 0;
    top: 0;
    background-color: rgba(255,255,255,0);
    height: 8vh;
    position: absolute;
  }
</style>
