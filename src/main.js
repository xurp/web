// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import axios from './service'
import VCharts from 'v-charts'

Vue.config.productionTip = false
Vue.use(Antd)

Vue.use(VCharts)

Vue.window = Vue.prototype.window = window

export const fetchUser = () => axios.get('auth').then(r => {
  window.user = r.data
  return r
}).catch(e => {
  router.push('/login')
  return e
})

window.user = {}
Vue.$fetchUser = Vue.prototype.$fetchUser = fetchUser

// eslint-disable-next-line
Array.prototype.unique = function () {
  return this.filter(o => o !== null)
    .filter(o => o !== undefined)
    .filter((o, i, arr) => arr.indexOf(o) === i)
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
