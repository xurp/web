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

export const fetchUser = () => axios.get('auth').then(r => {
  window.user = r.data
  return r
}).catch(error => {
  router.push('/login')
  console.log(error)
})

window.user = {}
Vue.$fetchUser = Vue.prototype.$fetchUser = fetchUser

Vue.$roleMap = Vue.prototype.$roleMap = {
  'hr': ['Position', 'Review'],
  'candidate': ['Resume', 'Apply'],
  'admin': ['Review']
}

const loadApp = async () => {
  try {
    await fetchUser()
  } catch (e) { }
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
  })
}

loadApp()
