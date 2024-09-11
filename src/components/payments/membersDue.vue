<template>
  <div>
    <HeaderNav/>
      <div id="content-page" class="content-page">
        <div v-if="successMsg">
          <div class="text-center success-div">
            <span>
              {{ successMsg }}
            </span>
          </div>
        </div>
        <div class="container">
          <Notification :notificationMessage="notificationMessage"/>
            <div class="box">
              <span class="error" v-if="societyMemberError">{{societyMemberError.message}}</span>
              <div v-if="memberIsLoading || societyMemberIsLoading">
                <div class="text-center">
                  <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
                </div>
              </div>
             
              <div class="row">
                <div class="form-group col-12">
                  <label for="Society Name">Society Name</label>
                  <select class="form-control" @change="getSocietyMembers($event)">
                    <option value="">Choose a society</option>
                    <option v-for="society in societies" :key="society.id" :value="society.id">{{ society.name }}</option>
                  </select>
                  
                </div>
              </div>
                
            </div>
            <span class="error" v-if="memberError">{{memberError.message}}</span>
            <div class="row text-center mt-50" v-if="fetchData">
              <div class="form-group col-sm-6 col-md-6 m-auto">
                <label for="member name">Enter Member's Name</label>
                <input type="text" v-model="memberSearchMeta" @keyup="searchMember()" class="form-control">
              </div>
            </div>
            
            <SocietyMembersList :societyMembers="searchMemberResult"
            :currentSocietyID="currentSocietyID" :societyName="societyName"/>
          </div>
        </div>
        <FooterBar/>
      </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import Notification from '@/components/includes/PageNotification'
import SocietyMembersList from '@/components/payments/SocietyMembersPassbookLists'
import { mapActions , mapGetters } from 'vuex'
import { turnArrayToObject } from '../../utility'

let dataResult = []
let serverData = []

export default {
  name: 'edit-member-payment',
  components: {
    HeaderNav,
    FooterBar,
    Notification,
    SocietyMembersList
  },
  data(){
    return{
      pageTitle: 'Members Passbook',
      previousPage: 'Dashboard',
      notificationMessage: 'Get access to all members passbook',
      societies: [],
      successMsg: '',
      members: [],
      societyMembers: [],
      societyName: '',
      searchMemberResult: [],
      errorDisplay: '',
      currentSocietyID:null,
      memberSearchMeta: '',
      fetchData: false,
      message: ''
    } 
  },
  methods: {
    ...mapActions("app/society", ["getSocieties", "getOneSociety"]),
    ...mapActions(
      "app/society_member", [
        "fetchMemberInSociety", 
        "societyMemberIndex",  
      ]),
    ...mapActions("app/member", ['fetchManyMember']),
  
    getSocietyMembers(event){
      
      this.$data.societyMembers = []

      const val = event.target.value

      if(!val || val == "") return;

      this.getOneSociety(val)
      .then(society=>{
        if(society){
          this.$data.currentSocietyID = society.id
          this.$data.societyName = society.name
        }else{
          this.$data.currentSocietyID = null;
        }
        return society;
      })
      .then(society=>this.fetchMemberInSociety({society_id:society.id}))
      .then(data=>this.fetchMembers(data))
    }, 

    fetchMembers(data){
      if(data){
        const memberIDs = data.societyMembers.map(sm=>sm.member_id)

        this.fetchManyMember(memberIDs)
        .then(result=>{
          /**
           * if request is successful distribute using store resolve
           */
          //console.log(result)
          //this.$data.societyMembers = result.members
          const store = turnArrayToObject(result.members)
          this.$data.searchMemberResult = data.societyMembers.map(sms=>{
            sms.member_name = store[sms.member_id] ? store[sms.member_id].name : 'Unknown'
            return sms
          })

          serverData = this.$data.searchMemberResult

          this.$data.searchMemberResult = dataResult = serverData
          this.$data.fetchData = true
  
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
    this.getSocieties({query:{limit:500}})
    .then(data=>{
      if (data){
        this.$data.societies = data.societies
      }
    })
  },

  computed: {
    ...mapGetters("app/society_member", {societyMemberError:"error", societyMemberIsLoading:"isLoading"}),
    ...mapGetters("app/member", {memberError:"error", memberIsLoading:"isLoading"}),
  }
}
</script>
