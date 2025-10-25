<template>
    <div class="modal fade" id="selectMembers" role="dialog" style="border-radius: 5px;">
      <div class="modal-dialog modal-lg">
        <div v-if="assetWithdrawalIsLoading">
          <div class="text-center">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
          </div>
        </div>
        <!-- Modal content no 1-->
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">{{ modalTitle }}</h4>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-8 m-auto">
                  <div v-if="errorDisplay"> 
                    <div class="text-center error-div">
                      <span>
                        {{ errorDisplay }}
                      </span>
                    </div>
                  </div>
                  <div v-if="assetWithdrawalIsLoading">
                    <div class="text-center">
                      <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
                    </div>
                  </div>
                  <div class="text-center">
                    <span class="error" v-if="assetWithdrawalError">{{assetWithdrawalError.message}}</span>
                    <div v-if="assetWithdrawalIsLoading">
                      <div class="text-center">
                        <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
                      </div>
                    </div>
                  </div>
                  
                  <form @submit.prevent="saveAssetWithdrawalEventHandler()">
                    <div class="row">
                        <label for="payment_type">Payment Type</label>
                      <select class="form-control" v-model="form.payment_type_id">
                        <option value="">Select Payment Type</option>
                        <option v-for="pt in paymentTypes" :key="pt.id" :value="pt.id">{{ pt.name }}</option>
                      </select>
                      <br>
                      <label for="amount">Amount</label>
                      <input type="text" v-model="form.amount" class="form-control">
                      <input type="hidden" v-model="form.member_id">
                      <input type="hidden" v-model="form.society_id">
                    </div>
                    <div class="text-center mt-10">
                      <input type="submit" value="Withdraw" class="btn btn-warning">
                    </div>
                  </form><br>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions , mapGetters, mapMutations } from 'vuex'
  import Validator from 'validatorjs'
  
  const ID  = String | Number
  const societyID = String | Number
  
  export default {
    name: 'select-members-for-asset-withdrawal-modal',
    props: {
      modalTitle: String,
      paymentTypes: Array,
      errorDisplay: String,
      memberID: ID, 
      societyID: societyID,
      updateDataOnParent: Function
    },
  
    data(){
      return{
        form: {
          member_id: '',
          society_id: '',
          payment_type_id: '',
          amount: ''
        }
      }
    },
  
    methods: {
      ...mapActions("app/asset_withdrawal", ["saveAssetWithdrawal"]),
      ...mapMutations("app/asset_withdrawal", ["setError"]),
  
      saveAssetWithdrawalEventHandler(){
        this.$data.form = {
          member_id: this.$props.memberID,
          society_id: this.$props.societyID,
          payment_type_id: this.$data.form.payment_type_id,
          amount: this.$data.form.amount
        }
  
        this.setError(null)
  
        let validation = new Validator(this.$data.form, {
          member_id: 'required|numeric',
          society_id: 'required|numeric',
          payment_type_id: 'required|numeric',
          amount: 'required|numeric',
        })
  
        if (validation.fails()){
          const error = new Error("You have error in your data, make neccessary change(s) and submit again.")
          error.errors = validation.errors.errors;
          this.setError(error)
        } else {
          this.saveAssetWithdrawal(this.$data.form)
          .then((data)=>{
            if (data){
              this.$props.updateDataOnParent()
              this.$toasted.show(data.msg, {
                type: "success", 
                icon: 'check-circle'
              })
            } else {
              this.$toasted.show("Error has occured", {
                type: "error", 
                icon: 'check-circle'
              })
            }
          })
          this.$data.form.amount = ''
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
      ...mapGetters("app/asset_withdrawal", {assetWithdrawalError:"error", assetWithdrawalIsLoading:"isLoading"}),
    },

  }
  </script>