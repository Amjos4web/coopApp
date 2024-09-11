<template>
   <div class="modal fade" id="interestRateModal" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <!-- Modal content no 1-->
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Payment Verification for {{ memberName }}</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="container">
          <div class="row">
            <div class="col-md-8 m-auto">
              <div class="table-responsive">
                <table class="table table-striped table-bordered">
                  <tr>
                    <th>Status</th>
                    <td>{{ verifiedPaymentData.status }} </td>
                  </tr>
                  <tr>
                    <th>Amount</th>
                    <td>&#x20A6;{{ Number(verifiedPaymentData.amount).toLocaleString() }} </td>
                  </tr>
                </table>
                <table class="styled-table">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Message</th>
                    </tr>
                    <tr v-for="p in verifiedPaymentData.history" :key="p.time">
                      <td>{{ p.type }}</td>
                      <td>{{ p.message}}</td>
                    </tr>
                  </thead>
                  <tbody>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'verify-payment-modal',
  props: {
    memberName: String,
    verifiedPaymentData: Object
  },
}
</script>