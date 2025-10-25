<template>
  <div>
    <HeaderNav/>
    <div id="content-page" class="content-page">
    <div class="container">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center my-5">
        <span class="spinner-border text-primary" role="status"></span>
          <p>Fetching account details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <!-- Success State -->
      <div v-else-if="account">
       <div class="card shadow-sm my-3">
          <div class="card-body">
            <h4 class="card-title mb-3">
              {{ (account && account.society && account.society.name) || "Unnamed Society" }}
            </h4>
            <ul class="list-group list-group-flush mb-3">
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <strong>Balance</strong>
                <span class="text-success fw-bold">₦{{ Number(account.balance || 0).toLocaleString() }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <strong>Loan Balance</strong>
                <span class="text-danger fw-bold">₦{{ Number(account.loan_balance || 0).toLocaleString() }}</span>
              </li>
            </ul>
            <small class="text-muted">
              Last Updated: {{ formatDate(account.updated_at) }}
            </small>
          </div>
        </div>


        <!-- Transaction Table -->
        <div class="card shadow-sm my-4">
          <div class="card-body">
            <h5 class="card-title mb-3">Transactions</h5>
            <div class="table-responsive">
              <table class="table table-striped table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Reference</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                 <tr v-for="tx in account.transactions || []" :key="tx.id">
                    <td>
                      <span :class="getTypeBadgeClass(tx.type)">
                        {{ tx.type }}
                      </span>
                    </td>
                    <td>₦{{ Number(tx.amount || 0).toLocaleString() }}</td>
                    <td>{{ tx.description || '-' }}</td>
                    <td>{{ tx.reference || '-' }}</td>
                    <td>{{ tx.created_at ? formatDate(tx.created_at) : '-' }}</td>
                  </tr>

                  <tr v-if="!account.transactions || account.transactions.length === 0">
                    <td colspan="5" class="text-center text-muted py-3">
                      No transactions yet
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>


        <!-- Buttons -->
       <div class="mt-3 d-flex flex-column flex-md-row flex-wrap gap-3 gap-md-2">
        <button class="btn btn-success btn-stack" @click="showModal('deposit')">Deposit</button>
        <button class="btn btn-danger btn-stack" @click="showModal('withdraw')">Withdraw</button>
        <button class="btn btn-warning btn-stack" @click="showModal('borrow')">Borrow</button>
        <button class="btn btn-primary btn-stack" @click="showModal('repay')">Repay</button>
      </div>

      <!-- Back button -->
      <div class="mb-3 mt-5 text-center">
        <button class="btn btn-secondary" @click="$router.push('/society_accounts')">
          ← Back to Accounts
        </button>
      </div>

      </div>
    </div>
    </div>
    <!-- Reusable Modal -->
    <TransactionModal
      v-if="modalType"
      :type="modalType"
      :isLoading="isLoading"
      @close="closeModal"
      @submit="submitTransaction"
    />

    <FooterBar/>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer';
import TransactionModal from '@/components/societyAccounts/components/TransactionModal';
import { mapActions, mapGetters, mapMutations } from "vuex";
import { setIsLoading, setError } from "@/store/constants";

export default {
  name: 'SocietyAccountDetail',
  components: { HeaderNav, FooterBar, TransactionModal },
  data() {
    return {
      account: [],
      modalType: null,
    };
  },
  computed: {
    ...mapGetters("app/society_account", {
      isLoading: "isLoading",
      error: "error",
    }),
  },
  methods: {
    ...mapActions("app/society_account", [
      "getSocietyAccountDetail",
      "deposit",
      "withdraw",
      "borrow",
      "repay"
    ]),
    ...mapMutations("app/society_account", [setIsLoading, setError]),

    fetchData() {
      this.getSocietyAccountDetail(this.$route.params.society_id)
        .then((response) => {
          this.account = response.account || response.data.account;
        })
    },

    getTypeBadgeClass(type) {
      switch (type) {
        case "deposit":
          return "badge bg-success";
        case "withdrawal":
          return "badge bg-danger";
        case "loan":
          return "badge bg-warning text-dark";
        case "repayment":
          return "badge bg-primary";
        default:
          return "badge bg-secondary";
      }
    },

    formatDate(date) {
      if (!date) return "-";
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(date));
    },

    showModal(type) {
      this.modalType = type;
    },
    closeModal() {
      this.modalType = null;
    },
   submitTransaction({ type, amount }) {
      const actionMap = {
        deposit: this.$store.dispatch.bind(this.$store, 'app/society_account/deposit'),
        withdraw: this.$store.dispatch.bind(this.$store, 'app/society_account/withdraw'),
        borrow: this.$store.dispatch.bind(this.$store, 'app/society_account/borrow'),
        repay: this.$store.dispatch.bind(this.$store, 'app/society_account/repay'),
      };

      this.setIsLoading(true);

      actionMap[type]({
        society_id: this.$route.params.society_id,
        amount,
      })
        .then((resp) => {
          if (resp.success) {
            this.$toasted.show(resp.msg || "Transaction successful", {
              type: "success",
              icon: "check-circle",
            });
            this.closeModal();
            this.fetchData(); // re-fetch account + transactions
          } else {
            this.setError(resp.msg || "Transaction failed");
            this.$toasted.show(resp.msg || "Transaction failed", {
              type: "error",
              icon: "cancel-circle",
            });
          }
        })
        .catch((err) => {
          this.$toasted.show(err?.response?.data?.msg ||
              err?.response?.data?.error ||
              "Error processing transaction", {
            type: "error",
            icon: "cancel-circle",
          });
          this.setError(
            err?.response?.data?.msg ||
              err?.response?.data?.error ||
              "Error processing transaction"
          );
        })
        .finally(() => {
          this.setIsLoading(false);
        });
    }


  },
  created() {
    this.fetchData();
  },
};
</script>
<style scoped>
@media (max-width: 767.98px) {
  .btn-stack {
    margin-bottom: 10px;
  }
}
</style>
