<template>
   <div class="modal fade" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <!-- Modal content no 1-->
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Loan payment history for {{ memberName }}</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="container">
            <div class="row text-center" v-if="getLoanIsLoading">
              <div class="col-md-6 m-auto">
                <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
              </div>
            </div>
            <div class="row">
              <div v-if="getLoanError">
                <div class="error-div">
                  <span>
                    {{ getLoanError.message }}
                  </span>
                </div>
              </div>
              <div class="col-md-8 m-auto">
                <table class="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>Amount Paid</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="h in loanPaymentHistory.history" :key="h.id">
                      <td>&#x20A6;{{ Number(h.amount_paid).toLocaleString() }}</td>
                      <td>{{ h.created_at }}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="text-center">
                  <div class="alert alert-info"><h4>Total Amount Given: &#x20A6;{{ Number(loanPaymentHistory.amount_given).toLocaleString() }}</h4></div>
                  <div class="alert alert-success"><h4>Total Loan Repaid: &#x20A6;{{ Number(loanPaymentHistory.total_loan_amount_repaid).toLocaleString() }}</h4></div>
                  <div class="alert alert-danger"><h4>Total Loan Amount Remaining: &#x20A6;{{ Number(loanPaymentHistory.total_loan_amount_remaining).toLocaleString() }}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

const ID = String | Number

export default {
  name: 'interest-rate',
  props: {
    memberName: String,
    loan_request_id: ID,
    getLoanIsLoading: Boolean,
    getLoanError: Error,
  },
  data:()=> {
    return{
      loanPaymentHistory : {
        history: [],
        total_loan_amount_repaid: 0.0,
        total_loan_amount_remaining: 0.0,
        amount_given: 0.0
      },
    }
  },
  
  watch: {
    loan_request_id(newLoanRequestID, oldLoanRequestID){
      if(newLoanRequestID.toString() !== oldLoanRequestID.toString()){
        this.getLoanPaymentHistoryForAdmin({loanRequestID:newLoanRequestID})
        .then(data=>{
          if (data){
           this.$data.loanPaymentHistory.history = data.history
           this.$data.loanPaymentHistory.total_loan_amount_remaining = data.total_loan_amount_remaining
           this.$data.loanPaymentHistory.total_loan_amount_repaid = data.total_loan_amount_repaid
           this.$data.loanPaymentHistory.amount_given = data.amount_given
          }
        })
      }
    }
  },
  methods: {
    ...mapActions("app/loan", ["getLoanPaymentHistoryForAdmin"]),
  },

}
</script>