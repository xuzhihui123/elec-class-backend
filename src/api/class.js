/*
 * @Author: Lancer
 * @Date:2020/6/11
 * @Last Modified by:   Lancer
 * @Last Modified time: 2020/6/11
 */

import {request} from "@/api/request";

import Qs from 'qs'


// GET /getBpClassesByClassCode

export function getBpClass(classCode) {
  return request({
    method: 'get',
    url: '/getBpClassesByClassCode',
    params: {
      classCode
    }
  })
}


//编辑班牌分类GET /updateBpClass
export function updateBpClass(params) {
  return request({
    method: 'get',
    url: '/updateBpClass',
    params
  })
}

//根据typeId 获取 班级分类单条信息

export function getBpClassByTypeId(typeId) {
  return request({
    method: 'get',
    url: '/getBpClassByTypeId',
    params: {
      typeId
    }
  })
}


//查询班牌内容GET /selectContent
export function selectContent(params) {
  return request({
    method: 'get',
    url: '/selectContent',
    params
  })
}

//删除 GET /removeBpContent 班排内容
export function removeBpContent(id) {
  return request({
    method: 'get',
    url: '/removeBpContent',
    params: {
      id
    }
  })
}

//插入班牌内容 GET /insertBpContent

export function insertBpContent(params) {
  return request({
    method: 'get',
    url: '/insertBpContent',
    params
  })
}

// GET /getContentById  根据id获取班牌内容
export function getContentById(id) {
  return request({
    method: 'get',
    url: '/getContentById',
    params:{
      id
    }
  })
}

//更新班牌 GET /updateBpContent
export function updateBpContent(params) {
  return request({
    method: 'get',
    url: '/updateBpContent',
    params
  })
}



//上传文件
export function upload(data) {
  return request({
    method: 'post',
    url: '/upload',
    data,
    headers:{
      'content-type':'multipart/form-data'
    }
  })
}
