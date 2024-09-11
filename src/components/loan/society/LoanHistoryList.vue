<template>
  <tbody>
    <tr class="tcontent" v-for="loan in loanHistory" :key="loan.id" :id="loan.id">
      <td>{{ loan.date }}</td>
      <td>&#x20A6;{{ loan.amountRequested }}</td>
      <td>&#x20A6;{{ loan.amountPaidBack }}</td>
      <td>&#x20A6;{{ loan.amountOwing }}</td>
      <td>&#x20A6;{{ loan.amountOwing }}</td>
      <td>
        <button type="button" class="btn btn-info" data-target="#loanHistoryModal" data-toggle="modal">View History</button>
      </td>
      <td><label class="in-progress">In Progress</label></td>
    </tr> 
  </tbody>  
</template>
<script>

export default {
  name: 'loan-history',
  props: ['loanHistory']
}
</script>