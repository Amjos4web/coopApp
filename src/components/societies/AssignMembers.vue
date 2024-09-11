<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper">
     <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
      <div class="page-inner">
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
              <div class="row">
                <div class="form-group">
                  <div class="row">
                    <div class="form-group col s12">
                      <label for="Society Name">Society Name</label>
                      <select class="form-control" @change="getSocietyMembers($event)">
                        <option value="">Choose a society</option>
                        <option v-for="society in societies" :key="society.id" :value="society.id">{{ society.name }}</option>
                      </select>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <SocietyMembersList :societyMembers="societyMembers"
            :removeMemberFromSocietyEventHandler="removeMemberFromSocietyEventHandler"/>
          </div>
        </div>
      </div>
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
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import Notification from '@/components/includes/PageNotification'
import SelectMembersForSocietyModal from '@/components/societies/SelectMembersForSocietyModal'
import SocietyMembersList from '@/components/societies/SocietyMembersList'
import { closeNavbar, toggleAvatarDropDown, openModal, closeModal } from "../../assets/js/helpers/utility";
import { mapActions , mapGetters, mapMutations } from 'vuex'

export default {
  name: 'AssignMembers',
  components: {
    HeaderNav,
    PageHeader,
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
      modalTitle: '',
      searchMeta: '',
      errorDisplay: '',
      currentSocietyID:null,
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

      const val = event.target.value

      if(!val || val == "") return;

      this.getOneSociety(val)
      .then(society=>{
        if(society){
          this.$data.currentSocietyID = society.id;
          this.$data.modalTitle = `Add new members to ${society ? society.name : "Unknown Society"}`
        }else{
          this.$data.currentSocietyID = null;
        }
        return society;
      })
      .then(society=>this.fetchMemberInSociety({society_id:society.id}))
      .then(data=>this.fetchMembers(data))
    }, 

    fetchMembers(data) {
      if(data){

        const notDeletedSocietyMember = data.societyMembers.filter(sm=>!sm.deleted)

        console.log({ notDeletedSocietyMember })

        const memberIDs = notDeletedSocietyMember.map(sm=>sm.member_id)

        this.fetchManyMember(memberIDs)
        .then(result=>{
          //console.log(result)
          const tempStore = {};
          //loop thru what server sent us
          for(let c = 0; c < result.members.length; c++){
            const m = result.members[c];
            //turn to object
            tempStore[m.id] = m;
          }//end for loop
          console.log(tempStore);
          /**
           * if request is successful distribute using store resolve
           */
          this.$data.societyMembers = notDeletedSocietyMember.map(sm=>{
            
            //console.log(sm)
            const m = tempStore[sm.member_id]

            sm.member = (
              m ? ({name : m.name, phone:m.phone}) : null
            )
            return sm;
          })//end map
          console.log(this.$data.societyMembers);
        })//end then
        .catch(e=>{
          //console.log({e:this.setError})
          this.setError(e)
        })
      }//end if
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
      //console.log(searchMeta)
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
            //this.$data.societyMembers = data.societyMembers;
            this.fetchMembers(data);
            this.$data.successMsg = 'Members added successfully'
            this.hideModal();
          }
        })
      } else {
        this.$data.errorDisplay = 'Select atleast one member'
      }
    }, 

    removeMemberFromSocietyEventHandler(id){
      this.$data.societyMembers = [];
      this.removeMemberFromSociety(id)
      .then(societyMember=>this.fetchMemberInSociety({society_id:societyMember.society_id}))
      .then(data=>this.fetchMembers(data))
    }
  },

  created(){
    this.getSocieties()
    .then(data=>{
      if (data){
        this.$data.societies = data.societies
      }
    })
  },

  computed: {
    ...mapGetters("app/society_member", ["error", "isLoading"]),
    //...mapGetters("app/member", ["error", "isLoading"]),
  },

  mounted(){
    closeNavbar(),
    toggleAvatarDropDown()
  }
}
</script>
