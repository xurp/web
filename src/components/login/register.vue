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
                  v-on:submit="handleRegister" :autoFormCreate="(form)=>{this.form=form}">
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
        </template>
      </a-tab-pane>
      <a-tab-pane key="hr">
        <span slot="tab">
          <a-icon type="usergroup-add"></a-icon>
          HR Register
        </span>
        <a-form layout="horizontal" class="register-form"
                v-on:submit="handleRegister" :autoFormCreate="(form)=>{this.form=form}">
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
                       fieldDecoratorId="companyname"
                       :fieldDecoratorOptions="{rules:[{required:true, message: 'please input your company name(must consistent with your law paper)!'}]}">
            <a-input v-model="hrRegForm.companyname"></a-input>
          </a-form-item>
          <a-form-item layout="horizontal"
                       :labelCol="formLabelCol"
                       :wrapperCol="formWrapCol"
                       label="LegalPerson"
                       fieldDecoratorId="legalperson"
                       :fieldDecoratorOptions="{rules:[{required:true, message: 'please input your company legal person name!'}]}">
            <a-input v-model="hrRegForm.legalperson"></a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" class="register-button" htmlType="submit">
              Register
            </a-button>
          </a-form-item>
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
      curTabKey: 'person',
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
        companyname: '',
        legalperson: ''
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
    compareToFirstPassword (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        const msg = 'Two passwords that you enter is inconsistent!'
        callback(msg)
      } else {
        callback()
      }
    },
    validateToNextPassword (rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    },
    handleRegister (e) {
      e.preventDefault()
      const data = {}
      let direct = '/'
      switch (this.tabKey) {
        case 'person':
          this.$set(data, 'role', 'hr')
          this.$set(data, 'email', this.personRegForm.email)
          this.$set(data, 'username', this.personRegForm.username)
          this.$set(data, 'password', this.personRegForm.password)
          break
        case 'hr':
          direct = '/black'
          this.$set(data, 'role', 'hr-n')
          this.$set(data, 'email', this.hrRegForm.email)
          this.$set(data, 'username', this.hrRegForm.username)
          this.$set(data, 'password', this.hrRegForm.password)
          this.$set(data, 'companyname', this.hrRegForm.companyname)
          this.$set(data, 'legalperson', this.hrRegForm.legalperson)
          break
      }
      axios.post('auth/register', data).then(tr => {
        localStorage.setItem('token', tr.token)
        this.$message.success('register success, redirecting...')
        this.$router.push(direct)
      }, error => {
        this.$message.error(error)
      })
    }
  }
}

</script>
<style lang="less">
.tabs-container{
  position: absolute;
  left: 0;
  right: 0;
  width: 680px;
  padding: 35px 35px 15px 35px;
  margin: 120px auto;
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
}
</style>
