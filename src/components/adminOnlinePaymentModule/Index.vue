<template>
  <div>
    <HeaderNav/>
      <div id="content-page" class="content-page">
        <div v-if="societyIsLoading">
          <div class="text-center mb-20" :style="{width: '100%'}">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
          </div>
        </div>
        <div class="container" v-else>
          <!-- <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info flex-container">
                <p><i class="fa fa-info-circle"></i> {{ notificationMessage }}</p>
                <p class="export-btn"><button class="btn btn-warning btn-sm"><i class="fa fa-upload"></i>&nbsp;Export as CSV</button></p>
              </div>
            </div>
          </div> -->
          <div v-if="errorMessage">
            <div class="error-div text-center">
              <span>{{ errorMessage }}</span>
            </div>
          </div>
          <form @submit.prevent="getOnlinePaymentsForAdminEventHandler()">
            <div class="filter-result">
              <div class="row">
                <div class="col-md-3 col-lg-3 col-sm-12">
                  <div class="form-group">
                    <label>From</label>
                    <input type="date" v-model="query.filter.from" class="form-control">
                  </div>
                </div>
                <div class="col-md-3 col-lg-3 col-sm-12">
                  <div class="form-group">
                    <label>To</label>
                    <input type="date" v-model="query.filter.to" class="form-control">
                  </div>
                </div>
                <div class="col-md-3 col-lg-3 col-sm-12">
                  <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" v-model="query.filter.email" class="form-control">
                  </div>
                </div>
                <div class="col-md-3 col-lg-3 col-sm-12">
                  <div class="form-group">
                    <label>Select society</label>
                    <select class="form-control" v-model="query.filter.society_id">
                      <option value="">Select Society</option>
                      <option v-for="s in societies" :key="s.id" :value="s.id">{{ s.name }}</option>
                    </select>
                  </div>
                </div>
              </div>
           </div>
          <div class="text-center mt-10">
            <input type="submit" value="Filter Result" class="btn btn-info">
          </div>
          </form>
        </div>
        <div v-if="memberError">
          <div class="error-div">
            <span>{{ memberError.message }}</span>
          </div>
        </div>
        <div v-if="fetchManyError">
          <div class="error-div">
            <span>{{ fetchManyError }}</span>
          </div>
        </div>
        <div v-if="memberOnlinePaymentError">
          <div class="error-div">
            <span>{{ memberOnlinePaymentError.message }}</span>
          </div>
        </div>
        
        <div class="container" v-if="onlinePayments.length > 0">
          <div class="table-responsive">
            <table class="styled-table">
              <thead>
                <tr>
                  <th>
                    <div class="bubble" :style="{margin: '1px 0'}">
                      <span class="bubble-failed"></span>
                    </div>
                  </th>
                  <th>Name</th>
                  <th>Society</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Reference</th>
                  <th>Paid On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <PaymentRecordLists :onlinePayments="onlinePayments"
              :total="total"
              :memberOnlinePaymentIsLoading="memberOnlinePaymentIsLoading"
              :memberIsLoading="memberIsLoading"
              :openChangeRefNoModal="openChangeRefNoModal"
              :verifyPaymentEventHandler="verifyPaymentEventHandler"
              />
              <ChangeRefNoModal
              :getPaymentPaymentError="memberOnlinePaymentError"
              :updateParentComponentForRefNoChange="updateParentComponentForRefNoChange"
              :memberName="member_name"
              :paymentID="payment_id"
              ref="changeRefNo" />

              <VerifyPaymentModal :verifiedPaymentData="verifiedPaymentData"
              :memberName="member_name" 
              ref="verifyPaymentModal"/>
             
            </table>
          </div>
          
          <!-- <Pagination :pagination="pagination" :changePage="changePage"/> -->
        </div> 
      </div>
      <FooterBar/>
    </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import PaymentRecordLists from '@/components/adminOnlinePaymentModule/PaymentRecordLists'
import ChangeRefNoModal from '@/components/adminOnlinePaymentModule/ChangeRefNoModal'
import VerifyPaymentModal from '@/components/adminOnlinePaymentModule/VerifyPaymentModal'
import { openModal, closeModal } from "../../assets/js/helpers/utility";
import { mapActions, mapGetters } from 'vuex'
import { turnArrayToObject } from '../../utility';

