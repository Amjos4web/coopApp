<template>
   <div class="modal fade" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <!-- Modal content no 1-->
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add new loan amount for {{ memberName }}</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <form @submit.prevent="addNewLoanAmountEventHandler()">
          <div class="modal-body">
            <div class="container">
              <div class="row text-center" v-if="getLoanIsLoading || getOneMemberIsLoading">
                <div class="col-12">
                  <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
                </div>
              </div>
              <div class="row">
                 <div v-if="successMsg">
                  <div class="success-div text-center">
                    <span>
                      {{ successMsg }}
                    </span>
                  </div>
                </div>
                  <div v-if="getLoanError">
                    <div class="error-div">
                      <span>
                        {{ getLoanError.message }}
                      </span>
                    </div>
                  </div>
                  <div v-if="getOneMemberError">
                    <div class="error-div">
                      <span>
                        {{ getOneMemberError.message }}
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
                <div class="col-md-8 m-auto">
                 <table class="styled-table">
                   <thead>
                     <tr>
                       <th>Amount Given</th>
                       <th>Date</th>
                       <th>Issued By</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr v-for="h in loanGivenAmountHistory" :key="h.id">
                       <td>&#x20A6;{{ Number(h.amount_given).toLocaleString() }}</td>
                       <td>{{ h.created_at}}</td>
                       <td>{{ h.issueBy }}</td>
                     </tr>
                   </tbody>
                 </table>
                </div>
                <div class="col-md-6 m-auto">
                  <div class="form-group">
                    <label for="new interest rate">New Loan Amount</label>
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

export default {
  name: 'add-new-loan-amount',
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
     
      if(newLoanRequestID.toString() !== oldLoanRequestID.toString()){
        this.loanAmountGivenHistory({loanRequestID:newLoanRequestID})
        .then(data=>{
          if (data){
            // get all IDs for user that granted the loan
            const grantedByIDs = data.map(d=>d.respond_to_by)
            this.fetchManyMember(grantedByIDs)
            .then(data2=>{
              const memberObj = turnArrayToObject(data2.members)
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
    ...mapActions("app/loan", ["loanAmountGivenHistory", "giveMoreLoanToMember"]),
    ...mapMutations("app/loan", ["setError"]),
    ...mapActions("app/member", ["fetchManyMember", "getOneMember"]),

    addNewLoanAmountEventHandler(){
      this.setError(null)

      let validation = new Validator(
        {
          amount_given:this.$data.amount_given,
          loan_given_amount_id: this.$props.loan_request_id
        }, 
        {
          amount_given: 'required|numeric',
          loan_given_amount_id: 'required|numeric'
        }
      )

      if (validation.fails()){
        const error = new Error('You have error in your data, make neccessary change(s) and submit again')
        error.errors = validation.errors.errors
        this.setError(error)
      } else {
        this.giveMoreLoanToMember({formData:{amount_given:this.$data.amount_given}, loanRequestID:this.$props.loan_request_id})
        .then(data => {
          if (data){
            this.getOneMember(data.respond_to_by)
            .then(member => {
              data.issueBy = member.name;
              this.$data.loanGivenAmountHistory = [data, ...this.$data.loanGivenAmountHistory]
            })
          
            this.$toasted.show('New loan amount granted successfully', { 
              type: "success", 
              icon: 'check-circle'
            })
            this.$data.amount_given = ''
          }
        })
      }
    },
  },

  computed: {
    ...mapGetters("app/member", {getOneMemberIsLoading:'isLoading', getOneMemberError:'error'})
  }

}
</script>