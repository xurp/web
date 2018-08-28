<template>
  <a-form @submit="handleLogin" :autoFormCreate="(form)=>{this.form = loginForm}">
    <a-form-item
      label='Username'
      :labelCol="{ span: 5 }"
      :wrapperCol="{ span: 12 }"
      fieldDecoratorId="username"
      :fieldDecoratorOptions="{rules: [{ required: true, message: 'Please input your username!' }]}">
      <a-input v-model="loginForm.username" />
    </a-form-item>
    <a-form-item
      label='Password'
      :labelCol="{ span: 5 }"
      :wrapperCol="{ span: 12 }"
      fieldDecoratorId="password"
      :fieldDecoratorOptions="{rules: [{ required: true, message: 'Please input your Password!' }]}">
      <a-input type='password' v-model="loginForm.password" placeholder='Password'>
        <a-icon slot="prefix" type='lock' style="color:rgba(0,0,0,.25)"/>
      </a-input>
    </a-form-item>
    <a-button type='primary' htmlType='submit'>
      Submit
    </a-button>
  </a-form>
</template>

<script>
import axios from '@/service'
export default{
  name: 'login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    userNameError () {
      const { getFieldError, isFieldTouched } = this.form
      return isFieldTouched('userName') && getFieldError('userName')
    },
    handleLogin (e) {
      e.preventDefault()
      axios.post('auth', this.loginForm).then(tr => {
        localStorage.setItem('token', tr.token)
        this.$router.push('/')
      }, err => {
        console.log(err)
      })
    }
  }
}
</script>
