import axios from "axios";
import router from "./routes";
import store from "./store";
import Vue from "vue";

// ✅ Global Axios interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Show toast only once
      if (!window.__sessionExpiredToastShown) {
        window.__sessionExpiredToastShown = true;
        Vue.toasted.show("⚠️ Your session has expired. Please log in again.", {
          type: "error",
          duration: 4000,
          icon: "sign-out-alt"
        });

        // Reset flag after a few seconds
        setTimeout(() => {
          window.__sessionExpiredToastShown = false;
        }, 5000);
      }

      // Get current route to return later
      const currentPath = router.currentRoute?.fullPath || "/";

      // Perform logout and redirect with return path
      store._actions['app/auth/logout'][0]()
        .finally(() => {
          router.push(`/login?r=${encodeURIComponent(currentPath)}`);
        });
    }

    return Promise.reject(error);
  }
);

export default axios;
