<template>
   <div class="row">
     <div class="mb-20">
       <button class="btn btn-warning pull-right btn-sm" @click="openAddNewPaymentTypeModal()" :disabled="disableBtn">Add Payment Type</button><br/>
     </div>
     <hr/>
    <div class="col s12 text-center">
      <table id="custom-table">
        <tr>
          <th>Payment Type</th>
          <th>Amount</th>
          <th>Edit</th>
        </tr>
        <tr v-for="socMinAmt in societyPaymentMinAmounts" :key="socMinAmt.id">
          <td>{{ socMinAmt.payment_name }}</td>
          <td>&#8358;{{ socMinAmt.min_amount }}</td>
          <td>
            <button type="button" class="btn btn-info btn-sm" @click="editSocietyMinimumPaymentTypeEventHandler(socMinAmt.id)">Edit</button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'get-society-minimum-amount',
  props: {
    societyPaymentMinAmounts: Array,
    openAddNewPaymentTypeModal: Function,
    editSocietyMinimumPaymentTypeEventHandler: Function,
    disableBtn: Boolean
  },
  data(){
    return{
      
    }
  },

  created(){
    console.log(this.disableBtn)
  }
}
</script>