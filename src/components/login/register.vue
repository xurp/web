<template>
  <div class="registerContainer">
    <a-tabs class="tabs-container" v-on:change="tabChanged">
      <a-tab-pane key="person">
        <span slot="tab">
          <a-icon type="user"></a-icon>
          Job Seeker Register
        </span>
        <template>
          <a-form layout="horizontal" class="register-form"
                  v-on:submit="handleRegister" :autoFormCreate="(form)=>{this.candidateForm=form}">
            <h3 class="title">Please Fill In Your Information</h3>
            <a-form-item layout="horizontal"
                         :labelCol="formLabelCol"
                         :wrapperCol="formWrapCol"
                         label="Username"
                         fieldDecoratorId="username"
                         :fieldDecoratorOptions="{rules:[{required:true, message: 'please input your username!'}]}">
              <a-input placeholder="Username" v-model="personRegForm.username">
              </a-input>
            </a-form-item>
            <a-form-item layout="horizontal"
                         :labelCol="formLabelCol"
                         :wrapperCol="formWrapCol"
                         label="Password"
                         fieldDecoratorId="password"
                         :fieldDecoratorOptions="{rules:[{required:true, message: 'please input your password!'},
                         {validator: this.validateToNextPassword}]}">
              <a-input type="password" placeholder="Password" v-on:blur="handleConfirmBlur">
                <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"></a-icon>
              </a-input>
            </a-form-item>
            <a-form-item layout="horizontal"
                         :labelCol="formLabelCol"
                         :wrapperCol="formWrapCol"
                         label="Confirm Password"
                         fieldDecoratorId="confirm"
                         v-on:blur="handleConfirmBlur"
                         :fieldDecoratorOptions="{rules:[{required:true, message: 'please confirm your password!'},
                         {validator: this.compareToFirstPassword}]}">
              <a-input type="password" placeholder="Password" v-model="personRegForm.password">
                <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"></a-icon>
              </a-input>
            </a-form-item>
            <a-form-item layout="horizontal"
                         :labelCol="formLabelCol"
                         :wrapperCol="formWrapCol"
                         label="E-mail"
                         fieldDecoratorId="email"
                         :fieldDecoratorOptions="{rules:[{required:true, message: 'please input your E-mail!'}]}">
              <a-input v-model="personRegForm.email"></a-input>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" class="register-button" htmlType="submit">
                Register
              </a-button>
            </a-form-item>
          </a-form>
          <div class="router-div">If you have an account, Please <router-link to="/login">log in</router-link></div>
        </template>
      </a-tab-pane>
      <a-tab-pane key="hr">
        <span slot="tab">
          <a-icon type="usergroup-add"></a-icon>
          HR Register
        </span>
        <a-form layout="horizontal" class="register-form"
                v-on:submit="handleRegister" :autoFormCreate="(form)=>{this.hrForm=form}">
          <h3 class="title">Please Fill In Your Information</h3>
          <a-form-item layout="horizontal"
                       :labelCol="formLabelCol"
                       :wrapperCol="formWrapCol"
                       label="Username"
                       fieldDecoratorId="username"
                       :fieldDecoratorOptions="{rules:[{required:true, message: 'please input your username!'}]}">
            <a-input placeholder="Username" v-model="hrRegForm.username">
            </a-input>
          </a-form-item>
          <a-form-item layout="horizontal"
                       :labelCol="formLabelCol"
                       :wrapperCol="formWrapCol"
                       label="Password"
                       fieldDecoratorId="password"
                       :fieldDecoratorOptions="{rules:[{required:true, message: 'please input your password!'},
                         {validator: this.validateToNextPassword}]}">
            <a-input type="password" placeholder="Password" v-on:blur="handleConfirmBlur">
              <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"></a-icon>
            </a-input>
          </a-form-item>
          <a-form-item layout="horizontal"
                       :labelCol="formLabelCol"
                       :wrapperCol="formWrapCol"
                       label="Confirm Password"
                       fieldDecoratorId="confirm"
                       v-on:blur="handleConfirmBlur"
                       :fieldDecoratorOptions="{rules:[{required:true, message: 'please confirm your password!'},
                         {validator: this.compareToFirstPassword}]}">
            <a-input type="password" placeholder="Password" v-model="hrRegForm.password">
              <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"></a-icon>
            </a-input>
          </a-form-item>
          <a-form-item layout="horizontal"
                       :labelCol="formLabelCol"
                       :wrapperCol="formWrapCol"
                       label="E-mail"
                       fieldDecoratorId="email"
                       :fieldDecoratorOptions="{rules:[{required:true, message: 'please input your E-mail!'}]}">
            <a-input v-model="hrRegForm.email"></a-input>
          </a-form-item>
          <a-form-item layout="horizontal"
                       :labelCol="formLabelCol"
                       :wrapperCol="formWrapCol"
                       label="CompanyName"
                       fieldDecoratorId="companyName"
                       :fieldDecoratorOptions="{rules:[{required:true, message: 'please input your company name(must consistent with your law paper)!'}]}">
            <a-input v-model="hrRegForm.companyName"></a-input>
          </a-form-item>
          <a-form-item layout="horizontal"
                       :labelCol="formLabelCol"
                       :wrapperCol="formWrapCol"
                       label="LegalPerson"
                       fieldDecoratorId="legalPerson"
                       :fieldDecoratorOptions="{rules:[{required:true, message: 'please input your company legal person name!'}]}">
            <a-input v-model="hrRegForm.legalPerson"></a-input>
          </a-form-item>
          <a-form-item>
            <div>
              <a-button type="primary" class="register-button" htmlType="submit">
                Register
              </a-button>
            </div>
          </a-form-item>
          <div class="router-div">If you have an account, Please <router-link to="/login">log in</router-link></div>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import AInput from 'ant-design-vue/es/input/Input'
