import { apis } from '@/apis'

export const state = () => ({
  user: {},
})

export const mutations = {
  SET_USER(state, payload) {
    state.user = payload
  },
}

export const actions = {
  async fetchUser({ commit }) {
    const data = await apis.ferry.getUser({ params: { id: 1 } }).json()
    commit('SET_USER', data)
  },
  async createUser({ commit }, payload) {
    const data = await apis.ferry.createUser(payload).json()
    commit('SET_USER', data)
  },
}
