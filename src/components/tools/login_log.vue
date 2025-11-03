<template>
  <div>
    <HeaderNav/>
    <div id="content-page" class="content-page">
      <div class="container">
        <!-- 🔹 Table -->
        <div class="iq-card">
          <div class="iq-card-header d-flex justify-content-between">
            <h4>Login History</h4>
          </div>
          <div class="iq-card-body">
            <!-- 🔹 Loading State -->
          <div v-if="isLoading" class="text-center p-4">
            <span class="spinner-border text-primary" role="status"></span>
            <p>Loading...</p>
          </div>

          <!-- 🔹 Error State -->
          <div v-else-if="error" class="alert alert-danger d-flex flex-column align-items-center">
            <p class="mb-2">{{ error }}</p>
            <button class="btn btn-sm btn-primary" @click="fetchLoginHistoryEventHandler">
              Retry
            </button>
          </div>

            <div v-else-if="logs.length === 0" class="text-center text-muted py-5">
              No login history found.
            </div>

            <div v-else>
              <div class="table-responsive">
                <table class="table table-bordered table-hover">
                  <thead class="thead-light">
                    <tr>
                      <th>User</th>
                      <th>Time</th>
                      <th>IP Address</th>
                      <th>Device</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="log in logs" :key="log.id">
                      <td>
                        <div class="font-weight-bold">{{ log.userid }}</div>
                      </td>
                      <td>
                        <div>{{ formatDateTime(log.logged_in_at) }}</div>
                        <small v-if="log.logged_out_at" class="text-success">
                          Out: {{ formatTime(log.logged_out_at) }}
                        </small>
                      </td>
                      <td>{{ log.ip_address || '—' }}</td>
                      <td>{{ log.device }}</td>
                      <td>
                        <span class="badge" :class="log.logged_out_at ? 'badge-success' : 'badge-warning'">
                          {{ log.logged_out_at ? 'Logged Out' : 'Active' }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div> 
    </div>
    <FooterBar/>
  </div>
</template>


<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'LoginLogs',
  components: { HeaderNav, FooterBar },

  data() {
    return {
      logs: [],
    }
  },
  
  mounted() {
    this.fetchLoginHistoryEventHandler()
  },
  computed: {
    ...mapGetters("app/auth", {
      isLoading: "isLoading",
      error: "error",
    })
  },

  methods: {
    ...mapActions("app/auth", ["fetchLoginHistory"]),

    fetchLoginHistoryEventHandler() {
      this.fetchLoginHistory()
        .then((response) => {
          if (response) {
            this.logs = response.logs;
          }
        });
    },

  formatDateTime (dateInput)  {
    const date = new Date(dateInput); // Ensure the input is a Date object
    const pad = (n) => n < 10 ? '0' + n : n;
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },

   
    formatTime(date) {
      return new Date(date).toLocaleTimeString()
    }
  }
}

</script>
