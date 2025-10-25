<template>
    <div class="modal fade" id="updateAssWithModal" role="dialog" style="border-radius: 5px;">
      <div class="modal-dialog modal-lg">
        <div v-if="assetWithdrawalIsLoading">
          <div class="text-center">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
          </div>
        </div>
        <!-- Modal content no 1-->
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Edit Asset Withdrawal for {{ memberName }}</h4>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-8 m-auto">
                  <div v-if="assetWithdrawalError"> 
                    <div class="text-center error-div">
                      <span>
                        {{ assetWithdrawalError }}
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
                  
                  <form @submit.prevent="updateAssetWithdrawalEventHandler()">
                    <div class="row">
                        <label for="payment_type">Payment Type</label>
                      <select class="form-control" v-model="form.payment_type_id">
                        <option value="">Select Payment Type</option>
                        <option v-for="pt in paymentTypes" :key="pt.id" :value="pt.id">{{ pt.name }}</option>
                      </select>
                      <br><br>
                      <label for="amount">Amount</label>
                      <input type="text" v-model="form.amount" class="form-control">
                    </div>
                    <div class="text-center mt-10">
                      <input type="submit" value="Update" class="btn btn-primary" :style="{color:'#ffffff'}">
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
  import { mapActions, mapMutations } from 'vuex'
  import Validator from 'validatorjs'
  
  
  export default {
    name: 'update-asset-withdrawal-modal',
    props: {
			assetWithdrawal: Object,
			paymentTypes: Array,
      memberName: String,
      assetWithdrawalIsLoading: Boolean,
      assetWithdrawalError: Error,
      updateParentComponentForAssetWithdrawalChange: Function
    },
  
    data(){
      return{
        form: {
          payment_type_id: this.$props.assetWithdrawal.payment_type_id,
          amount: this.$props.assetWithdrawal.amount
        },
      }
    },

  
    methods: {
      ...mapActions("app/asset_withdrawal", ["updateAssetWithdrawal"]),
      ...mapMutations("app/asset_withdrawal", ["setError"]),
  
      updateAssetWithdrawalEventHandler(){
        this.setError(null)

        let validation = new Validator(this.$data.form, {
            payment_type_id: 'required|numeric',
						amount: 'required|numeric'
        })

        if (validation.fails()){
            const error = new Error('You have error in your data, make neccessary change(s) and submit again')
            error.errors = validation.errors.errors
            this.setError(error)
        } else {
					const asset_withdrawal_id = this.$props.assetWithdrawal.id
					if (asset_withdrawal_id){
						this.updateAssetWithdrawal({
							formData:this.$data.form, 
							asset_withdrawal_id:asset_withdrawal_id
						})
						.then(data => {
							if (data){
								const msg = data.msg
								const assetWithdrawal = data.data
								this.$props.updateParentComponentForAssetWithdrawalChange(msg, assetWithdrawal, true)
							}
						})
					}
        }
      }
    },

    watch:{
			assetWithdrawal(newAssetWithdrawal, oldAssetWithdrawal){
				this.$data.form = {payment_type_id:newAssetWithdrawal.payment_type_id, amount:newAssetWithdrawal.amount}
			}
    },
  }
  </script>