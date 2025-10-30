<template>
   <div>
    <HeaderNav/>
      <div id="content-page" class="content-page">
       <div class="container">
          <!-- Header -->
          <div class="flex justify-between items-center mb-10">
            <h4>SMS & Push Logs</h4>
          </div>
          <div
            v-if="error"
            class="my-4 p-3 bg-red-100 text-red-700 rounded-md text-sm font-medium border border-red-300"
          >
            {{ error || 'An unexpected error occurred.' }}
          </div>
          <!-- Filters -->
          <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-4 lg:p-6 mb-8">
            <div class="flex flex-wrap items-end gap-4">

              <!-- Message Type -->
              <div class="flex flex-col">
                <label class="text-xs font-semibold text-gray-600 uppercase mb-1">Message Type</label>
                <select
                  v-model="localFilters.type"
                  @change="updateFilters"
                  class="w-40 lg:w-48 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All Types</option>
                  <option v-for="type in filterOptions.types" :key="type" :value="type">
                    {{ formatType(type) }}
                  </option>
                </select>
              </div>

              <!-- Status -->
              <div class="flex flex-col">
                <label class="text-xs font-semibold text-gray-600 uppercase mb-1">Status</label>
                <select
                  v-model="localFilters.status"
                  @change="updateFilters"
                  class="w-36 lg:w-40 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <!-- Date Range -->
              <div class="flex flex-col">
                <label class="text-xs font-semibold text-gray-600 uppercase mb-1">From</label>
                <input
                  type="date"
                  v-model="localFilters.date_from"
                  @change="updateFilters"
                  class="w-40 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div class="flex flex-col">
                <label class="text-xs font-semibold text-gray-600 uppercase mb-1">To</label>
                <input
                  type="date"
                  v-model="localFilters.date_to"
                  @change="updateFilters"
                  class="w-40 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <!-- Buttons -->
              <div class="flex items-center gap-3 ml-auto mt-2 lg:mt-0">
                <button
                  @click="updateFilters"
                  :disabled="isLoading"
                  class="flex items-center gap-2 bg-green-600 text-white text-sm px-4 py-2 rounded-md 
                        hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                >
                
                  Apply
                </button>

                <button
                  @click="clearFilters"
                  :disabled="isLoading || !hasFilters"
                  class="flex items-center gap-2 bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-md border border-gray-300 
                        hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  
                  Clear
                </button>
              </div>

            </div>
          </div>

          <!-- Loading & Empty States -->
          <div v-if="isLoading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-4 text-gray-600">Loading SMS logs...</p>
          </div>

          <div v-else-if="!isLoading && logs.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm">
            
            <h4 class="mt-2 text-sm font-medium text-gray-900">No SMS logs</h4>
            <p class="mt-1 text-sm text-gray-500">Get started by sending your first birthday wishes or payment reminders.</p>
          </div>

          <!-- Logs Table -->
          <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone/Token</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(log.created_at) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ log.member.name || 'N/A' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-3 py-1 text-xs font-semibold rounded-full" :class="getTypeBadgeClass(log.type)">
                        {{ formatType(log.type) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-xs text-gray-500">{{ formatPhone(log.phone) }}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 max-w-2xl">
                      <div class="line-clamp-2" :title="log.message">{{ log.message }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      <span class="px-3 py-1 text-xs font-semibold rounded-full"
                        :class="log.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                        {{ log.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div v-if="pagination.last_page > 1" class="bg-gray-50 px-6 py-4">
              <div class="flex justify-between items-center">
                <div class="text-sm text-gray-700">
                  Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results
                </div>
                <nav class="flex space-x-1">
                  <button
                    v-for="page in getPaginationLinks()"
                    :key="page.label"
                    @click="goToPage(page.url ? getPageNumber(page.url) : null)"
                    :disabled="!page.url || isLoading"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg',
                      page.active 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                      !page.url || isLoading ? 'cursor-not-allowed opacity-50' : 'hover:shadow-sm'
                    ]"
                  >
                    {{ page.label }}
                  </button>
                </nav>
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
  name: "SmsLogs",
   components: {
    HeaderNav,
    FooterBar
  },
  data() {
    return {
      localFilters: { type: '', status: '', date_from: '', date_to: '' }
    }
  },
  computed: {
    ...mapGetters("app/sms_logs", ["isLoading", "error", "logs", "pagination", "filterOptions", "filters", "hasFilters"])
  },
  methods: {
    ...mapActions("app/sms_logs", ["getSmsLogs", "updateFilters", "clearFilters", "goToPage", "exportExcel"]),
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    formatType(type) {
      return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    },
    getTypeBadgeClass(type) {
      if (type.includes('birthday')) return 'bg-purple-100 text-purple-800'
      if (type.includes('payment') || type.includes('reminder')) return 'bg-blue-100 text-blue-800'
      if (type.includes('push')) return 'bg-green-100 text-green-800'
      return 'bg-gray-100 text-gray-800'
    },
    formatPhone(phone) {
      if (!phone) return 'N/A'
      return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')
    },
    getPaginationLinks() {
      const links = []
      const current = this.pagination.current_page || 1
      const last = this.pagination.last_page || 1

      links.push({ label: '« Previous', url: current > 1 ? `${current - 1}` : null, active: false })
      const start = Math.max(1, current - 2)
      const end = Math.min(last, current + 2)
      for (let i = start; i <= end; i++) {
        links.push({ label: i.toString(), url: i.toString(), active: i === current })
      }
      links.push({ label: 'Next »', url: current < last ? `${current + 1}` : null, active: false })
      return links
    },
    getPageNumber(url) {
      if (!url) return null
      const match = url.match(/page=(\d+)/)
      return match ? parseInt(match[1]) : 1
    }
  },
  
  created() {
    this.getSmsLogs()
    this.localFilters = { ...this.filters }
  },

  watch: {
    error: {
      handler(newVal) {
        console.log('💥 Vuex Error changed:', newVal);
      },
      immediate: true
    }
  }
  
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
