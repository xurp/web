import axios from 'axios'

axios.defaults.baseURL = '/api'

axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {
  // const code = error.response.status
  // const message = error.response.data.message
  return Promise.reject(error)
})

export default axios
