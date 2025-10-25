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
              <div class="box">
                <div class="text-center">
                  <span class="error" v-if="societyMemberError">{{societyMemberError.message}}</span>
                  <span class="error" v-if="societyError">{{societyError.message}}</span>
                  <div v-if="smIsLoading || societyIsLoading">
                    <div class="text-center">
                      <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
                    </div>
                  </div>
                </div>
              
                <div class="row text-center">
                  <div class="form-group col-md-6 m-auto">
                    <label for="member name">Enter Member's Name</label>
                    <input type="text" v-model="memberSearchMeta" @keyup="filterMember()" class="form-control">
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
              <SocietyMembersList :societyMembers="searchMemberResult" :openAssetWithdrawalModalEventHandler="openAssetWithdrawalModalEventHandler"/>
            </div>
          </div>
        <FooterBar/>
    
        <WithdrawAssetModal
        :paymentTypes="paymentTypes"  
        :modalTitle="modalTitle" 
        :errorDisplay="errorDisplay"
        :memberID="member_id"
        :societyID="society_id"
        :updateDataOnParent="updateDataOnParent"
        ref="modal"/>
    </div> 
  </template>
  
<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import { openModal, closeModal } from "../../assets/js/helpers/utility";
import { mapActions , mapGetters, mapMutations } from 'vuex'
import {turnArrayToObject} from '../../utility'
import SocietyMembersList from './SocietyMembersList.vue';
import WithdrawAssetModal from './WithdrawAssetModal.vue';
  
  let serverData = []
  let dataResult = []
  
  export default {
    name: 'AssetWithdrawalSocietyList',
    components: {
      HeaderNav,
      FooterBar,
      SocietyMembersList,
      WithdrawAssetModal
    },
    data(){
      return{
        pageTitle: 'Asset Withdrawal',
        previousPage: 'Dashboard',
        notificationMessage: '',
        societies: [],
        paymentTypes: [],
        successMsg: '',
        members: [],
        societyMembers: [],
        searchMemberResult: [],
        member_id: '',
        society_id: '',
        modalTitle: '',
        searchMeta: '',
        errorDisplay: '',
        currentSocietyID:null,
        memberSearchMeta: '',
      } 
    },
    methods: {
      ...mapActions("app/society", ["getSocieties", "getOneSociety"]),
      ...mapActions("app/payment_type", ["getPaymentTypes"]),
      ...mapActions(
        "app/society_member", [
          "fetchMemberInSociety", 
          "societyMemberIndex", 
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
              this.$data.searchMemberResult= notDeletedSocietyMember.map(sms=>{
                sms.member_name = store[sms.member_id] ? store[sms.member_id].name : 'Unknown'
                sms.member_phone = store[sms.member_id] ? store[sms.member_id].phone : 'Unknown'
                return sms
              })
  
              serverData = this.$data.searchMemberResult
  
              this.$data.searchMemberResult = dataResult = serverData
            }
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
  
      openAssetWithdrawalModalEventHandler(member_id, member_name, society_id){
        this.$data.modalTitle = `${member_name} Asset Withdrawal`
        this.$data.member_id = member_id
        this.$data.society_id = society_id
        this.showModal()
      },
  
      updateDataOnParent(){
        this.hideModal();
      },
    },
  
    created(){
      this.getSocieties({query:{limit:500}})
      .then(data=>{
        if (data){
          this.$data.societies = data.societies
        }
      })

      this.getPaymentTypes()
			.then(data => {
			// check if data is not null
				if(data){
					// save to trigger rerendering
					this.$data.paymentTypes = data.paymentTypes
				}
			})
    },
    
  
    computed: {
      ...mapGetters("app/society_member", {societyMemberError:"error", smIsLoading:"isLoading"}),
      ...mapGetters("app/society", {societyError:"error", societyIsLoading:"isLoading"}),
    }
  }
  </script>
  