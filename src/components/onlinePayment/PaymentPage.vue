<template>
  <div>
    <HeaderNav/>
			<div id="content-page" class="content-page">
        <div v-if="paymentFetchError">
          <div class="error-div text-center">
            <span>{{ paymentFetchError.message }}</span>
          </div>
        </div>
        <div class="card" v-else>
          <div class="card-body">
            <h3 :style="{fontSize: '1.125rem', textTransform:'uppercase'}" class="card-title">List of all payment to be made for <b>{{ payment_date }}</b></h3>
            <div class="row">
              <div class="col-md-8 m-auto text-center">
                <div v-if="paymentIsLoading">
                  <div class="text-center mb-20" :style="{width: '100%'}">
                    <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
                  </div>
                </div>
                <div class="container text-center" v-else-if="!memberPaymentDueList.length < 0 || memberPaymentDueList == null">
                  <h4 :style="{color: 'red'}">Oops! Unable to load payments</h4>
                </div>
                <div class="container" v-else>
                  <form @submit.prevent="sendPaymentEventHandler()">
                    <div class="table-responsive" v-show="!hideDiv">
                      <table class="styled-table make-payment" :style="{width:'90%', margin:'auto'}">
                        <thead>
                          <tr v-for="memberMonthlyPayment in memberPaymentDueList" :key="memberMonthlyPayment.id">
                            <th width="40%">{{ memberMonthlyPayment.name }}<br><label :style="{fontSize: '.75rem', color: '#a8a7a7'}">Min. Amount expected to pay is &#8358;{{memberMonthlyPayment.min_amount }}</label></th>
                            <td width="60%">
                              <div class="form-group">
                                <label :for="memberMonthlyPayment.name" v-if="memberMonthlyPayment.name == 'Loan Interest'  || memberMonthlyPayment.name == 'Minute'" 
                                :style="{background: '#333', padding: '.3125rem 1.125rem .3125rem .1875rem', color: '#fff', fontSize: '.875rem'}">&#8358;{{ memberMonthlyPayment.min_amount }}</label>

                                <input 
                                  type="text"
                                  v-model="memberMonthlyPayment.min_amount"
                                  class="form-control"
                                  v-if="memberMonthlyPayment.name !== 'Loan Interest' && memberMonthlyPayment.name !== 'Minute'"
                                >
                                <span class="error-message"></span>
                              </div>
                            </td>
                          </tr>
                        </thead>
                      </table>
                      
                      <hr v-if="memberPaymentDueList.length > 0">
                      <div class="text-center" v-if="memberPaymentDueList.length > 0">
                        <input type="submit" name="makePayment" class="btn btn-primary" value="Save & Continue">
                      </div>
                      
                    </div>
                  </form>
                </div>
              </div> 
            </div>
            
            <div class="container" v-if="memberPaymentList.length > 0 && hideDiv" id="paymentAnalysis">
              <div class="text-center">
                <button class="btn btn-success" @click="showDiv">Edit Payments</button>
              </div><br>
              <div class="table-responsive">
                <table class="styled-table">
                  <thead>
                    <tr>
                      <th width="50%">Payment Name</th>
                      <th width="50%">Amount</th>
                    </tr>
                    <tr v-for="payment in memberPaymentList" :key="payment.id">
                      <td>{{payment.name}}</td>
                      <td>&#8358;{{Number(payment.amount).toLocaleString()}}</td>
                    </tr>
                    <tr>
                      <td>Payment Gateway Transaction Fee</td>
                      <td>&#8358;{{ Number((newTotal / 100 * 1.5) + 100).toLocaleString() }}</td>
                    </tr>
                  </thead>
                </table>
              </div>
              <div class="alert alert-info" v-if="newTotal && amountToPay">
                <span>Total Amount: &#8358;{{Number(newTotal).toLocaleString()}}</span>
              </div>
              <div class="alert alert-info" v-if="newTotal && amountToPay">
                <span :style="{float:'right'}">Grand Total Amount To Pay with Transaction charge: &#8358;{{Number(amountToPay).toLocaleString()}}</span>
              </div>
              <div class="text-center">
                <paystack
                  :amount="amountToPay * 100"
                  :email="payGatewayGenData.email"
                  :paystackkey="payGatewayGenData.paystack_key"
                  :reference="payGatewayGenData.reference"
                  :callback="callback_url"
                  :close="close"
                >
                  Make Payment
                </paystack>
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
import { closeNavbar, toggleAvatarDropDown } from "../../assets/js/helpers/utility";
import { mapActions, mapGetters } from 'vuex'
import paystack from "vue-paystack";
import axios, {MEMBER_ONLINE_PAYMENT_URL} from "../../store/api";

