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
    <tr class="tcontent" v-for="(loan, index) in loanRequests" :key="loan.id">
      <td>{{ (((currentPage - 1) * limit) + ((index) + 1)) }}</td>
      <td>{{ loan.member_name }}</td>
      <td>{{ loan.member_society }}</td>
      <td>&#x20A6;{{ loan.member_asset }}</td>
      <td>&#x20A6;{{ loan.amount_requested}}</td>
      <td>
        <a class="btn btn-info custom-link">
          <router-link :to="'/loan/member/details/' + loan.id">
            View Details
          </router-link>
        </a>
      </td>
      <td>
        <a class="btn btn-info custom-link">
          <router-link :to="'/loan/member/guarantors/' + loan.id">
            Guarantors
          </router-link>
        </a>
      </td>
      <td v-if="loan.status == 'granted'">
        <label class="granted">Granted</label>
      </td>
      <td v-else-if="loan.status == 'pending'">
        <label class="pending in-process">Pending</label>
      </td>
      <td v-else>
        <label class="rejected">Rejected</label>
      </td>
      <td v-if="loan.status == 'granted'">
          <!-- <div class="dropdown">
            <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
              Actions <span class="caret"></span>
            </button>
            <ul class="dropdown-menu dropDown dropdown-right">
              <li>
                <button type="button" class="btn btn-default" 
                  @click="openLoanInterestRateModal(loan.member_name, loan.id, loan.interest_rate)">
                  Int. Rate
                </button>
              </li>
              <li>
                <button type="button" class="btn btn-default"
                   @click="openLoanAmountHistoryEditModal(loan.member_name, loan.id)">
                   Amt. Granted
                </button>
              </li>
              <li>
                <button type="button" class="btn btn-default"
                  @click="openAddNewLoanAmountModal(loan.member_name, loan.id)">
                  New Amount
                </button>
              </li>
              
              <li>
                <button type="button" class="btn btn-default"
                  @click="openLoanPaymentHistoryModal(loan.member_name, loan.id)">
                  Payment History
                </button>
              </li>
            </ul>
          </div> -->
          <div class="dropdown-2">
            <button class="dropbtn">
              Actions <i class="fa fa-arrow-down"></i>
            </button>
              <div class="dropdown-content-2">
                <a href="#" @click="openLoanInterestRateModal(loan.member_name, loan.id, loan.interest_rate)">
                  Int. Rate 
                </a>
                <a href="#"  @click="openLoanAmountHistoryEditModal(loan.member_name, loan.id)">
                  Amt. Granted
                </a>
                <a href="#" @click="openAddNewLoanAmountModal(loan.member_name, loan.id)">
                  New Amount 
                </a>
                <a href="#" @click="openLoanPaymentHistoryModal(loan.member_name, loan.id)">
                  Payment History
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