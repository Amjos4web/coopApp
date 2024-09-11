import Vue from 'vue'
import App from './App.vue'
import Routes from './routes'
import Toaster from 'v-toaster'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import 'v-toaster/dist/v-toaster.css'
import store from "./store";

Vue.use(Toaster, {timeout: 2000})
Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Vuex)


const router = new VueRouter({
  routes: Routes,
  mode: 'history'
})


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

router.beforeEach((to, from, next) => {
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isLoggedIn = store.getters['app/auth/isLogged'];

  console.log({requiresAuth, isLoggedIn});

  if(requiresAuth && !isLoggedIn){  
    //check if client already logged in but due to page reload
    //or page accidental closing, as long as user session is not
    //expired, client should be able to continue using app without re-logging
    store._actions['app/auth/getSelf'][0]()
    .then((self)=>{
      if(!self){
        const redirectPath = to.path//from && from.path !== "/login" ? from.path : '/';
        return next(`/login?r=${redirectPath}`);
      }
      else if(self){
        //console.log(to);
        //continue to path no need to wait
        next(to.path);
      }
    });
  } 
  else if(to.path == '/login' && isLoggedIn){
    next("/")
  }
  else if(to.path == "/Logout" && isLoggedIn){
    store._actions['app/auth/logout'][0]()
    .then((self)=>{
      if(!self){
        //const redirectPath = to.path//from && from.path !== "/login" ? from.path : '/';
        //return next(`/login?r=${redirectPath}`);
        next("/")
      }
      else{
        //console.log(to);
        //continue to path no need to wait
        next("/login");
      }
    });
  }
  else {
    next();
  }
})


new Vue({
  router:router,
  store,
  render: h => h(App),
}).$mount('#app')
