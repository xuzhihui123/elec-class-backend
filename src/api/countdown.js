import {
  request
} from "@/api/request";

import Qs from 'qs'


//添加倒计数  GET /initCountDown
export function initCountDown(params) {
 return request({
   method:'get',
   url:'/initCountDown',
   params
 })
}

//获取倒计数天数
export function getCountDown(id) {
  return request({
    method:'get',
    url:'/getCountDown',
    params:{
      id
    }
  })
 }