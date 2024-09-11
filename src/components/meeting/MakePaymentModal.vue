<template>
   <div class="modal fade" id="makePayment" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <div v-if="memberPaymentError">
          <div class="error-div text-center">
            <span>
              {{memberPaymentError.message}}
            </span>
          </div>
        </div>
      <!-- Modal content no 1-->
      <div v-if="memberPaymentIsLoading || memberIsLoading">
        <div class="text-center">
          <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
        </div>
      </div>
      <div class="modal-content" v-else>
        <div class="modal-header">
          <h4 class="modal-title">Monthly Due For {{name ? name : 'Unknown'}}</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="makePaymentEventHandler()">
            <div class="container" :style="{width: '100%;'}">
              <div class="text-center">
                <p>List of all monthly payments to be made by <b>{{name ? name : 'Unknown'}}</b> for today</p>
              </div>
              
              <div class="table-responsive">
                <table class="styled-table make-payment" :style="{width:'80%', margin:'auto'}">
                    <thead>
                      <tr v-for="memberMonthlyPayment in memberPaymentDueList" :key="memberMonthlyPayment.id">
                        <th width="40%">{{ memberMonthlyPayment.name }}<br><label>Min. Amount expected to pay is &#8358;{{memberMonthlyPayment.min_amount }}</label></th>
                        <td width="60%">
                          <div class="form-group">
                            <label :for="memberMonthlyPayment.name">Enter {{ memberMonthlyPayment.name }} Amount &#x20A6;</label>
                            <input 
                              type="text" 
                              v-model="form[`${memberMonthlyPayment.id}`]"
                              class="form-control"
                            >
                            <span class="error-message"></span>
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
import { mapActions, mapGetters } from 'vuex'
const ID = String | Number
export default {
  name: 'make-payment-modal',
  
  props: {
    memberDueMonthlyPayment:Object,
    memberID: ID,
    updateParent: Function
  },

  data(){
    return{
      form: {
        // society_id: this.$route.params.society_id,
        // member_id: this.$props.memberID,
      },
      memberPaymentDueList: [],
      name:'',
    }
  },

  watch:{
    memberDueMonthlyPayment(newMemberDueMonthlyPayment, oldMemberDueMonthlyPayment){
      if(
        (newMemberDueMonthlyPayment.member_id !== oldMemberDueMonthlyPayment.member_id) 
        || 
        (newMemberDueMonthlyPayment.society_id !== oldMemberDueMonthlyPayment.society_id) 
      ){
        this.fetchMemberMonthlyPayment({
          society_id:newMemberDueMonthlyPayment.society_id,
          member_id:newMemberDueMonthlyPayment.member_id
        })
        .then(data=>{
          if(data){

            this.$data.form = data.memberPaymentDueList.reduce((prevVal, item)=>{
              prevVal[item.id] = item.prevAmountPaid
              return prevVal
            }, {})
            this.$data.memberPaymentDueList = data.memberPaymentDueList
          }
         
        })
      }
    },
    memberID(newMemberID, oldMemberID){
      if(newMemberID != oldMemberID){
        this.getOneMember(newMemberID)
        .then(data=>{
          this.$data.name = data.name
        })
      }
    }
  },

  methods:{
    ...mapActions("app/member_payment", ["fetchMemberMonthlyPayment", "saveMemberPayment"]),
    ...mapActions("app/member", ['getOneMember']),

    makePaymentEventHandler(){
      const formData = {
        society_id: this.$route.params.society_id,
        member_id: this.$props.memberID,
        payments:this.$data.memberPaymentDueList.map(mpdl=>{
          return {
            "payment_type_id": mpdl.id,
            "amount_paid": this.$data.form[mpdl.id]
          }// end object
        })// end map
      }// end formData object

      this.saveMemberPayment(formData)
      .then(result => {
        if (result){
          this.$props.updateParent(true);
        }
      })
    }
  },

  computed:{
    ...mapGetters("app/member_payment", {memberPaymentIsLoading:"isLoading", memberPaymentError:"error:"}),
    ...mapGetters("app/member", {memberIsLoading:"isLoading", memberError:"error"})
  },

}
</script>