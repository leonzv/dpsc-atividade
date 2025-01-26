import axios from 'axios'

const api = axios.create({
  baseURL: 'http://mock-api'
})

export default api
