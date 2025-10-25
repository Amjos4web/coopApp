<template>
  <div class="modal fade" id="addPaymentTypesModal" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <form @submit.prevent="savePaymentType()">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Payment Type</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
          <div v-if="isLoading">
            <div class="text-center">
              <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
            </div>
          </div>
          <div v-if="error"> 
            <div class="text-center error-div">
              <span>
                {{ error.message }}
              </span>
            </div>
          </div>
          <div class="modal-body">
            <div class="table-responsive">
              <table class="styled-table" :style="{width:'60%', margin:'auto'}">
                <thead>
                  <tr>
                    <th width="40%">Payment Name</th>
                    <td width="60%">
                      <div class="form-group">
                        <label for="user name">Enter payment name</label>
                        <input 
                        type="text" 
                        v-model="form.name"
                        class="form-control"
                        autofocus
                        >
                        
                        <span class="error" v-if="elementHasError('name')">
                          {{ error.errors.name[0] }}
                        </span>
                      </div>
                      <hr/>
                      <div class="form-group">
                        <label for="user name">Payment Type</label>
                        <select 
                        v-model="form.type" 
                        class="form-control"
                        >
                          <option value="">Select Payment Type</option>
                          <option value="loan interest">Loan Interest</option>
                          <option value="loan repaid">Loan Repaid</option>
                          <option value="asset">Asset</option>
                          <option value="minute">Minute</option>
                          <option value="other">Others</option>
                        </select>
                        <span class="error"  v-if="elementHasError('type')">
                          {{ error.errors.type[0] }}
                        </span>
                      </div>
                    </td>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" id="continue" class="btn btn-warning" data-dismiss="modal">Close</button>
            <input type="submit" class="btn btn-primary ml-10" value="Save">
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions , mapGetters, mapMutations } from 'vuex'
import Validator from 'validatorjs'

export default {
  name: 'add-payment-type-modal',
  props: ['updatePayTypesOnParent', 'paymentType'],

  data:function(){
    return { 
      form:{
        type:this.$props.paymentType.type, 
        name:this.$props.paymentType.name
      },//end form 
    }//end object
  },
  methods: {
    ...mapActions('app/payment_type', ['addNewPaymentType', 'updatePaymentType']),
    ...mapMutations("app/payment_type", ["setError"]),

    savePaymentType(){
      this.setError(null);
      let validation  = new Validator(this.$data.form, {
        name: 'required',
        type: 'required',
      });

      if (validation.fails()){
        const error = new Error("You have error in your data, make neccessary change(s) and submit again.")
        error.errors = validation.errors.errors;
        this.setError(error)
      } else {
        const id = this.$props.paymentType.id;
        //this is update since parent sent ID
        if(id){
          this.updatePaymentType({id, formData : this.$data.form})
          .then(role => {
            //if role is not null
            if(role){
              this.$props.updatePayTypesOnParent(role, true)
            }//end if
          })//end then method
        } 
        else {
          //add new payment type
          this.addNewPaymentType(this.$data.form)
          .then(paymentType => {
            //if payment type is not null
            if(paymentType){
              this.$props.updatePayTypesOnParent(paymentType, false)
            }//end if
          })//end then method
        }//end else
      }
    },

    elementHasError(elemID){
      return ((
        this.error 
        && this.error.errors 
        && this.error.errors[elemID] 
        && this.error.errors[elemID].length > 0
      ) ? true : false)
    }
  },
  computed: {
    ...mapGetters("app/payment_type", ["isLoading", "error"])
  },

  watch: {
    paymentType(newPaymentType){
      this.$data.form = {type:newPaymentType.type, name:newPaymentType.name}
    }
  }
}
</script>