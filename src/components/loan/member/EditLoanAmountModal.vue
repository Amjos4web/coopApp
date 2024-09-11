<template>
   <div class="modal fade" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <!-- Modal content no 1-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Edit loan amount history for {{ memberName }}</h4>
        </div>
        <form @submit.prevent="updateLoanAmountEventHandler()">
          <div class="modal-body padtrbl">
            <div class="container">
              <div class="row">
                 <div v-if="successMsg">
                  <div class="success-div text-center">
                    <span>
                      {{ successMsg }}
                    </span>
                  </div>
                </div>
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
                  <div v-if="fetchManyMemberError">
                    <div class="error-div">
                      <span>
                        {{ fetchManyMemberError }}
                      </span>
                    </div>
                  </div>
                <div class="col-md-8 col-md-offset-2">
                 <table class="table table-striped table-bordered">
                   <thead>
                     <tr>
                       <th>Amount Given</th>
                       <th>Date</th>
                       <th>Issued By</th>
                       <th>Edit</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr v-for="h in loanGivenAmountHistory" :key="h.id">
                       <td>&#x20A6;{{ h.amount_given }}</td>
                       <td>{{ h.created_at}}</td>
                       <td>{{ h.issueBy }}</td>
                       <td>
                        <button type="button" class="btn btn-warning btn-sm"
                          @click="getLoanGivenAmountAndID(h.amount_given, h.id)">
                          Edit Amount
                        </button>
                       </td>
                     </tr>
                   </tbody>
                 </table>
                </div>
                <div class="col-md-6 col-md-offset-3">
                  <span class="error" v-if="getLoanError && getLoanError.errors && getLoanError.errors.loan_given_amount_id">
                    {{ getLoanError.errors.loan_given_amount_id[0] }}
                  </span>
                  <div class="form-group">
                    <label for="new interest rate">Amount</label>
                    <input type="text" class="form-control" v-model="amount_given">
                  </div>
                  <span class="error" v-if="getLoanError && getLoanError.errors && getLoanError.errors.amount_given">
                    {{ getLoanError.errors.amount_given[0] }}
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

import {turnArrayToObject} from "../../../utility"

const ID = String | Number

let loanAmountGivenHistoryID = null

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
      amount_given: '',
      loanGivenAmountHistory : [],
      fetchManyMemberError:null,
      successMsg: ''
    }
  },
  
  watch: {
    loan_request_id(newLoanRequestID, oldLoanRequestID){
      this.$data.amount_given = ''
      loanAmountGivenHistoryID = null
      
      if(newLoanRequestID.toString() !== oldLoanRequestID.toString()){
        this.loanAmountGivenHistory({loanRequestID:newLoanRequestID})
        .then(data=>{
          //console.log(data)
          if (data){
            // get all IDs for user that granted the loan
            const grantedByIDs = data.map(d=>d.respond_to_by)
            this.fetchManyMember(grantedByIDs)
            .then(data2=>{
              //console.log(data2)
              const memberObj = turnArrayToObject(data2.members)
              //console.log(memberObj)
              this.$data.loanGivenAmountHistory = data.map(d=>{
                d.issueBy = (
                  memberObj[d.respond_to_by] 
                  ? memberObj[d.respond_to_by].name 
                  : "Unknown"
                )
                return d
              })
            })
            .catch(e=>this.$data.fetchManyMemberError=e)
          }
        })
      }
    }
  },
  methods: {
    ...mapActions("app/loan", ["loanAmountGivenHistory", "updateLoanAmountGivenHistory"]),
    ...mapMutations("app/loan", ["setError"]),
    ...mapActions("app/member", ["fetchManyMember"]),

    getLoanGivenAmountAndID(loan_given_amount, loan_given_amount_id){
      
      console.log({loan_given_amount, loan_given_amount_id})

      this.$data.amount_given = loan_given_amount
      loanAmountGivenHistoryID = loan_given_amount_id
    },

    updateLoanAmountEventHandler(){
      this.setError(null)

      let validation = new Validator(
        {
          amount_given:this.$data.amount_given,
          loan_given_amount_id: loanAmountGivenHistoryID
        }, 
        {
          amount_given: 'required|numeric',
          loan_given_amount_id: 'required|numeric'
        }
      )

      if (validation.fails()){
        const error = new Error('You have error in your data, make neccessary change(s) and submit again')
        //console.log(validation.errors.errors);
        error.errors = validation.errors.errors
        if(validation.errors.errors.loan_given_amount_id){
          error.errors.loan_given_amount_id = ["Select loan given amount to edit"]
        }
        this.setError(error)
      } else {
        this.updateLoanAmountGivenHistory({formData:{amount_given:this.$data.amount_given}, loanAmountGivenHistoryID})
        .then(data => {
          console.log(data)
          if (data){
            this.$data.loanGivenAmountHistory = this.$data.loanGivenAmountHistory.map(d=>{
              console.log({data_id:data.id.toString(), id:d.id.toString()})
              if(d.loan_request_id.toString() === data.loan_request_id.toString()){
                data.issueBy = d.issueBy;
                return data;
              }
              return d
            })
            this.$data.successMsg = 'Loan amount updated successfully'
            this.$data.amount_given = ''
            loanAmountGivenHistoryID = null
          }
        })
      }
    },
  },
  updated(){
    const getLoanError = this.getLoanError
    //console.error(getLoanError)
    if(getLoanError && getLoanError.errors){
      console.error(getLoanError.errors.loan_given_amount_id)
    }
  }
}
</script>