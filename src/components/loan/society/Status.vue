<template>
  <div>
    <HeaderNav/>
      <div id="content-page" class="content-page">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info flex-container">
                <p><i class="fa fa-info-circle"></i> All registered societies that requested for loan are being showed here</p>
                <!-- <p class="export-btn pull-right"><button class="btn btn-warning btn-sm"><i class="fa fa-upload"></i>&nbsp;Export as CSV</button></p> -->
              </div>
            </div>
          </div>
          <div v-if="getLoanError">
            <div class="error-div text-center">
              <span>
                {{ getLoanError.message }}
              </span>
            </div>
          </div>
          <div class="filter-result">
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label>Select society</label>
                  <select class="form-control" v-model="query.filter.society_id">
                    <option value="">Select Society</option>
                    <option v-for="s in societies" :key="s.id" :value="s.id">{{ s.name }}</option>
                  </select>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label>Requested date from</label>
                  <input type="date" v-model="query.filter.from" class="form-control">
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label>Requested date to</label>
                  <input type="date" v-model="query.filter.to" class="form-control">
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-10">
            <button type="button" class="btn btn-info" @click="getLoansEventHandler()">Filter Result</button>
          </div>
        </div>

        <div class="container" :style="{width:'100%', padding:'50px 0'}">
          <LimitDataFetch :getLimit="getLimit" :limit="pagination.limit" :reloadIndexData="reloadIndexData"/>
          <div v-if="successMsg">
            <div class="success-div text-center">
              <span>
                {{ successMsg }}
              </span>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered table-hover table-striped">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Society Name</th>
                  <th>Tot. Amt. Requested</th>
                  <th>Interest Rate</th>
                  <th>View Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <LoanRequestList :loanRequests="loanRequests" 
              :getLoanIsLoading="getLoanIsLoading"
              :getLoanError="getLoanError" :currentPage="pagination.currentPage" 
              :limit="pagination.limit"
              :openLoanInterestRateModal="openLoanInterestRateModal"
              :openLoanAmountHistoryEditModal="openLoanAmountHistoryEditModal"
              :openAddNewLoanAmountModal="openAddNewLoanAmountModal"
              :openLoanPaymentHistoryModal="openLoanPaymentHistoryModal"/>
            </table>
          </div>
        </div> 
        <Pagination :pagination="pagination"/>
      </div>
      <FooterBar />

      <InterestRateModal ref="interestRateModal" :societyName="societyName" 
      :loan_request_id="loan_request_id" 
      :interest_rate="interest_rate"
      :updateParentComponentForInterestRateChange="updateParentComponentForInterestRateChange"
      :getLoanIsLoading="getLoanIsLoading"
      :getLoanError="getLoanError"/>

      <EditLoanAmountModal ref="editLoanAmountModal" :societyName="societyName"
      :loan_request_id="loan_request_id" 
      :getLoanIsLoading="getLoanIsLoading"
      :getLoanError="getLoanError"
      />

      <LoanPaymentHistory ref="loanPaymentHistoryModal" :societyName="societyName"
      :loan_request_id="loan_request_id" 
      :getLoanIsLoading="getLoanIsLoading"
      :getLoanError="getLoanError"
      />

      <AddNewLoanAmountModal ref="addNewLoanAmountModal" :societyName="societyName"
      :loan_request_id="loan_request_id" 
      :getLoanIsLoading="getLoanIsLoading"
      :getLoanError="getLoanError"
      />
    </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import LoanRequestList from '@/components/loan/society/LoanRequestList'
import Pagination from '@/components/includes/Pagination'
import LimitDataFetch from '@/components/includes/LimitDataFetch'
import InterestRateModal from '@/components/loan/society/InterestRateModal'
import EditLoanAmountModal from '@/components/loan/society/EditLoanAmountModal'
import AddNewLoanAmountModal from '@/components/loan/society/AddNewLoanAmountModal'
import LoanPaymentHistory from '@/components/loan/society/LoanPaymentHistory'
import { closeModal, openModal } from "../../../assets/js/helpers/utility";
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { turnArrayToObject } from '../../../utility';

