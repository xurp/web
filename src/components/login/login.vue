<template>
  <a-form v-on:submit="handleLogin" :autoFormCreate="(form)=>{this.form=form}" class="login-form">
    <h3 class="title">Please Login</h3>
    <a-form-item fieldDecoratorId="username"
                 :fieldDecoratorOptions="{rules:[{required:true, message: 'please input your username!'}]}">
      <a-input placeholder="Username" v-model="loginForm.username">
        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)"></a-icon>
      </a-input>
    </a-form-item>
    <a-form-item fieldDecoratorId="password"
                 :fieldDecoratorOptions="{rules:[{required:true, message: 'please input your password!'}]}">
      <a-input :type="pwdType" placeholder="Password" v-model="loginForm.password">
        <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"></a-icon>
        <a-icon slot="suffix" type="eye" v-on:click="showPwd" style="color:rgba(0,0,0,.25)"></a-icon>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" class="login-form-button" htmlType="submit">
        Log in
      </a-button>
      Or <a href="">register now!</a>
    </a-form-item>
  </a-form>
</template>

<script>
import axios from '@/service'

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}
export default{
  name: 'login',
  data () {
    return {
      hasErrors,
      form: null,
      loginForm: {
        username: '',
        password: ''
      },
      pwdType: 'password',
      formLayout: 'horizontal'
    }
  },
  methods: {
    handleLogin (e) {
      e.preventDefault()
      console.log(this.loginForm)
      axios.post('auth', this.loginForm).then(tr => {
        localStorage.setItem('token', tr.data.token)
        axios.get('auth', tr.data.token).then(r => {
          if (r.data.role === 'hr-n') {
            this.$router.push('/black')
          } else {
            this.$router.push('/')
          }
        })
      }, err => {
        console.log(err)
      })
    },
    showPwd () {
      this.pwdType = this.pwdType === 'password' ? '' : 'password'
    }
  }
}
</script>
<style lang="less">
  .login-form{
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
    .a-form-item{
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
      height: 47px;
      display: inline;
      input{
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: #eee;
        height: 47px;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px #2d3a4b inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }
    .login-form-button{
      width: 100%;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: #ccc;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
</style>
