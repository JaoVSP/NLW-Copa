import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://expohost:3333',
})
