import axios from 'axios'
import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? '/jobhere-api' : '/api'

axios.interceptors.request.use(config => {
  config.headers['Api-Token'] = localStorage.getItem('token')
  NProgress.start()
  return config
}, error => {
  NProgress.done()
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  NProgress.done()
  return response
}, error => {
  NProgress.done()
  const code = error.response.status
  const message = error.response.data.message
  if (code === 401) {
    if (!router.history.current.path.contains('login') && !router.history.current.path.contains('register')) {
      router.app.$message.error(message)
      router.push('/login')
    }
  } else if (code === 404) {
    // router.app.$message.error('Page Not Found.')
    // router.push('/')
    router.app.$message.error(message === 'No message available' ? 'Backend api not found' : message)
  } else {
    router.app.$message.error(message)
  }
  return Promise.reject(error)
})

export default axios
