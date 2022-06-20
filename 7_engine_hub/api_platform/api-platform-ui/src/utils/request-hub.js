import axios from 'axios'
import { Message } from 'element-ui'
// import { BaseURL } from '../../public/config'

// create an axios instance
const baseURL = process.env.VUE_APP_BASE_API
const service = axios.create({
  baseURL: baseURL,
  // baseURL: process.env.VUE_APP_BASE_API // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Boolean} json [true：json格式请求头；false：FormData格式请求头]
 */
function post(url, params = {}, json = false) {
  // json格式请求头
  const headerJSON = {
    'Content-Type': 'application/json'
  }
  // FormData格式请求头
  const headerFormData = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
  return new Promise((resolve, reject) => {
    axios
      .post(url, json ? JSON.stringify(params) : JSON.stringify(params), {
        headers: json ? headerJSON : headerFormData
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    if (res.status !== '000') {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res.msg || 'Error')
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
