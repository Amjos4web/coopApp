import Vue from 'vue'
import App from './App.vue'
import Routes from './routes'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Toasted from 'vue-toasted';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from "./store";
// import VueApexCharts from "vue-apexcharts";

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Vuex)

// Vue.use(VueApexCharts);
// Vue.component("apex-chart", VueApexCharts);

Vue.use(Toasted, {
  duration: 4000,
  position: 'top-right',
  fullWidth: true,
  fitToScreen: true,
  iconPack: 'fontawesome',
  closeOnSwipe: true,
  keepOnHover: true
});

const router = new VueRouter({
  routes: Routes,
  mode: 'history',
  scrollBehavior(){
    window.scrollTo(0, 0)
  }
})

Vue.config.productionTip = false

// router.beforeResolve((to, from, next) => {
//   // If this isn't an initial page load.
//   if (to.name){
//       // Start the route progress bar.
//       NProgress.start()
//   }
//   next();
// })

// router.afterEach((to, from) => {
//   // Complete the animation of the route progress bar.
//   NProgress.done();
// })

router.beforeEach((to, from, next) => {
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isLoggedIn = store.getters['app/auth/isLogged'];

  if(requiresAuth && !isLoggedIn){ 
    //check if client already logged in but due to page reload
    //or page accidental closing, as long as user session is not
    //expired, client should be able to continue using app without re-logging
    store._actions['app/auth/getSelf'][0]()
    .then((self)=>{
      //return next({path:`login`, replace:true});
      if(!self){
        //const redirectPath = to.path//from && from.path !== "/login" ? from.path : '/';
        const redirectPath = from && from.path !== "/login" ? from.path : '/';
        return next({path:`login?r=${redirectPath}`});
      }
      else if(self){
        //continue to path no need to wait
        next(to.path);
      }
    });
  } 
  else if(to.path == '/login' && isLoggedIn){
    next("/")
  }
  else if(to.path == "/Logout"){
    store._actions['app/auth/logout'][0]()
    .then((self)=>{
      next("/login");
      // if(!self){
      //   //const redirectPath = to.path//from && from.path !== "/login" ? from.path : '/';
      //   //return next(`/login?r=${redirectPath}`);
      //   next("/")
      // }
      // else{
      //   //continue to path no need to wait
      //   next("/login");
      // }
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
