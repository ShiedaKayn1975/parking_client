import axios from "axios";
import Cookies from 'universal-cookie'
import config from 'config'

export const serviceAgent = axios.create({
  baseURL: config.apiUrl,
  timeout: 30000,
  headers: { 'Content-Type': 'application/vnd.api+json' }
})


serviceAgent.verify_token = ({ formData, onSuccess, onError }) => {
  serviceAgent.post(`/api/v1/verify_third_party_token`, formData, {
    headers: { 'Content-Type': 'application/json' }
  }).then(response => {
    if (onSuccess) {
      onSuccess(response)
    }
  }).catch(error => {
    if (onError) {
      onError(error)
    }
  })
}

serviceAgent.hasToken = () => {
  const cookie = new Cookies()
  if(cookie.get('token')){
    return true
  }

  return false
}

serviceAgent.loadTokenFromCookie = () => {
  const cookie = new Cookies()
  let token = cookie.get('token')
  if(token){
    serviceAgent.receiveAuthToken(token, false)
  }
}

serviceAgent.receiveAuthToken = (token, persist = true) => {
  serviceAgent.defaults.headers['Authorization'] = 'Bearer ' + token

  if(persist){
    const cookie = new Cookies()
    cookie.set('token', token, { path: '/'})
  }
}

serviceAgent.getResourcePath = (type, id, suffix) => {
  return '/api/v1/' + type + (id ? '/' + id : '') + (suffix ? '/' + suffix : '')
}

serviceAgent.loadTokenFromCookie()

export default serviceAgent