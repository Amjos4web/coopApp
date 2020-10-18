export default {
  state: {
    unionName: 'Ogbomoso Oluwalose C.I.C.U Ltd',
    currentUser: 'Amjos',
    access_token: '',
    isLoggedIn: false,
    loading: false,
    auth_error: false
  },
  getters: {
    unionName(state){
      return state.unionName;
    },
    isLoading(state){
      return state.loading
    },
    isLoggedIn(state){
      return state.isLoggedIn
    },
    currentUser(state){
      return state.currentUser
    },
    auth_error(state){
      return state.auth_error
    }
  },
  mutations: {
    login(state){
      state.loading = true;
      state.auth_error = null;
    },
    loginSuccess(state, payload){
      state.auth_error = null;
      state.loading = false;
      state.isLoggedIn = true;
      state.currentUser = Object.assign({}, payload.user, {token: payload.access_token});
    },
    loginFailed(state, payload){
      state.loading = false,
      state.auth_error = payload.error;
    },
    logout(state){
      state.currentUser = null;
      state.isLoggedIn = false;
    }
  },
  actions: {
    login(context){
      context.commit('login');
    }
  }
};