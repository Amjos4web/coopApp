import Vue from 'vue'
import App from './App.vue'
import Routes from './routes'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Toasted from 'vue-toasted';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from "./store";
import "./axios";
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


router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth);
  const isLoggedIn = store.getters['app/auth/isLogged'];

  if (requiresAuth && !isLoggedIn) {
    const self = await store._actions['app/auth/getSelf'][0]();

    if (!self) {
      const redirectPath = to.fullPath !== '/login' ? to.fullPath : '/';
      return next(`/login?r=${redirectPath}`);
    }
  }

  if (to.path === '/login' && isLoggedIn) return next('/');
  if (to.path === '/Logout') {
    await store._actions['app/auth/logout'][0]();
    return next('/login');
  }

  next();
});



new Vue({
  router:router,
  store,
  render: h => h(App),
}).$mount('#app')
