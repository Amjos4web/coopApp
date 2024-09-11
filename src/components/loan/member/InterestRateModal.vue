<template>
   <div class="modal fade" id="interestRateModal" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <!-- Modal content no 1-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Change interest rate for {{ memberName }}</h4>
        </div>
        <form @submit.prevent="updateInterestRateEventHandler()">
          <div class="modal-body padtrbl">
            <div class="container">
              <div class="row">
                <div v-if="getLoanIsLoading">
                    <div class="text-center">
                      <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
                    </div>
                  </div>
                  <div v-if="getLoanError">
                    <div class="error-div">
                      <span>
                        {{ getLoanError.message }}
                      </span>
                    </div>
                  </div>
                <div class="col-md-6 col-md-offset-3">
                  <div class="form-group">
                    <label for="new interest rate">Interest Rate</label>
                    <input type="text" class="form-control" v-model="interestRate">
                  </div>
                  <span class="error" v-if="getLoanError && getLoanError.errors && getLoanError.errors.interest_rate">
                    {{ getLoanError.errors.interest_rate[0] }}
                  </span>
                </div>
              </div>
            </div>
            <div class="text-center modal-footer">
              <input type="submit" value="Save" class="btn btn-primary ml-20">
              <button type="button" id="continue" class="btn btn-warning ml-20" data-dismiss="modal">Cancel</button>
            </div>
          </div>
         </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import Validator from 'validatorjs'

const ID = String | Number
const InterestRate = String | Number

export default {
  name: 'interest-rate',
  props: {
    memberName: String,
    loan_request_id: ID,
    interest_rate: InterestRate, 
    getLoanIsLoading: Boolean,
    getLoanError: Error,
    updateParentComponentForInterestRateChange: Function
  },
  data:()=> {
    return{
       interestRate: 0
    }
  },

  watch:{
    interest_rate(newInterestRate){
      console.log(newInterestRate);
      this.$data.interestRate = newInterestRate
    }
  },

  methods: {
    ...mapActions("app/loan", ["updateLoanInterestRate"]),
    ...mapMutations("app/loan", ["setError"]),

    updateInterestRateEventHandler(){
      this.setError(null)

      let validation = new Validator({interest_rate:this.$data.interestRate}, {
        interest_rate: 'required|numeric'
      })

      if (validation.fails()){
        const error = new Error('You have error in your data, make neccessary change(s) and submit again')
        error.errors = validation.errors.errors
        this.setError(error)
      } else {
        console.log("I wwas here")
        this.updateLoanInterestRate({
          interest_rate:this.$data.interestRate, 
          loan_request_id:this.$props.loan_request_id
        })
        .then(data => {
          if (data){
            this.$props.updateParentComponentForInterestRateChange(true)
          }
        })
      }
    }
  },
}
</script>