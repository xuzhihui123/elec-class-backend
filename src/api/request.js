/*
 * @Author: Lancer
 * @Date:2019/12/12
 * @Last Modified by:   Lancer
 * @Last Modified time: 2019/12/12
 */
import  axios from 'axios'
export function request(config,token) {
  const instance  = axios.create({
     baseURL:'http://121.204.146.196:9999'
  })
  instance.interceptors.request.use(config=>{
    if(token){
      config.headers['token'] = token
    }
    return config
  },err=>{
    return Promise.reject(err)
  })

  instance.interceptors.response.use(res=>{
    return res.data
  },err=>{
    return Promise.reject(err)
  })
  return instance(config)
}



export function request1(config,token) {
  const instance  = axios.create({
     baseURL:'http://oa.qingmoukeji.com'
  })
  instance.interceptors.request.use(config=>{
    if(token){
      config.headers['token'] = token
    }
    return config
  },err=>{
    return Promise.reject(err)
  })

  instance.interceptors.response.use(res=>{
    return res.data
  },err=>{
    return Promise.reject(err)
  })
  return instance(config)
}

