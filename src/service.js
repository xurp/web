import axios from 'axios'
import router from './router'
// import Antd from 'ant-design-vue'
axios.defaults.baseURL = '/api'

axios.interceptors.request.use(config => {
  config.headers['Api-Token'] = localStorage.getItem('token')
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {
  const code = error.response.status
  const message = error.response.data.message
  // TODO 错误统一提示
  if (code === 401) {
    router.push('/')
  }
  router.app.$message.error(message)
  return Promise.reject(error)
})

export default axios
