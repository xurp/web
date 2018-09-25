<template>
  <titledCard v-bind:title="'Resume Information'">
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
      <a-col :span="8">
        <a-form-item label="Phone" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
          <a-input :disabled="true" v-model="resumeData.phone"></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="Degree" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
          <a-input :disabled="true" v-model="resumeData.degree"></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="Graduate" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
          <a-input :disabled="true" v-model="resumeData.graduation"></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="Experience" :labelCol="formLabelCol" :wrapperCol="formWrapCol">
          <a-input :disabled="true" v-model="resumeData.experience"></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="16">
        <a-form-item label="Introduction" :labelCol="{span: 3}" :wrapperCol="{span: 20}">
          <a-textarea :disabled="true" v-model="resumeData.intro" :autosize="textAreaStyle"></a-textarea>
        </a-form-item>
      </a-col>
    </a-form>
  </titledCard>
</template>

<script>
import titledCard from './titledCard'
import moment from 'moment'
export default {
  name: 'resume-panel',
  components: {titledCard},
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
  watch: {
    resumeData (oldVal, newVal){
      this.resumeData.graduation = moment(this.resumeData.graduation).format('YYYY-MM-DD')
    }
  }
}
</script>
<style scoped lang="less">
  .ant-input-disabled{
    background-color: #fefefe;
    color: #101010;
    opacity: 1;
    cursor: not-allowed;
    border-style: dotted;
  }
</style>
