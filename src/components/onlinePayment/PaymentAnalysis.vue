<template>
  <div>
    <div v-if="paymentIsLoading">
      <div class="text-center mb-20" :style="{width: '100%'}">
        <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
      </div>
    </div>
    <div class="container" v-if="memberPaymentList.length > 0" ref="paymentAnalysis" id="paymentAnalysis">
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Payment Name</th>
              <th>Amount</th>
            </tr>
            <tr v-for="payment in memberPaymentList" :key="payment.id">
              <th>{{payment.name}}</th>
              <td>&#8358;{{Number(payment.amount).toLocaleString()}}</td>
            </tr>
          </thead>
        </table>
      </div>
      <div class="alert alert-info" v-if="newTotal && amountToPay">
        <span>Total Amount: &#8358;{{Number(newTotal).toLocaleString()}}</span>
      </div>
      <div class="alert alert-info" v-if="newTotal && amountToPay">
        <span :style="{float:'right'}">Amount To Pay: &#8358;{{Number(amountToPay).toLocaleString()}}</span>
      </div>
      <div class="text-center">
        <paystack
          :amount="newTotal * 100"
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
</template>

<script>
import paystack from "vue-paystack";

export default {
  name: 'PaymentAnalysis',
  components: {
    paystack
  },
  props: {
    memberPaymentList: Array,
    newTotal: Number,
    amountToPay: Number,
    payGatewayGenData: Object,
    callback_url: Function,
    close: Function,
    paymentIsLoading: Boolean
  }
}
</script>