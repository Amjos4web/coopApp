<template>
    <tbody v-if="memberIsLoading || memberOnlinePaymentIsLoading">
     <tr>
       <td colspan="8">
         <div class="text-center" :style="{width: '100%'}">
          <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>
          <small>Fetching data...</small>
        </div>
       </td>
     </tr>
   </tbody>
    <tbody v-else>
      <tr v-for="payment in onlinePayments" :key="payment.id">
        <td>
          <div class="bubble" v-if="payment.res_code == '00'">
            <span class="bubble-success"></span>
          </div>
          <div class="bubble" v-else>
            <span class="bubble-failed"></span>
          </div>
        </td>
        <td>{{ payment.member_name }}</td>
        <td>{{ payment.member_society}}</td>
        <td>&#x20A6;{{ Number(payment.amount_paid).toLocaleString() }}</td>
        <td>{{ payment.res_desc }}</td>
        <td>{{ payment.reference_no }}</td>
        <td>{{ payment.tran_start_date }}</td>
        <td>
          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Actions
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a href="#" class="dropdown-item" @click="verifyPaymentEventHandler(payment.member_name, payment.reference_no)">
                Verify Payment
              </a>
             
              <a href="#" class="dropdown-item" @click="openChangeRefNoModal(payment.member_name, payment.id)">
                Change Ref. No
              </a>
            </div>
          </div>
        </td>
        
      </tr>
      <tr :style="{fontSize: '18px'}">
        <th>Total</th>
        <td colspan="7" :style="{textAlign: 'center'}">&#x20A6;{{ Number(total).toLocaleString() }}</td>
      </tr>
    </tbody>
</template>

<script>

export default {
  name: 'online-payment-record-list',
  props: {
    onlinePayments: Array,
    total: Number,
    memberIsLoading: Boolean,
    memberOnlinePaymentIsLoading: Boolean,
    openChangeRefNoModal: Function,
    verifyPaymentEventHandler: Function
  }
}
</script>