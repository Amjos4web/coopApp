import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import Routes from './routes'
import VueAxios from 'vue-axios'
import axios from 'axios'
import Toaster from 'v-toaster'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import storeData from './store/index.js'
import 'nprogress/nprogress.css'
import 'v-toaster/dist/v-toaster.css'

Vue.use(Toaster, {timeout: 2000})
Vue.config.productionTip = false
Vue.use(VueRouter)

Vue.use(Vuex);

const router = new VueRouter({
  routes: Routes,
  mode: 'history'
})

const store = new Vuex.Store(storeData)

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name){
      // Start the route progress bar.
      NProgress.start()
  }
  next();
})

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  NProgress.done();
})

// router.beforeEach((to, from, next) => {
//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
//   const currentUser = store.state.currentUser;
  
//   if (requiresAuth && !currentUser){
    
//     next('/login');
//   } else if (to.path == '/home' && currentUser){
//     next('/home');
//   } else {
//     next();
//   }
// })


new Vue({
  el: '#app',
  router:router,
  store,
  render: h => h(App),
}).$mount('#app')
