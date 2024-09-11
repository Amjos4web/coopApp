<template>
  <div class="modal fade" id="addPaymentType" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <!-- Modal content no 1-->
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{ modalTitle }}</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
          <form @submit.prevent="savePaymentType()">
            <div class="modal-body">
              <div class="container">
                <div class="row" v-if="error"> 
                  <div class="text-center error-div">
                    <span>
                      {{ error }}
                    </span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-8 m-auto">
                    <div v-if="isLoading">
                      <div class="text-center">
                        <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="payment types">Payment Types</label>
                      <select class="form-control" v-model="form.payment_type_id">
                        <option value="">Choose a payment type</option>
                        <option v-for="paymentType in paymentTypes" :key="paymentType.id" :value="paymentType.id">{{ paymentType.name }}</option>
                      </select>
                      <span class="error"  v-if="elementHasError('payment_type_id')">
                        {{ error.errors.payment_type_id[0] }}
                      </span>
                    </div>
                    <div class="form-group">
                      <label for="minimum amount">Min. Amount</label>
                      <input type="text" 
                      v-model="form.min_amount"
                      class="form-control"
                      >
                    </div>
                    <span class="error"  v-if="elementHasError('min_amount')">
                      {{ error.errors.min_amount[0] }}
                    </span>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <input type="submit" value="Save" class="btn btn-primary">
              <button type="button" class="btn btn-default pull-right cancel" data-dismiss="modal" id="cancel">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions , mapGetters, mapMutations } from 'vuex'
import Validator from 'validatorjs'

export default {
  name: 'add-new-payment-type-to-society-modal',
  props: {
    modalTitle: String,
    paymentTypes: Array,
    updateSocietyPaymentTypeOnParent: Function,
    currentSocietyPaymentMinAmt:Object
  },
  data(){
    const payment_type_id = this.$props.currentSocietyPaymentMinAmt.payment_type_id
    const min_amount = this.$props.currentSocietyPaymentMinAmt.min_amount
    return{
      errorDisplay: '',
      form: {
        payment_type_id,
        min_amount,
      }
    }
  },

  watch:{
    currentSocietyPaymentMinAmt(newVal, oldVal){
      this.$data.form = {
        min_amount:newVal.min_amount, 
        payment_type_id:newVal.payment_type_id
      }
    }
  },

  methods: {
    ...mapMutations("app/society_payment_minimum_amount", ["setError"]),

    savePaymentType(){
      this.setError(null)

      let validation = new Validator(this.$data.form, {
        payment_type_id: 'required',
        min_amount: 'required',
      });

      if (validation.fails()){
        const error = new Error("You have error in your data, make neccessary change(s) and submit again.")
        error.errors = validation.errors.errors;
        this.setError(error)
      } else {
        this.$props.updateSocietyPaymentTypeOnParent(this.$data.form)
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
    ...mapGetters("app/society_payment_minimum_amount", ["isLoading", "error"])
  },
}
</script>