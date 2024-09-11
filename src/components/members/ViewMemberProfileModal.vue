<template>
  <div class="modal fade" id="viewProfile" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <!-- Modal content no 1-->
      <div v-if="societyMemberIsLoading ||  fetchManySocietyIsLoading || societyName == ''">
        <div class="text-center">
          <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
        </div>
      </div>

      <div class="modal-content" v-else-if="societyMemberError || memberPaymentError || fetchManySocietyError">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Error Occured</h4>
        </div>
        <div class="modal-body padtrbl">
          <div class="container" :style="{width: '100%;'}">
            <div class="row">
              <div class="col-md-12 text-center error-div">
                <span>
                  {{(societyMemberError ? societyMemberError.message : fetchManySocietyError.message)}}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-content" v-else>
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">{{ member.name }} Profile Details</h4>
        </div>
        <div class="modal-body padtrbl">
          <div class="container" :style="{width: '100%;'}">
            <div class="row">
              <div class="col-md-12 text-center">
                <img src="@/assets/passports/avata.png" class="avatar">
              </div>
            </div>
            <div class="table-responsive">
              <table class="table table-striped table-hover table-bordered">
                <tbody>
                  <tr>
                    <th width="50%">Name</th>
                    <td>{{ member.name }}</td>
                  </tr>
                  <tr>
                    <th width="50%">Email Address</th>
                    <td id="email">{{ member.email }}</td>
                  </tr>
                  <tr>
                    <th width="50%">Phone Number</th>
                    <td id="phone">{{ member.phone }}</td>
                  </tr>
                  <tr>
                    <th width="50%">Residential Address</th>
                    <td id="address">{{ member.address }}</td>
                  </tr>
                  <tr>
                    <th width="50%">Can Make Payment</th>
                    <td id="makePayment">{{ member.can_pay ? 'Yes' : 'No' }}</td>
                  </tr>
                  <tr>
                    <th>Society</th>
                    <td id="society">{{ societyName }}</td>
                  </tr>
                 
                </tbody>
              </table>
            </div>
            <div class="text-center col-md-6 col-md-offset-2 mb-20">
              <select class="form-control" @change="getTotalAsset($event)">
                <option value=""></option>
                <option v-for="s in societies" :value="s.id" :key="s.id">{{ s.name }}</option>
              </select>
              <div v-if="memberPaymentIsLoading">
                <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
              </div>
              <div v-else-if="memberPaymentError">
                <div class="error-div">
                  <span>{{memberPaymentError.message}}</span>
                </div>
              </div>
              <div v-else>
                <h4>Total Asset: &#8358;{{totalAsset}}</h4>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default pull-right cancel" data-dismiss="modal" id="cancel">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'view-member-profile-modal',
  props: ["member"],
  data:()=>({fetchManySocietyError:null, societyName:'', societies: [], totalAsset:0.0}),
  methods:{
    ...mapActions("app/society_member", ['fetchAllSocietyToWhichMemberBelongsForAdmin']),
    ...mapActions("app/member_payment", ['fetchMemberTotalAsset']),
    ...mapActions("app/society", ['fetchManySociety']),
    getTotalAsset(event){
      
      const val = event.target.value
      
      this.$data.totalAsset = 0.0

      if (val != ""){
        this.fetchMemberTotalAsset({ society_id : val, member_id : this.$props.member.id})
        .then(data => {
          console.log(data)
          if(data){
            this.$data.totalAsset = data.totalAsset
          }
        })
      }
      
    }
  },
  computed:{
    ...mapGetters("app/society_member", {societyMemberIsLoading:"isLoading", societyMemberError:"error"}),
    ...mapGetters("app/member_payment",{memberPaymentIsLoading:"isLoading", memberPaymentError:"error"}),
    ...mapGetters('app/society', {fetchManySocietyIsLoading:'isLoading'}),
  },
  watch:{
    member(newMember, oldMember){
      if(newMember.id != oldMember.id){
        this.$data.societyName = ''
        this.$data.totalAsset = 0.0
        //fetch member society
        this.fetchAllSocietyToWhichMemberBelongsForAdmin({member_id:newMember.id})
        .then(data=>{
          if(data){
            if(data.societyMembers.length < 1){
              this.$data.societyName = "No Society Yet"
            }else{
              this.fetchManySociety(data.societyMembers.map(sm=>sm.society_id))
              .then(data=>{
                
                if(data){
                  this.$data.societyName = data.societies.reduce((prevVal, s)=>{
                    prevVal.push(s.name);
                    return prevVal;
                  }, []).join(", ")

                  this.$data.societies = data.societies.map(s=>({name:s.name, id:s.id}))
                }
              })
              .catch(e=>this.$data.fetchManySocietyError=e)
            }//end else
          }//end if
        })//end then

        //fetch member total assets

        //this.fetchMemberTotalAsset({member_id})
      }//end if
    }
  }
}
</script>