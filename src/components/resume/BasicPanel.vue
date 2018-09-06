<template>
  <div class="basicpanel">
    <a-card title="Basic Information" :loading="infloading" v-on:click="toggleCard" :bodyStyle="cardBodyStyle">
      <div class="card-title-float" v-on:click="toggleCard"></div>
      <div class="form-container" v-bind:hidden="toggleState">
        <a-form v-on:submit="handleSubmit">
          <a-form-item label="Name" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
            <a-input v-model="basicInfomation.name" placeholder="Name"/>
          </a-form-item>
          <a-form-item label="Gender" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
            <a-radio-group v-model="basicInfomation.gender">
              <a-radio :style="radioStyle" value="male">Male</a-radio>
              <a-radio :style="radioStyle" value="female">Female</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="Age" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
            <a-input-number v-model="basicInfomation.age" placeholder="Age"></a-input-number>
          </a-form-item>
          <a-form-item label="Email" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
            <a-input v-model="basicInfomation.email" placeholder="Email"></a-input>
          </a-form-item>
          <a-form-item label="School" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
            <a-input v-model="basicInfomation.school" placeholder="School"></a-input>
          </a-form-item>
          <a-form-item label="Major" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
            <a-input v-model="basicInfomation.major" placeholder="Major"></a-input>
          </a-form-item>
          <a-form-item label="Introduction" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
            <a-textarea v-model="basicInfomation.intro" :autosize="textAreaStyle" placeholder="Introduction"></a-textarea>
          </a-form-item>
          <a-form-item label="Open" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
            <a-switch v-model="basicInfomation.open" size="large"/>
          </a-form-item>
          <a-form-item>
            <a-button key="submit" class="submit-button" type="primary" v-on:click="handleSubmit">Save</a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-card>
  </div>
</template>

<script>
import axios from '../../service'
export default{
  name: 'basicpanel',
  data () {
    return {
      basicInfomation: {},
      radioStyle: {
        display: 'inline',
        height: '15px',
        lineHeight: '15px'
      },
      infloading: false,
      textAreaStyle: {
        minRows: 4,
        maxRows: 12
      },
      formLabelCol: {xs: { span: 24 }, sm: { span: 5 }},
      formWrapCol: {xs: { span: 24 }, sm: { span: 18 }},
      toggleState: false,
      cardBodyStyle: {
        padding: 0
      }
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    toggleState (newValue, oldValue) {
      this.cardBodyStyle = this.toggleState ? {padding: 0} : {padding: '15px 0 0 0'}
    }
  },
  methods: {
    toggleCard (e) {
      this.toggleState = !this.toggleState
    },
    fetchData () {
      this.infloading = true
      axios.request('resume/' + window.user.id).then(response => {
        this.basicInfomation = Object.assign({}, response.data)
        this.infloading = false
      }, error => {
        console.error(error)
        this.infloading = false
      })
    },
    handleSubmit (e) {
      console.log(e)
      this.infloading = true
      e.preventDefault()
      axios.put('resume/' + window.user.id, this.basicInfomation).then(response => {
        this.infloading = false
        this.$message.success('update success')
        this.fetchData()
      }, error => {
        console.error(error)
        this.infloading = false
      })
    }
  }
}
</script>

<style lang="less">
  .ant-form-item{
    margin-bottom: 5px;
  }
  .resumePanel-header{
    height: 8vh;
  }
  .card-title-float{
    width: 100%;
    right: 0;
    top: 0;
    background-color: rgba(255,255,255,0);
    height: 8vh;
    position: absolute;
  }
  .ant-card-body{
    padding: 0;
  }
  .submit-button{
    margin-left: 30%;
    width: 30%;
  }
</style>
