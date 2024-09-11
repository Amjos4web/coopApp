<template>
   <div class="modal fade" id="makePayment" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <!-- Modal content no 1-->
      <div v-if="memberPaymentIsLoading || memberIsLoading">
        <div class="text-center">
          <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
        </div>
      </div>
      <div class="modal-content" v-else>
        <div class="modal-header">
          <h4 class="modal-title">Editing Monthly Payment</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div v-if="memberPaymentError">
          <div class="error-div text-center">
            <span>
              {{memberPaymentError.message}}
            </span>
          </div>
        </div>
        <div class="modal-body">
          <form @submit.prevent="makePaymentEventHandler()">
            <div class="container" :style="{width: '100%;'}">
              <div class="table-responsive">
                <table class="styled-table make-payment" :style="{width:'60%', margin:'auto'}">
                    <thead>
                      <tr v-for="id in memberPayments.payment_ids" :key="id">
                        <th width="40%">{{ memberPayments.data[id].name }}<br><label>Min. Amount expected to pay is &#8358;{{memberPayments.data[id].prevAmountPaid }}</label></th>
                        <td width="60%">
                          <div class="form-group">
                            <input 
                              type="text" 
                              v-model="memberPayments.data[id].prevAmountPaid"
                              class="form-control"
                            >
                            <label :for="memberPayments.data[id].name">Enter {{ memberPayments.data[id].name }} Amount &#x20A6;</label>
                          </div>
                        </td>
                      </tr>
                    </thead>
                 </table>
                <div class="text-center mt-10">
                  <input type="submit" name="makePayment" class="btn btn-primary" value="Save">
                </div>
              </div>
            </div>
          </form>
        </div>
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
    memberPaymentDueList:Array,
    updateParent: Function,
    meetingDateForModal: String,
    meetingCalendarID: String,
    societyID: String,
    memberID:String
  },

  data(){
    return{
      //form:{},
      memberPayments: {
        payment_ids:[], 
        data:{}
      },
    }
  },

  methods:{
    ...mapActions("app/member_payment", ["updateMemberPayment", "fetchMemberMonthlyPayment"]),
    ...mapMutations("app/member_payment", ["setError"]),

    makePaymentEventHandler(){
      const formData = {
        society_id: this.$props.societyID,
        member_id: this.$props.memberID,
        payments: this.$props.memberPaymentDueList.map(sp=>{
          return {
            "payment_type_id": sp.id,
            "amount_paid": this.$data.memberPayments.data[sp.id].prevAmountPaid
          }
        }) // end map
      } // end object

      this.updateMemberPayment({formData:formData, meeting_calendar_id: this.$props.meetingCalendarID,})
      .then(result => {
        if (result){
          this.$props.updateParent(true)
        } 
      })

    } // end function 
  },

  watch: {
    meetingCalendarID(newMeetingCalendarID, oldMeetingCalendarID){
      if(newMeetingCalendarID != oldMeetingCalendarID){
        const data = this.$props.memberPaymentDueList.reduce((obj, item)=>{
          //prevVal.payment_ids.push(item.id)
          obj[item.id] = {prevAmountPaid:item.prevAmountPaid, name:item.name, amount_paid:''}
          return obj
        }, {})

        this.$data.memberPayments = {data, payment_ids:Object.keys(data)}
      }
      
    }
  },

  computed:{
    ...mapGetters("app/member_payment", {memberPaymentIsLoading:"isLoading", memberPaymentError:"error"}),
    ...mapGetters("app/member", {memberIsLoading:"isLoading", memberError:"error"})
  },

}
</script>