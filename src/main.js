// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import axios from './service'

Vue.config.productionTip = false
Vue.use(Antd)

Vue.window = Vue.prototype.window = window

window.user = {}
Vue.$fetchUser = Vue.prototype.$fetchUser = () => axios.get('auth').then(r => {
  window.user = r.data
  return r
})
Vue.$roleMap = Vue.prototype.$roleMap = {
  'hr': ['Position'],
  'candidate': ['Resume'],
  'admin': ['Review']
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
