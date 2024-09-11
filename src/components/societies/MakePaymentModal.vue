<template>
   <div class="modal fade" id="makePayment" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <!-- Modal content no 1-->
      <div v-if="societyPaymentIsLoading || societyIsLoading">
        <div class="text-center">
          <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
        </div>
      </div>
      <div class="modal-content" v-else>
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Monthly Due For {{meetingDateForModal ? meetingDateForModal : 'Unknown'}}</h4>
        </div>
        <div class="modal-body padtrbl">
          <form @submit.prevent="makePaymentEventHandler()">
            <div class="container" :style="{width: '100%;'}">
              <p>List of all monthly payments to be made by <b>{{meetingDateForModal ? meetingDateForModal : 'Unknown'}}</b> for today</p>
              <div class="table-responsive">
                <table class="table table-bordered table-hover make-payment" :style="{width:'60%', margin:'auto'}">
                    <thead>
                      <tr v-for="id in societyPayments.payment_ids" :key="id">
                        <th width="40%">{{ societyPayments.data[id].name }}</th>
                        <td width="60%">
                          <div class="input-field">
                            <input type="text" 
                              v-model="societyPayments.data[id].prevAmountPaid"
                            >
                            <label :for="societyPayments.data[id].name">Enter {{ societyPayments.data[id].name }} Amount &#x20A6;</label>
                            <span class="error-message"></span>
                          </div>
                        </td>
                      </tr>
                    </thead>
                 </table>
                <div class="text-center">
                  <input type="submit" name="makePayment" class="btn-general" value="Save">
                </div>
              </div>
            </div>
          </form>
        </div>
        <!-- <div class="modal-footer">
          <button type="button" class="btn btn-default pull-right cancel" data-dismiss="modal" id="cancel">Cancel</button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

const ID = String | Number
export default {
  name: 'make-payment-modal',
  props: {
    societyPaymentDueList:Array,
    updateParent: Function,
    meetingDateForModal: String,
    meetingCalendarID: String,
    societyID: String
  },

  data(){
    return{
      //form:{},
      societyPayments: {
        payment_ids:[], 
        data:{}
      },
    }
  },

  methods:{
    ...mapActions("app/society_payment", ["saveSocietyPayments", "fetchSocietyMonthlyPayment"]),
    ...mapMutations("app/society_payment", ["setError"]),

    makePaymentEventHandler(){
      const formData = {
        society_id: this.$props.societyID,
        meeting_calendar_id: this.$props.meetingCalendarID,
        payments: this.$props.societyPaymentDueList.map(sp=>{
          return {
            "payment_type_id": sp.id,
            "amount_paid": this.$data.societyPayments.data[sp.id].prevAmountPaid
          }
        }) // end map
      } // end object

      this.saveSocietyPayments(formData)
      .then(result => {
        if (result){
          this.$props.updateParent(true)
        } 
      })
      console.log(formData)

    } // end function

    
  },

  watch: {
    meetingCalendarID(newMeetingCalendarID, oldMeetingCalendarID){
      if(newMeetingCalendarID != oldMeetingCalendarID){
        const data = this.$props.societyPaymentDueList.reduce((obj, item)=>{
          //prevVal.payment_ids.push(item.id)
          obj[item.id] = {prevAmountPaid:item.prevAmountPaid, name:item.name, amount_paid:''}
          return obj
        }, {})

        this.$data.societyPayments = {data, payment_ids:Object.keys(data)}
      }
      
    }
  },

  computed:{
    ...mapGetters("app/society_payment", {societyPaymentIsLoading:"isLoading", societyPaymentError:"error:"}),
    ...mapGetters("app/society", {societyIsLoading:"isLoading", societyError:"error"}),
  },
  updated(){
    console.log(this.$props.societyPaymentDueList)
  }
}
</script>