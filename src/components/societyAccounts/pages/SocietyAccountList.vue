<template>
  <div>
    <HeaderNav/>
    <div id="content-page" class="content-page">
      <div class="container">

        <!-- 🔹 Search Filter -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4>Society Accounts</h4>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by society name..."
            class="form-control w-50"
          />
        </div>

         <div v-if="totals" class="mb-3">
          <div class="card shadow-sm p-3">
            <h5 class="mb-2">Totals Summary</h5>
            <div class="d-flex flex-column flex-md-row justify-content-between">
              <div><strong>Total Balance:</strong> ₦{{ Number(totals.balance).toLocaleString() || 0 }}</div>
              <div><strong>Total Loan Balance:</strong> ₦{{ Number(totals.loan_balance).toLocaleString() || 0 }}</div>
            </div>
          </div>
        </div>

        <!-- 🔹 Loading State -->
        <div v-if="getSocietyAccountIsLoading" class="text-center p-4">
          <span class="spinner-border text-primary" role="status"></span>
          <p>Loading society accounts...</p>
        </div>

        <!-- 🔹 Error State -->
        <div v-else-if="getSocietyAccountError" class="alert alert-danger d-flex flex-column align-items-center">
          <p class="mb-2">{{ getSocietyAccountError }}</p>
          <button class="btn btn-sm btn-primary" @click="fetchAccounts">
            Retry
          </button>
        </div>

       
        <!-- 🔹 Table -->
        <div class="table-responsive" v-else>
          <table class="styled-table">
            <thead>
              <tr>
                <th>Society</th>
                <th>Balance</th>
                <th>Loan Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredSocieties.length === 0">
                <td colspan="4" class="text-center">No accounts found</td>
              </tr>
              <tr v-for="society in filteredSocieties" :key="society.id">
                <td>{{ society.name || 'N/A' }}</td>
                <td>₦{{ Number(society.balance).toLocaleString() || 0 }}</td>
                <td>₦{{ Number(society.loan_balance).toLocaleString() || 0 }}</td>
                <td>
                  <router-link :to="`/society_account_detail/${society.id}`" class="btn btn-success">
                    View Transactions
                  </router-link>
                </td>
              </tr>
            </tbody>
             <tfoot v-if="totals">
              <tr>
                <th>Total</th>
                <th>₦{{ Number(totals.balance).toLocaleString() || 0 }}</th>
                <th>₦{{ Number(totals.loan_balance).toLocaleString() || 0 }}</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>

      </div> 
    </div>
    <FooterBar/>
  </div>
</template>


<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import { mapActions , mapGetters, mapMutations } from 'vuex'

export default {
  name: 'SocietyAccountList',
  components: { HeaderNav, FooterBar },

  data() {
    return {
      searchQuery: "",
      societyAccounts: [],
      totals: null
    };
  },

  methods: {
    ...mapActions("app/society_account", ["getSocietyAccount"]),
    ...mapMutations("app/society_account", ["setError"]),

    fetchAccounts() {
      this.getSocietyAccount()
        .then((response) => {
          if (response) {
            this.societyAccounts = response.accounts;
            this.totals = response.totals
          }
        });
    },
  },

  created() {
    this.fetchAccounts();
  },

  computed: {
    ...mapGetters("app/society_account", {
      getSocietyAccountIsLoading: "isLoading",
      getSocietyAccountError: "error",
    }),

    // 🔹 Filtered list
    filteredSocieties() {
      if (!this.searchQuery) return this.societyAccounts;
      const q = this.searchQuery.toLowerCase();
      return this.societyAccounts.filter(
        (s) => (s.name || "").toLowerCase().includes(q)
      );
    },
  },
};

</script>
