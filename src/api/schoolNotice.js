import {request} from "@/api/request";

import Qs from 'qs'

//GET /insertSchoolNotice

export function insertSchoolNotice(params) {
  return request({
    method: 'post',
    url: '/insertSchoolNotice',
    params
  })
}


//获取学校公告列表  GET /getNoticeList
export function getNoticeList(params) {
  return request({
    method: 'get',
    url: '/getNoticeList',
    params
  })
}

//更新公告 GET /updateSchoolNotice
export function updateSchoolNotice(params) {
  return request({
    method: 'post',
    url: '/updateSchoolNotice',
    params
  })
}

//移除公告GET /removeSchoolNotice
export function removeSchoolNotice(noticeId) {
  return request({
    method: 'get',
    url: '/removeSchoolNotice',
    params:{
      noticeId
    }
  })
}

//根据id获取公告 GET /getNoticeById

export function getNoticeById(noticeId) {
  return request({
    method: 'get',
    url: '/getNoticeById',
    params:{
      noticeId
    }
  })
}