<template>
 <tbody v-if="loanIsLoading">
     <tr>
       <td colspan="7">
         <div class="text-center" :style="{width: '100%'}">
          <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>
          <small>Fetching data...</small>
        </div>
       </td>
     </tr>
   </tbody>
   
  <tbody v-else-if="loanError">
    <tr>
      <td colspan="7">
        <div class="text-center" :style="{width: '100%'}">
          <small>Unable to fetch data</small>
        </div>
      </td>
     </tr>
  </tbody>
  <tbody v-else>
    <tr v-for="l in loanDetails" :key="l.id">
      <td>&#x20A6;{{ Number(l.amount_requested).toLocaleString() }}</td>
      <td>{{ l.societyName }}</td>
      <td>{{ l.interest_rate }}%</td>
      <td>{{ l.purpose }}</td>
      <td>
        <button type="button" class="btn btn-info" 
        @click="openLoanDetailsModal(l.id)" 
        >
        View History
        </button>
      </td>
      <td>
        <a class="btn btn-primary custom-link" :style="{color: '#ffffff'}">
          <router-link :to="'/myLoan/guarantors/' + l.id">
            Guarantors
          </router-link>
        </a>
      </td>
      <td v-if="l.status == 'granted'">
        <label class="granted">Granted</label>
      </td>
      <td v-else-if="l.status == 'pending'">
        <label class="pending in-process">Pending</label>
      </td>
      <td v-else-if="l.status == 'rejected'">
        <label class="pending rejected">Rejected</label>
      </td>
    </tr>
  </tbody>
</template>

<script>
export default {
  name: "loan-component",
  props: {
    loanDetails: Array,
    loanIsLoading: Boolean,
    loanError: Error,
    openLoanDetailsModal: Function
  }
}
</script>