import {request} from "@/api/request";

import Qs from 'qs'

//获取课程表
// GET /getTimeTable
export function getTimeTable(classCode) {
  return request({
    method:'get',
    url:'/getTimeTable',
    params:{
      classCode
    }
  })
}


//插入课程表  POST /insertCourse
export function insertCourse(data) {
  return request({
    method:'post',
    url:'/insertCourse',
    data
  })
}