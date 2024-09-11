<template>
  <div>
    <HeaderNav/>
    <transition name="fade">
      <div id="page-wrapper">
        <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
        <div class="page-inner">
            <div class="container">
              <div v-if="loanIsLoading || societyIsLoading">
                <div class="text-center mb-20">
                  <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
                </div>
              </div>
            <div v-if="societyError">
              <div class="error-div mb-20 text-center">
                <span>
                  {{ societyError.message }}
                </span>
              </div>
            </div>
            </div>
          <div class="container">
            <h4></h4>
            <div class="table-responsive">
              <table class="table table-bordered table-hover">
                <thead>
                  <tr class="theading">
                    <th>Amount requested</th>
                    <th>Society</th>
                    <th>Interest rate</th>
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
          <Modal ref="loanDetailsModal" :loan_request_id="loan_request_id"
          
          />
        </div>
      </div>
    </div>
  </transition>
</div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import Loan from '@/components/myLoan/Loans'
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import Modal from '@/components/myLoan/Modal'
import { closeNavbar, toggleAvatarDropDown, openModal, closeModal } from "../../assets/js/helpers/utility";
import { mapActions, mapGetters } from 'vuex';
import { turnArrayToObject } from '../../utility';

export default {
  name: 'history',
  components: {
    HeaderNav,
    Loan,
    PageHeader, 
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
      console.log(loan_request_id)
      let element = this.$refs.loanDetailsModal.$el
      openModal(element)
    }
  },

  created(){
    this.getAllMyLoan()
    .then(data => {
      if (data){
       const societyIDs = data.loanRequests.map(l=>l.society_id)
       console.log(societyIDs)
       this.fetchManySociety(societyIDs)
       .then(data2 => {
         console.log(data2, "fetching many society")
         const societyObj = turnArrayToObject(data2.societies)

         this.$data.loan_details = data.loanRequests.map(d=>{
           d.societyName = (
             societyObj[d.id] ? societyObj[d.id].name : "Unknown"
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

  mounted(){
    toggleAvatarDropDown(),
    closeNavbar()
  }
}
</script>
