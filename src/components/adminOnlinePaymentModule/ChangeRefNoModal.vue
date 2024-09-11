<template>
   <div class="modal fade" id="interestRateModal" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <!-- Modal content no 1-->
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Change reference number for {{ memberName }}</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <form @submit.prevent="changeRefNoEventHandler()">
          <div class="modal-body">
            <div class="container">
              <div class="row">
                <div class="col-12">
                  <div v-if="memberOnlinePaymentError">
                    <div class="error-div">
                      <span>
                        {{ memberOnlinePaymentError.message }}
                      </span>
                    </div>
                  </div>
                  <div v-if="errorMessage">
                    <div class="error-div">
                      <span>
                        {{ errorMessage }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-8 m-auto">
                  <div class="form-group">
                    <label for="new reference">New Reference No</label>
                    <input type="text" class="form-control" v-model="reference_no">
                  </div>
                  
                </div>
              </div>
            </div>
            <div class="text-center modal-footer">
              <input type="submit" value="Update" class="btn btn-primary ml-20">
              <button type="button" class="btn btn-warning ml-20" data-dismiss="modal">Cancel</button>
            </div>
          </div>
         </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

const pID = String | Number

export default {
  name: 'change-reference-number',
  props: {
    memberName: String,
    paymentID: pID,
    memberOnlinePaymentError: Error,
    updateParentComponentForRefNoChange: Function
  },
  data:()=> {
    return{
       reference_no: '', 
       errorMessage: ''
    }
  },

  watch:{
    reference_no(newReferenceNo){
      this.$data.reference_no = newReferenceNo
    }
  },

  methods: {
    ...mapActions("app/member_online_payment", ["changeReferenceNo"]),

    changeRefNoEventHandler(){
      if (this.$data.reference_no == ''){
        this.$data.errorMessage = 'Please enter the new reference number'
      } else {
         this.changeReferenceNo({payment_id:this.$props.paymentID, reference_no:this.$data.reference_no})
        .then(response => {
          if (response){
            this.$props.updateParentComponentForRefNoChange(response, true)
            this.$data.reference_no = ''
          }
        })
        this.$data.errorMessage = ''
      }
    }
  },
}
</script>