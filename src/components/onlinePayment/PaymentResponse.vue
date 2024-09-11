<template>
  <div>
    <HeaderNav/>
			<div id="content-page" class="content-page">
        <div class="card">
          <div class="card-body">
            <h3 :style="{fontSize: '18px', textTransform:'uppercase'}" class="card-title" v-if="payment_status == 'success'">Payment Successful</h3>
            <h3 :style="{fontSize: '18px', textTransform:'uppercase'}" class="card-title" v-else-if="payment_status == 'error'">Payment Unsuccessful</h3>
            <h3 :style="{fontSize: '18px', textTransform:'uppercase'}" class="card-title" v-else> Unknown Response</h3>
            <div class="row">
              <div class="col-md-8 m-auto text-center">
                <div class="alert alert-warning" v-if="payment_status == 'success' && !transaction_completed">
                  <p :style="{fontSize: '16px'}">Oops!!! Unable to complete your payment successfully</p>
                  <small>If you have been debited and still shows that you haven't paid, kindly send your payment receipt or reference number to ictsupport@ogbomosooluwalosecicu.com.ng or contact any of the management</small>
                </div>
                <div class="alert alert-success" v-if="payment_status == 'success' && transaction_completed">
                  <p :style="{fontSize: '16px'}">Congratulations!!! Your payment was successful</p>
                  <small>If you have been debited and still shows that you haven't paid, kindly send your payment receipt or reference number to ictsupport@ogbomosooluwalosecicu.com.ng or contact any of the management</small>
                </div>
                <div class="alert alert-danger" v-else-if="payment_status == 'error'">
                  <p :style="{fontSize: '16px'}">Oops!!! Your payment was not successful</p>
                  <small>If you have been debited and still shows that you haven't paid, kindly send your payment receipt or reference number to ictsupport@ogbomosooluwalosecicu.com.ng or contact any of the management</small>
                </div>
                <div class="alert alert-warning" v-else>
                  <p :style="{fontSize: '16px'}">Oops!!! Unknown response</p>
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

export default {
  name: 'PaymentResponse',
  components: {
    HeaderNav,
    FooterBar,
  },

  data:() =>({
    pageTitle: 'Payment Response',
    previousPage: 'Dashboard',
    payment_status: '',
    transaction_completed: ''
  }),

  created(){
    const payment_status = this.$route.params.payment_status
    const transaction_completed = this.$route.params.transaction_completed
    this.$data.transaction_completed = transaction_completed
    this.$data.payment_status = payment_status
  }
 
}
</script>