import axios from '@/service'
export default{
  components: {AInput},
  data () {
    return {
      confirmPersonDirty: false,
      confirmHRDirty: false,
      confirmDirty: false,
      tabKey: 'person',
      formLabelCol: {xs: { span: 24 }, sm: { span: 8 }},
      formWrapCol: {xs: { span: 24 }, sm: { span: 16 }},
      personRegForm: {
        username: '',
        password: '',
        role: 'candidate',
        email: ''
      },
      hrRegForm: {
        username: '',
        password: '',
        role: 'hr',
        email: '',
        companyName: '',
        legalPerson: ''
      }
    }
  },
  methods: {
    tabChanged (activeKey) {
      switch (activeKey) {
        case 'person':
          this.confirmDirty = this.confirmPersonDirty
          break
        case 'hr':
          this.confirmDirty = this.confirmHRDirty
          break
      }
      this.tabKey = activeKey
    },
    handleConfirmBlur  (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
      switch (this.tabKey) {
        case 'person':
          this.confirmPersonDirty = this.confirmPersonDirty || !!value
          break
        case 'hr':
          this.confirmHRDirty = this.confirmHRDirty || !!value
          break
      }
      console.log(this)
    },
    getCurrentForm () {
      switch (this.tabKey) {
        case 'person':
          return this.candidateForm
        case 'hr':
          return this.hrForm
      }
    },
    compareToFirstPassword (rule, value, callback) {
      const form = this.getCurrentForm()
      if (value && value !== form.getFieldValue('password')) {
        const msg = 'Two passwords that you enter is inconsistent!'
        callback(msg)
      } else {
        callback()
      }
    },
    validateToNextPassword (rule, value, callback) {
      const form = this.getCurrentForm()
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    },
    handleRegister (e) {
      e.preventDefault()
      let data = {}
      let direct = '/'
      switch (this.tabKey) {
        case 'person':
          data = {
            ...this.personRegForm,
            role: 'candidate'
          }
          break
        case 'hr':
          direct = '/black'
          Object.assign(data, this.hrRegForm)
          data.role = 'hr-n'
          break
      }
      axios.post('auth/register', data).then(tr => {
        localStorage.setItem('token', tr.data.token)
        this.$fetchUser().then(r => {
          this.$message.success('register success, redirecting...')
          this.$router.push(direct)
        })
      }, error => {
        this.$message.error(error)
      })
    }
  }
}

</script>
<style lang="less">
.tabs-container{
  width: 680px;
  padding: 35px 35px 15px 35px !important;
  margin: 120px auto !important;
  .register-form{
    width: 100%;
  }
  .title{
    width: 100%;
    text-align: center;
    font-size: 26px;
    font-weight: 400;
    color: #ccc;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .register-button{
    width: 70%;
    margin-left: 25%;
  }
  .ant-tabs-nav-scroll{
    text-align: center;
  }
  .router-div{
    padding-left: 120px;
  }
}
</style>