export default {
  name: 'MembersStatus',
  components: {
    HeaderNav,
    FooterBar,
    LoanRequestList,
    Pagination,
    LimitDataFetch,
    InterestRateModal,
    EditLoanAmountModal,
    AddNewLoanAmountModal,
    LoanPaymentHistory
  },
  data() {
    return{
      query: {
        filter:{
          society_id: '',
          to: '',
          from:'',
        },
        limit:10,
        page:1
      },
      pageTitle: 'Society Loan Status',
      previousPage: 'Dashboard',
      notificationMessage: '',
      loanRequests: [],
      societies: [],
      pagination: {},
      fetchManyError:null,
      societyName: '',
      society_id: '',
      loan_request_id: '',
      interest_rate: '',
      successMsg: ''
    } 
  },

  methods: {
    ...mapActions("app/society_loan", ["loanIndex"]),
    ...mapActions("app/society", ["getSocieties"]),
    ...mapActions("app/society", ["fetchManySociety"]),

    openLoanInterestRateModal(societyName, loan_request_id, interest_rate){
      this.$data.societyName = societyName
      this.$data.loan_request_id = loan_request_id
      this.$data.interest_rate = interest_rate
      let element = this.$refs.interestRateModal.$el
      openModal(element)
    },

    openLoanPaymentHistoryModal(societyName, loan_request_id){
      this.$data.societyName = societyName
      this.$data.loan_request_id = loan_request_id
      let element = this.$refs.loanPaymentHistoryModal.$el
      openModal(element)
    },

    openLoanAmountHistoryEditModal(societyName, loan_request_id){
      this.$data.societyName = societyName
      this.$data.loan_request_id = loan_request_id
      let element = this.$refs.editLoanAmountModal.$el
      openModal(element)
    },

    openAddNewLoanAmountModal(societyName, society_id, loan_request_id){
      this.$data.societyName = societyName
      this.$data.loan_request_id = loan_request_id
      this.$data.society_id = society_id
      let element = this.$refs.addNewLoanAmountModal.$el
      openModal(element)
    },

    closeLoanAmountModal(){
      let element = this.$refs.editLoanAmountModal.$el
      closeModal(element)
    },

    closeLoanInterestRateModal(){
      let element = this.$refs.interestRateModal.$el
      closeModal(element)
    },

    getLoansEventHandler(reload=false){
      this.loanIndex({query:this.$data.query, reload})
      .then(data => {
        if (data){
          // get all societyIDs
        
          const societyIDs = [] //data.societyLoans.map(loan=>loan.society_id)

          let loan = null

          for(let i = 0; i < data.societyLoans.length; i++){
            loan = data.societyLoans[i];
            societyIDs.push(loan.society_id)
          }//end for loop
          this.fetchManySociety(societyIDs)
          .then(results=>{
            const societyObj = turnArrayToObject(results.societies)
            this.$data.loanRequests = data.societyLoans.map(loan=>{
              const s = societyObj[loan.society_id] 

              loan.society_name = s ? s.name : "Unknown"

              return loan;
            })//end map
            this.$data.pagination = data.pagination
          })
          .catch(e=>this.$data.fetchManyError=e)
        }
      })
    },
    
    getLimit(event){
      //let val = event.target.value;
      this.$data.query.limit = event.target.value;
      this.getLoansEventHandler()
    },//end method getLimit,

    updateParentComponentForInterestRateChange(updated){
      if (updated){
        this.$data.successMsg = 'Interest rate updated successfully'
        this.closeLoanInterestRateModal()
      }
    },

    reloadIndexData(){
      this.getLoansEventHandler(true, this.$data.query)
    }

  },

   created() {
    this.getSocieties({query:{limit:500}})
    .then(data => {
      if (data){
        this.$data.societies = data.societies
      }
    })

  },

  computed: {
    ...mapGetters("app/society_loan", {getLoanIsLoading:'isLoading', getLoanError: 'error'}),
    ...mapGetters("app/society", {getSocietiesIsLoading:'isLoading', getSocietiesError:'error'})
  }
}
</script>
