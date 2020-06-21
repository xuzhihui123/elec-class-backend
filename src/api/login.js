/*
 * @Author: Lancer
 * @Date:2020/6/11
 * @Last Modified by:   Lancer
 * @Last Modified time: 2020/6/11
 */

import {request1} from "@/api/request";

import Qs from 'qs'

//登录接口
export function login(params) {
    return request1({
      method:'get',
      url:'/login/kylogin',
      params
    })
}
