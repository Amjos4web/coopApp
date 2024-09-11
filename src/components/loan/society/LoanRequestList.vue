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
    <tr v-for="(loan, index) in loanRequests" :key="loan.id">
      <td>{{ (((currentPage - 1) * limit) + ((index) + 1)) }}</td>
      <td>{{ loan.society_name }}</td>
      <td>&#x20A6;{{ Number(loan.amount_requested).toLocaleString()}}</td>
      <td>{{ loan.interest_rate }}%</td>
      <td>
        <a class="btn btn-info custom-link">
          <router-link :to="'/loan/society/details/' + loan.id">
            View Details
          </router-link>
        </a>
      </td>
      <td>
        <div class="dropdown">
          <button class="btn btn-info dropdown-toggle" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Actions
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a href="#" class="dropdown-item" @click="openLoanInterestRateModal(loan.society_name, loan.id, loan.interest_rate)">
              Int. Rate
            </a>
            <a href="#"  class="dropdown-item" @click="openLoanAmountHistoryEditModal(loan.society_name, loan.id)">
              Amt. Granted
            </a>
            <a href="#"  class="dropdown-item" @click="openAddNewLoanAmountModal(loan.society_name, loan.id)">
              Add To Loan
            </a>
            <a href="#"  class="dropdown-item" @click="openLoanPaymentHistoryModal(loan.society_name, loan.id)">
              Repayment History
            </a>
          </div>
        </div>
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