export default {
  name: 'PaymentPage',
  components: {
    HeaderNav,
    FooterBar,
    paystack
  },

  data:() =>({
    pageTitle: 'Make Payment',
    previousPage: 'Dashboard',
    memberPaymentDueList: [],
    newMemberPaymentDueList: [],
    memberPaymentList: [],
    newTotal: 0.0,
    amountToPay: 0.0,
    payGatewayGenData: [],
    total: 0.0,
    hideDiv: false,
    error_message: '',
    payment_date: '',
    transactionCompleted: false
  }),

  methods: {
    ...mapActions("app/member_online_payment", ["getMemberPaymentBySocietyID", "saveMemberPayment"]),
    ...mapActions("app/auth", ["getSelf"]),
    
    sendPaymentEventHandler(){
      const formData = {
        society_id: parseFloat(this.$route.params.society_id),
        payments:this.$data.memberPaymentDueList.map(mpdl=>{
          return {
            "payment_type_id": mpdl.id,
            "amount_paid": parseFloat(mpdl.min_amount)
          }// end object
        })// end map
      }// end formData object
      this.saveMemberPayment(formData)
      .then(response => {
        if (response){
          this.$data.memberPaymentList = response.data.payments
          this.$data.newTotal = response.data.total
          this.$data.amountToPay = response.data.amountToPay
          this.$data.payGatewayGenData = response.data.payGatewayGenData
          this.$data.hideDiv = true
        }
      })
    },

    close: () => {
      this.$toasted.show(`Payment cancelled`, { 
        type: "error", 
        icon: 'check-circle'
      })
    },

    callback_url(response) {
      if (response.status == 'success'){
        axios.get(
          `${MEMBER_ONLINE_PAYMENT_URL.send_payment_data_to_paystack}/${response.reference}`, 
          {timeout: 80000, timeoutErrorMessage: 'Connection Timeout'}
        )
        .then(data=>{
          if (data.status == 200){
            this.$data.transactionCompleted = true
            this.$router.push(`/payment/status/${response.status}/${this.$data.transactionCompleted}`)
            this.$toasted.show(`Payment made successfully`, { 
              type: "success", 
              icon: 'check-circle'
            })
          } else {
            this.$data.transactionCompleted = false
            this.$router.push(`/payment/status/${response.status}/${this.$data.transactionCompleted}`)
          }
        })
      } else {
        this.$data.transactionCompleted = false
        this.$router.push(`/payment/status/${response.status}/${this.$data.transactionCompleted}`)
        this.$toasted.show(`Payment not successful`, { 
          type: "error", 
          icon: 'check-circle'
        })
      }
      // this.$router.push(`/payment/status/${response.status}/${this.$data.transactionCompleted}`)
    },

    showDiv() {
      this.$data.hideDiv = false
    }
  },

  computed:{
    ...mapGetters("app/member_online_payment", {paymentIsLoading:"isLoading", paymentFetchError:"error"}),
  },
  
  created(){
    const society_id = this.$route.params.society_id
  
    this.getMemberPaymentBySocietyID({society_id:society_id})
    .then(response=>{
      if (response){
        this.$data.memberPaymentDueList = response.memberPaymentDueList
        this.$data.total = response.total
        this.$data.payment_date = response.identifier
      }
    })
  }
 
}
</script>
