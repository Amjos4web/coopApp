<template>
  <div>
    <HeaderNav/>
      <div id="content-page" class="content-page">
        <div v-if="memberIsLoading || societyMemberIsLoading">
          <div class="text-center">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
          </div>
        </div>
        <div class="container" v-else>
          <div class="row text-center">
            <div class="form-group col-sm-6 col-md-6 m-auto text-center">
              <label for="member name">Enter Member's Name</label>
              <input type="text" v-model="memberSearchMeta" @keyup="searchMember()" class="form-control">
            </div>
          </div>
          <span class="error" v-if="societyMemberError">{{societyMemberError.message}}</span>
          <span class="error" v-if="memberError">{{memberError.message}}</span>
          <SocietyMembersList :societyMembers="searchMemberResult"
          :currentSocietyID="currentSocietyID"
          :societyName="societyName"/>

          <div class="text-center">
            <a class="btn btn-warning custom-link">
              <router-link to="/payments/editMemberPayments">
                Back
              </router-link>
            </a>
          </div>
        </div>
      </div>
      <FooterBar/>
    </div> 
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import SocietyMembersList from '@/components/payments/SocietyMemberLists'
import { mapActions , mapGetters } from 'vuex'
import { turnArrayToObject } from '../../utility'

let dataResult = []
let serverData = []

export default {
  name: 'MemberListsForPaymentEdit',
  components: {
    HeaderNav,
    FooterBar,
    SocietyMembersList
  },
  data(){
    return{
      pageTitle: 'Members List',
      previousPage: 'Dashboard',
      successMsg: '',
      members: [],
      societyName:'',
      societyMembers: [],
      searchMemberResult: [],
      errorDisplay: '',
      currentSocietyID:this.$route.params.society_id,
      memberSearchMeta: '',
    } 
  },
  methods: {
    ...mapActions("app/society", [ "getOneSociety"]),
    ...mapActions(
      "app/society_member", [
        "fetchMemberInSociety", 
        "societyMemberIndex",  
      ]),
    ...mapActions("app/member", ['fetchManyMember']),
  
    fetchMembers(data) {
      if(data){
        const memberIDs = data.societyMembers.map(sm=>sm.member_id)

        this.fetchManyMember(memberIDs)
        .then(result=>{
          /**
           * if request is successful distribute using store resolve
           */
          //this.$data.societyMembers = result.members
          const store = turnArrayToObject(result.members)
          this.$data.searchMemberResult = data.societyMembers.map(sms=>{
            sms.member_name = store[sms.member_id] ? store[sms.member_id].name : 'Unknown'
            return sms
          })

          serverData = this.$data.searchMemberResult

          this.$data.searchMemberResult = dataResult = serverData
  
        })//end then
        .catch(e=>{
          this.setError(e)
        })
      }//end if
    },

    searchMember(){
      const searchValue = this.$data.memberSearchMeta.toLocaleLowerCase()
      this.$data.searchMemberResult = dataResult.filter(
        m=>(
          (m.member_name.toLocaleLowerCase().indexOf(searchValue) > -1) 
          && (m.id != dataResult.member_id)
        )
      )
    },

  },

  created(){
    this.getOneSociety(this.$data.currentSocietyID)
    .then(society=>{
      if (society){
        this.$data.societyName = society.name
      }
    })

    this.fetchMemberInSociety({society_id:this.$data.currentSocietyID})
    .then(data=>this.fetchMembers(data))
  },

  computed: {
    ...mapGetters("app/society_member", {societyMemberError:"error", societyMemberIsLoading:"isLoading"}),
    ...mapGetters("app/member", {memberError:"error", memberIsLoading:"isLoading"}),
  }
}
</script>
