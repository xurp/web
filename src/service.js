import axios from 'axios'
import router from './router'
// import Antd from 'ant-design-vue'
axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? '/jobhere-api' : '/api'

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
  if (code === 401) {
    if (!router.history.current.path.contains('login') && !router.history.current.path.contains('register')) {
      router.app.$message.error(message)
      router.push('/login')
    }
  } else if (code === 404) {
    router.app.$message.error('Page Not Found.')
    router.push('/')
  } else {
    router.app.$message.error(message)
  }
  return Promise.reject(error)
})

export default axios
