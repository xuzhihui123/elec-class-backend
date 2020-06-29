import router, {
  resetRouter
} from '@/router'

const state = {
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let data = {}
        let c = localStorage.getItem('Sn')
        if (c) {
          data.roles = ['super_admin']
        } else {
          data.roles = []
        }
        commit('SET_ROLES', data.roles)
        resolve(data)
      }, 200)
    }).catch(error => {
      reject(error)
    })
  },


}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