export default {
  name: 'OnlinePaymentRecords',
  components: {
    HeaderNav,
    FooterBar,
    PaymentRecordLists,
    ChangeRefNoModal,
    VerifyPaymentModal
  },
  data(){
    return {
      pageTitle: 'Online Payment Records',
      previousPage: 'Dashboard',
      societies: [],
      pagination:{},
      total: 0.0,
      onlinePayments:[],
      verifiedPaymentData: {},
      errorMessage: '',
      fetchManyError: null,
      member_name: '',
      payment_id: '',
      query:{
        filter: {
          from: '',
          to: '',
          society_id: '',
          email: ''
        },
        page: '',
        limit: 200
      }
    }
  },

  methods: {
    ...mapActions("app/society", ["getSocieties", "fetchManySociety"]),
    ...mapActions("app/member", ["fetchManyMember"]),
    ...mapActions("app/member_online_payment", ["getOnlinePaymentsForAdmin", "verifyPayment"]),

    openChangeRefNoModal(member_name, payment_id){
      this.$data.member_name = member_name
      this.$data.payment_id = payment_id
      let element = this.$refs.changeRefNo.$el
      openModal(element)
    },

    closeChangeRefNoModal(){
      let element = this.$refs.changeRefNo.$el
      closeModal(element)
    },

    openPaymentVerificationResultModal(){
      let element = this.$refs.verifyPaymentModal.$el
      openModal(element)
    },

    getOnlinePaymentsForAdminEventHandler(){
      const from = this.$data.query.filter.from
      const to = this.$data.query.filter.to
      if (!from && !to){
        this.$data.errorMessage = 'Please select atleast a parameter'
      } else {
        this.getOnlinePaymentsForAdmin({query:this.$data.query})
        .then(data => {
          if (data){
            // get all memberIDs
            const memberIDs = []//data.loanRequests.map(loan=>loan.member_id)

            const societyIDs = []//data.loanRequests.map(loan=>loan.society_id)
            const mappedSocietyIDWithMemberID = []

            let payments = null
            if (data.onlinePayments.original.data.onlinePayments.length < 1){
              this.$data.onlinePayments = [];
              return;
            }

            for(let i = 0; i < data.onlinePayments.original.data.onlinePayments.length; i++){
              payments = data.onlinePayments.original.data.onlinePayments[i];
              memberIDs.push(payments.member_id)
              societyIDs.push(payments.society_id)
              mappedSocietyIDWithMemberID.push(`${payments.society_id}:${payments.member_id}`)
            }//end for loop

            Promise.all([
              this.fetchManyMember(memberIDs),
              this.fetchManySociety(societyIDs),
            ])
            .then(results=>{
              const memberObj = turnArrayToObject(results[0].members)
              const societyObj = turnArrayToObject(results[1].societies)

              this.$data.onlinePayments = data.onlinePayments.original.data.onlinePayments.map(payments=>{
                
                const m = memberObj[payments.member_id]
                const s = societyObj[payments.society_id]

                payments.member_name = m ? m.name : "Unknown"
                payments.member_society = s ? s.name : "Unknown"
                
                return payments;
              })//end map
              this.$data.pagination = data.pagination
              this.$data.errorMessage = ''
            })
            .catch(e=>this.$data.fetchManyError=e)
          }
          this.$data.total = data.total
        })
      }
    },

    updateParentComponentForRefNoChange(response, updated){
      if (updated){
        this.$toasted.show(`${response}`, { 
          type: "success", 
          icon: 'check-circle'
        })
        this.closeChangeRefNoModal()
      }
    },

    verifyPaymentEventHandler(member_name, reference_no){
      this.$data.member_name = member_name
      this.verifyPayment({reference_no:reference_no})
      .then(response=>{
        this.$data.verifiedPaymentData = response
        if (response.status){
          this.$toasted.show(`Payment verified successfully`, { 
            type: "success", 
            icon: 'check-circle'
          })
          this.openPaymentVerificationResultModal()
        }
      })
      
    }
  },
  computed: {
    ...mapGetters("app/society", {societyIsLoading:"isLoading", societyError:"error"}),
    ...mapGetters("app/member", {memberIsLoading:"isLoading", memberError:"error"}),
    ...mapGetters("app/member_online_payment", {memberOnlinePaymentIsLoading:"isLoading", memberOnlinePaymentError:"error"}),
  },
  created(){
    // get all societies
    this.getSocieties({query:{limit:500}})
    .then(data => {
      if (data){
        this.$data.societies = data.societies
      }
    })
  }
}
</script>
