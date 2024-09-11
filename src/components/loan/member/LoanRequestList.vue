<template>
 <tbody v-if="getLoanIsLoading">
     <tr>
       <td colspan="9">
         <div class="text-center" :style="{width: '100%'}">
          <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>
          <small>Fetching data...</small>
        </div>
       </td>
     </tr>
   </tbody>
  <tbody v-else-if="getLoanError">
    <tr>
       <td colspan="9">
         <div class="text-center" :style="{width: '100%'}">
          <small>Unable to fetch data</small>
        </div>
       </td>
     </tr>
  </tbody>
  <tbody v-else>
    <tr v-for="loan in loanRequests" :key="loan.id">
      <td>
        <div class="bubble" v-if="loan.status == 'granted'">
          <span class="success-icon"></span>
        </div>
        <div class="bubble" v-else-if="loan.status == 'pending'">
          <span class="pending-icon"></span>
        </div>
        <div class="bubble" v-else>
          <span class="rejected-icon"></span>
        </div>
      </td>
      <td>{{ loan.member_name }}</td>
      <td>{{ loan.member_society }}</td>
      <td>&#x20A6;{{ Number(loan.member_asset).toLocaleString() }}</td>
      <td>&#x20A6;{{ Number(loan.amount_requested).toLocaleString() }}</td>
      <td>
        <a class="btn btn-info custom-link">
          <router-link :to="'/loan/member/details/' + loan.id">
            Details
          </router-link>
        </a>
      </td>
      <td>
        <a class="btn btn-primary custom-link">
          <router-link :to="'/loan/member/guarantors/' + loan.id">
            Guarantors
          </router-link>
        </a>
      </td>
     
      <td v-if="loan.status == 'granted'">
        <div class="dropdown">
          <button class="btn btn-danger dropdown-toggle" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Actions
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a href="#" class="dropdown-item" @click="openLoanInterestRateModal(loan.member_name, loan.id, loan.interest_rate)">
              Int. Rate
            </a>
            <a href="#"  class="dropdown-item" @click="openLoanAmountHistoryEditModal(loan.member_name, loan.id)">
              Amt. Granted
            </a>
            <a href="#"  class="dropdown-item" @click="openAddNewLoanAmountModal(loan.member_name, loan.id)">
              Add To Loan
            </a>
            <a href="#"  class="dropdown-item" @click="openLoanPaymentHistoryModal(loan.member_name, loan.id)">
              Repayment History
            </a>
          </div>
        </div>
      </td>
      <td v-else>
      </td>
    </tr>
  </tbody>
  
</template>

<script>


export default {
  name: 'loan-request-list',
  props: {
    loanRequests: Array,
    getLoanIsLoading: Boolean,
    getLoanError: Error,
    limit: Number,
    currentPage: Number,
    openLoanInterestRateModal: Function,
    openLoanAmountHistoryEditModal: Function,
    openAddNewLoanAmountModal: Function,
    openLoanPaymentHistoryModal: Function
  },

 
}
</script>