<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper">
      <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
      <div class="page-inner">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info flex-container">
                <p><i class="fa fa-info-circle"></i> All registered members that requested for loan are being showed here</p>
                <p class="export-btn"><button class="btn btn-warning btn-sm"><i class="fa fa-upload"></i>&nbsp;Export as CSV</button></p>
              </div>
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
                    <label>Enter Member's Name</label>
                    <input type="text" v-model="query.filter.name">
                  </div>
                </div>
                 <div class="col-md-4">
                  <div class="form-group">
                    <label>Status</label>
                    <select v-model="query.filter.status" class="form-control">
                      <option value="">Choose an Option</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Requested date from</label>
                    <input type="date" v-model="query.filter.from">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Requested date to</label>
                    <input type="date" v-model="query.filter.to">
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center">
              <button type="button" class="btn-general" @click="getLoansEventHandler()">Filter Result</button>
            </div>
        </div>
        
        <div class="container">
          <LimitDataFetch :getLimit="getLimit" :limit="pagination.limit"/>
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
                <tr class="theading">
                  <th>S/N</th>
                  <th>Name</th>
                  <th>Society</th>
                  <th>Tot. Assets</th>
                  <th>Tot. Amt. Requested</th>
                  <th>View Details</th>
                  <th>Guarantors</th>
                  <th>Status</th>
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
    </div> 

    <InterestRateModal ref="interestRateModal" :memberName="memberName" 
    :loan_request_id="loan_request_id" 
    :interest_rate="interest_rate"
    :updateParentComponentForInterestRateChange="updateParentComponentForInterestRateChange"
    :getLoanIsLoading="getLoanIsLoading"
    :getLoanError="getLoanError"/>

    <EditLoanAmountModal ref="editLoanAmountModal" :memberName="memberName"
    :loan_request_id="loan_request_id" 
    :getLoanIsLoading="getLoanIsLoading"
    :getLoanError="getLoanError"
    />

    <LoanPaymentHistory ref="loanPaymentHistoryModal" :memberName="memberName"
    :loan_request_id="loan_request_id" 
    :getLoanIsLoading="getLoanIsLoading"
    :getLoanError="getLoanError"
    />

    <AddNewLoanAmountModal ref="addNewLoanAmountModal" :memberName="memberName"
    :loan_request_id="loan_request_id" 
    :getLoanIsLoading="getLoanIsLoading"
    :getLoanError="getLoanError"
    />
</div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import LoanRequestList from '@/components/loan/member/LoanRequestList'
import Pagination from '@/components/includes/Pagination'
import LimitDataFetch from '@/components/includes/LimitDataFetch'
import InterestRateModal from '@/components/loan/member/InterestRateModal'
import EditLoanAmountModal from '@/components/loan/member/EditLoanAmountModal'
import AddNewLoanAmountModal from '@/components/loan/member/AddNewLoanAmountModal'
import LoanPaymentHistory from '@/components/loan/member/LoanPaymentHistory'
import { closeNavbar, toggleAvatarDropDown, closeModal, openModal } from "../../../assets/js/helpers/utility";
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { turnArrayToObject } from '../../../utility';
import $ from 'jquery'

export default {
  name: 'MembersStatus',
  components: {
    HeaderNav,
    PageHeader,
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
          name: '',
          status: '',
          to: '',
          from:'',
        },
        limit:10,
        page:1
      },
      pageTitle: 'Members Loan Status',
      previousPage: 'Dashboard',
      notificationMessage: '',
      loanRequests: [],
      societies: [],
      pagination: {},
      fetchManyError:null,
      memberName: '',
      loan_request_id: '',
      interest_rate: '',
      successMsg: ''
    } 
  },

  methods: {
    ...mapActions("app/loan", ["loanIndex"]),
    ...mapActions("app/society", ["getSocieties"]),
    ...mapActions("app/member", ["fetchManyMember"]),
    ...mapActions("app/society", ["fetchManySociety"]),
    ...mapActions("app/member_payment", ["fetchManyMemberTotalAssets"]),

    openLoanInterestRateModal(memberName, loan_request_id, interest_rate){
      this.$data.memberName = memberName
      this.$data.loan_request_id = loan_request_id
      this.$data.interest_rate = interest_rate
      let element = this.$refs.interestRateModal.$el
      openModal(element)
    },

    openLoanPaymentHistoryModal(memberName, loan_request_id){
      this.$data.memberName = memberName
      this.$data.loan_request_id = loan_request_id
      let element = this.$refs.loanPaymentHistoryModal.$el
      openModal(element)
    },

    openLoanAmountHistoryEditModal(memberName, loan_request_id){
      this.$data.memberName = memberName
      this.$data.loan_request_id = loan_request_id
      let element = this.$refs.editLoanAmountModal.$el
      openModal(element)
    },

    openAddNewLoanAmountModal(memberName, loan_request_id){
      this.$data.memberName = memberName
      this.$data.loan_request_id = loan_request_id
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

    getLoansEventHandler(){
      this.loanIndex({query:this.$data.query})
      .then(data => {
        console.log(data)
        if (data){
          // get all memberIDs
          const memberIDs = []//data.loanRequests.map(loan=>loan.member_id)

          const societyIDs = []//data.loanRequests.map(loan=>loan.society_id)
          const mappedSocietyIDWithMemberID = []

          let loan = null

          for(let i = 0; i < data.loanRequests.length; i++){
            loan = data.loanRequests[i];
            memberIDs.push(loan.member_id)
            societyIDs.push(loan.society_id)
            mappedSocietyIDWithMemberID.push(`${loan.society_id}:${loan.member_id}`)
          }//end for loop

          Promise.all([
            this.fetchManyMember(memberIDs),
            this.fetchManySociety(societyIDs),
            this.fetchManyMemberTotalAssets(mappedSocietyIDWithMemberID),
          ])
          .then(results=>{
            console.log(results)
            const memberObj = turnArrayToObject(results[0].members)
            const societyObj = turnArrayToObject(results[1].societies)
            const totalAssetObj = turnArrayToObject(results[2].totalAssets)

            // console.log({memberObj, societyObj, totalAssetObj});

            this.$data.loanRequests = data.loanRequests.map(loan=>{
              
              const m = memberObj[loan.member_id]
              const s = societyObj[loan.society_id]
              const t = totalAssetObj[`${loan.society_id}:${loan.member_id}`]

              loan.member_name = m ? m.name : "Unknown"
              loan.member_society = s ? s.name : "Unknown"
              loan.member_asset = t ? t.total_asset : "Unknown"
              
              return loan;
            })//end map
            this.$data.pagination = data.pagination
            //console.log(this.$data.loanRequests);
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

  },

   created() {
    this.getSocieties()
    .then(data => {
      if (data){
        this.$data.societies = data.societies
      }
    })

  },

  computed: {
    ...mapGetters("app/loan", {getLoanIsLoading:'isLoading', getLoanError: 'error'}),
    ...mapGetters("app/society", {getSocietiesIsLoading:'isLoading', getSocietiesError:'error'})
  },

  mounted(){
    toggleAvatarDropDown(),
    closeNavbar()
  }
}
</script>
