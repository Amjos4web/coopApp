<template>
    <div class="container mt-20">
      <div class="row">
        <div class="col-12 pull-right">
          <button class="btn btn-info pull-right btn-sm" @click="openAddNewPaymentTypeModal()" :disabled="disableBtn">
            <i class="fa fa-plus"></i>
            &nbsp;Add Payment Type
          </button>
        </div>
      </div>
      <hr/>
      <div class="row">
        <div class="col-12 text-center">
          <table id="custom-table">
            <tr>
              <th>Payment Type</th>
              <th>Amount</th>
              <th>Edit</th>
            </tr>
            <tr v-for="socMinAmt in societyPaymentMinAmounts" :key="socMinAmt.id">
              <td>{{ socMinAmt.payment_name }}</td>
              <td>&#8358;{{ Number(socMinAmt.min_amount).toLocaleString() }}</td>
              <td>
                <button type="button" class="btn btn-primary btn-sm" @click="editSocietyMinimumPaymentTypeEventHandler(socMinAmt.id)">Edit</button>
              </td>
            </tr>
          </table>
        </div>
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
  }
}
</script>