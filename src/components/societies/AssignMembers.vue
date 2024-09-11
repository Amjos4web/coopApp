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
              <span class="error" v-if="error">{{error.message}}</span>
              <div v-if="isLoading">
                <div class="text-center">
                  <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
                </div>
              </div>

              <div class="row text-center">
                <div class="form-group col-sm-6 col-md-6 m-auto">
                  <label for="member name">Enter Member's Name</label>
                  <input type="text" class="form-control" v-model="memberSearchMeta" @keyup="filterMember()">
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
              </div>

              <SocietyMembersList :societyMembers="searchMemberResult"
              :removeMemberFromSocietyEventHandler="removeMemberFromSocietyEventHandler"/>
          
            </div>
            
      <FooterBar/>

      <SelectMembersForSocietyModal 
      :members="members" 
      :modalTitle="modalTitle" 
      :searchMember="searchMember" 
      :errorDisplay="errorDisplay" 
      :isLoading="isLoading"
      :saveSocietyMemberEventHandler="saveSocietyMemberEventHandler"
      ref="modal"/>
  </div> 
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import Notification from '@/components/includes/PageNotification'
import SelectMembersForSocietyModal from '@/components/societies/SelectMembersForSocietyModal'
import SocietyMembersList from '@/components/societies/SocietyMembersList'
import { openModal, closeModal } from "../../assets/js/helpers/utility";
import { mapActions , mapGetters, mapMutations } from 'vuex'
import {turnArrayToObject} from '../../utility'

let serverData = []
let dataResult = []

export default {
  name: 'AssignMembers',
  components: {
    HeaderNav,
    FooterBar,
    Notification,
    SelectMembersForSocietyModal,
    SocietyMembersList
  },
  data(){
    return{
      pageTitle: 'Assign Members',
      previousPage: 'Dashboard',
      notificationMessage: 'This is where members are being assigned to society',
      societies: [],
      successMsg: '',
      members: [],
      societyMembers: [],
      searchMemberResult: [],
      modalTitle: '',
      searchMeta: '',
      errorDisplay: '',
      currentSocietyID:null,
      memberSearchMeta: '',
    } 
  },
  methods: {
    ...mapActions("app/society", ["getSocieties", "getOneSociety"]),
    ...mapActions(
      "app/society_member", [
        "fetchMemberInSociety", 
        "societyMemberIndex", 
        "saveSocietyMember", 
        "fetchMemberNotInSociety",
        "removeMemberFromSociety"
      ]),
    ...mapActions("app/member", ['fetchManyMember']),

    ...mapMutations("app/society_member", ['setError']),
  
    getSocietyMembers(event){

      this.$data.societyMembers = [];
      this.$data.memberSearchMeta = ''

      const val = event.target.value

      if(!val || val == "") return;

      this.getOneSociety(val)
      .then(society=>{
        if(society){
          this.$data.currentSocietyID = society.id;
          this.$data.modalTitle = `Add new members to ${society ? society.name : "Unknown Society"}`
          this.fetchMemberInSociety({society_id:this.$data.currentSocietyID})
          .then(memberData => {
            if (memberData){
              this.fetchMembers(memberData)
            }
          })
      }else{
        this.$data.currentSocietyID = null;
      }
      })
    }, 

    fetchMembers(data) {
      if(data){
        const notDeletedSocietyMember = data.societyMembers.filter(sm=> sm.deleted !== 1)
        const memberIDs = notDeletedSocietyMember.map(sm=>sm.member_id)
        this.fetchManyMember(memberIDs)
        .then(result=>{
          if (result){
            const store = turnArrayToObject(result.members)
            this.$data.searchMemberResult = notDeletedSocietyMember.map(sms=>{
              sms.member_name = store[sms.member_id] ? store[sms.member_id].name : 'Unknown'
              sms.member_phone = store[sms.member_id] ? store[sms.member_id].phone : 'Unknown'
              return sms
            })
          }
          serverData = this.$data.searchMemberResult

          this.$data.searchMemberResult = dataResult = serverData
        })//end then
        .catch(e=>{
          this.setError(e)
        })
      }//end if
    },

    filterMember(){
      const searchValue = this.$data.memberSearchMeta.toLocaleLowerCase()
      this.$data.searchMemberResult = dataResult.filter(
        m=>(
          (m.member_name.toLocaleLowerCase().indexOf(searchValue) > -1) 
          && (m.id != dataResult.member_id)
        )
      )
    },

    showModal(){
      let element = this.$refs.modal.$el
      openModal(element);
    },

    hideModal(){
      let element = this.$refs.modal.$el
      this.$data.members = [];
      closeModal(element);
    },

    searchMember(searchMeta){
      //let val = this.$data.searchMeta
      if (searchMeta !== ""){
        this.fetchMemberNotInSociety({society_id:this.$data.currentSocietyID, searchMeta})
        .then(data => {
          if (data){
            this.$data.members = data.members
            this.$data.errorDisplay = ''
          }
        })
      } else {
        this.$data.errorDisplay = 'Search meta cannot be empty'
      }
    },

    saveSocietyMemberEventHandler(member_ids){
      if(member_ids.length > 0 && this.$data.currentSocietyID){
        this.saveSocietyMember({society_id:this.$data.currentSocietyID, member_ids})
        .then(data=>{
          if(data){
            this.fetchMembers(data);
            this.$toasted.show(`Member added successfully`, { 
              type: "success", 
              icon: 'check-circle'
            })
            //this.hideModal();
          }
        })
      } else {
        this.$data.errorDisplay = 'Select atleast one member'
      }
    }, 

    removeMemberFromSocietyEventHandler(id){
      this.$data.societyMembers = [];
      this.removeMemberFromSociety(id)
      .then(societyMember=> this.fetchMemberInSociety({society_id:this.$data.currentSocietyID}))
      .then(data=> {
        if (data){
          this.fetchMembers(data)
          this.$toasted.show(`Member removed successfully`, { 
            type: "success", 
            icon: 'check-circle'
          }) 
        }
      })
    }
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
    ...mapGetters("app/society_member", ["error", "isLoading"]),
    //...mapGetters("app/member", ["error", "isLoading"]),
  }
}
</script>
