<template>
  <div>
    <HeaderNav/>
    <transition name="fade">
      <div id="content-page" class="content-page">
        <div v-if="societyError">
          <div class="error-div mb-20 text-center">
            <span>
              {{ societyError.message }}
            </span>
          </div>
        </div>
          
        <div class="container">
          <h4></h4>
          <div class="table-responsive">
            <table class="styled-table">
              <thead>
                <tr>
                  <th>Amount Requested</th>
                  <th>Society</th>
                  <th>Interest Rate</th>
                  <th>Purpose</th>
                  <th>Loan Details</th>
                  <td>Guarrantors</td>
                  <th>Status</th>
                </tr>
              </thead>
                <Loan :loanDetails="loan_details" 
                :loanIsLoading="loanIsLoading" 
                :loanError="loanError"
                :openLoanDetailsModal="openLoanDetailsModal"
                /> 
            </table>
          </div>
        <Modal ref="loanDetailsModal" :loan_request_id="loan_request_id"/>
      </div>
    </div>
  </transition>
  <FooterBar/>
</div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer';
import Loan from '@/components/myLoan/Loans'
import Modal from '@/components/myLoan/Modal'
import { openModal } from "../../assets/js/helpers/utility";
import { mapActions, mapGetters } from 'vuex';
import { turnArrayToObject } from '../../utility';

export default {
  name: 'history-component',
  components: {
    HeaderNav,
    Loan,
    FooterBar,
    Modal
  },
  data() {
    return{
      pageTitle: 'Loan History',
      previousPage: 'Dashboard',
      loan_details: [],
      loan_request_id: ''
    } 
  },
  methods: {
    ...mapActions("app/society", ["fetchManySociety", "getOneSociety"]),
    ...mapActions("app/loan", ["getLoanPaymentHistoryForMember", "getAllMyLoan"]),

    openLoanDetailsModal(loan_request_id){
      this.$data.loan_request_id = loan_request_id
      let element = this.$refs.loanDetailsModal.$el
      openModal(element)
    }
  },

  created(){
    this.getAllMyLoan()
    .then(data => {
      if (data){
        const societyIDs = data.loanRequests.map(l=>l.society_id)
        this.fetchManySociety(societyIDs)
        .then(data2 => {
          const societyObj = turnArrayToObject(data2.societies)
          this.$data.loan_details = data.loanRequests.map(d=>{
            d.societyName = (
              societyObj[d.society_id] ? societyObj[d.society_id].name : "Unknown"
            )
            return d
          })
        })
      }
    })
  },

  computed: {
    ...mapGetters("app/society", {societyIsLoading:"isLoading", societyError:"error"}),
    ...mapGetters("app/loan", {loanIsLoading:"isLoading", loanError:"error"})
  },
}
</script>
