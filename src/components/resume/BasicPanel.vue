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
          <a-form-item label="Phone" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
            <a-input v-model="basicInfomation.phone" placeholder="Phone"></a-input>
          </a-form-item>
          <a-form-item label="School" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
            <a-input v-model="basicInfomation.school" placeholder="School"></a-input>
          </a-form-item>
          <a-form-item label="Major" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
            <a-input v-model="basicInfomation.major" placeholder="Major"></a-input>
          </a-form-item>
          <a-form-item label="Degree" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
            <a-radio-group v-model="basicInfomation.degree">
              <a-radio value="Doctor">Doctor</a-radio>
              <a-radio value="Master">Master</a-radio>
              <a-radio value="Bachelor">Bachelor</a-radio>
              <a-radio defaultChecked>None</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="Introduction" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
            <a-textarea v-model="basicInfomation.intro" :autosize="textAreaStyle" placeholder="Introduction"></a-textarea>
          </a-form-item>
          <a-form-item label="Graduated Date" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
            <a-date-picker v-model="basicInfomation.graduation"/>
          </a-form-item>
          <a-form-item label="Work Experience" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
            <a-input-number v-model="basicInfomation.experience"/>
            <span>Years</span>
          </a-form-item>
          <a-form-item label="Expected Salary" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
            <a-slider
              range
              :marks="salaryRangeMarks"
              v-model="basicInfomation.salaryRange"
            />
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
import moment from 'moment'
export default{
  name: 'basicpanel',
  data () {
    return {
      basicInfomation: {
        salaryRange: []
      },
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
  computed: {
    salaryRangeMarks () {
      const range = this.basicInfomation.salaryRange
      return {
        0: '0',
        [range[0]]: range[0] + 'k',
        [range[1]]: range[1] + 'k',
        100: '100k'
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
        const salary = response.data.salary
        let salaryRange = [8, 20]
        if (salary) {
          salaryRange = [parseInt(salary / 1000), salary % 1000]
        }
        this.basicInfomation = {
          ...response.data,
          salaryRange,
          graduation: moment(response.data.graduation)
        }
        this.infloading = false
      }, error => {
        console.error(error)
        this.infloading = false
      })
    },
    handleSubmit (e) {
      this.infloading = true
      e.preventDefault()
      const data = {
        ...this.basicInfomation,
        salary: this.basicInfomation.salaryRange[0] * 1000 + this.basicInfomation.salaryRange[1]
      }
      axios.put('resume/' + window.user.id, data).then(response => {
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
