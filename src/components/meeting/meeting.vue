<template>
  <div>
    <HeaderNav/>
      <div id="content-page" class="content-page">
        <div v-if="isLoading">
          <div class="text-center">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
          </div>
        </div>
        <div class="container" v-else>
          <form>
            <div class="row text-center">
              <div class="form-group col-sm-12 col-md-8 m-auto">
                <label for="member name">Enter Member's Name</label>
                <input type="text" v-model="memberSearchMeta" @keyup="searchMember()" class="form-control">
              </div>
            </div>
          </form>
          <br>
          <RefreshAndBackBtn :reloadIndexData="reloadIndexData" :link="link"/>
          <div class="table-responsive">
            <table class="styled-table">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Name</th>
                  <th>Make Savings</th>
                  <th>Passbook</th>
                </tr>
              </thead>
              <tbody v-if="isLoading">
                <tr>
                  <td colspan="4">
                    <div class="text-center" :style="{width: '100%'}">
                      <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>
                      <small>Fetching data...</small>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tbody v-else-if="error">
                <tr>
                  <td colspan="4">
                    <div class="text-center" :style="{width: '100%'}">
                      <small>Unable to fetch data</small>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr v-for="(societyMember, index) in searchMemberResult" :key="societyMember.id">
                  <td>{{ (index) + 1 }}</td>
                  <td>{{ societyMember.member_name }}</td>
                  <td>
                    <button class="btn btn-info btn-sm makePayment" @click="makePaymentEventHandler(societyMember.member_id, societyMember.society_id)">Make Savings</button>
                  </td>
                   <td>
                    <a class="btn btn-primary btn-sm custom-link">
                      <router-link :to="'/meeting/memberPassbook/' + societyMember.member_id + '/' + societyMember.society_id">
                        View Passbook
                      </router-link>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <FooterBar />

      <MakePaymentModal :memberDueMonthlyPayment="memberDueMonthlyPayment" 
      :memberID="memberID"
      :updateParent="updateParent" 
      ref="paymentModal"/>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import MakePaymentModal from '@/components/meeting/MakePaymentModal'
import FooterBar from '@/components/includes/Footer'
import RefreshAndBackBtn from '@/components/includes/RefreshAndBackBtn'
import { closeModal, openModal } from "../../assets/js/helpers/utility"
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { turnArrayToObject } from '../../utility'

let serverData = []
let dataResult = []

export default {
  name: 'meeting-component',
  components: {
    HeaderNav,
    FooterBar,
    MakePaymentModal,
    RefreshAndBackBtn  
  },
  data(){
    return {
      pageTitle: 'Meeting',
      previousPage: 'Dashboard',
      notificationMessage: '',
      societyMembers: [],
      searchMemberResult: [],
      memberSearchMeta: '',
      society_id: this.$route.params.society_id,
      memberDueMonthlyPayment:{member_id:'', society_id:''},
      memberID: '',
      successMsg: '',
      link: '/meeting'
    }
  },
  methods: {
    ...mapActions("app/society_member", ["fetchMemberInSociety"]),
    ...mapActions("app/member", ["fetchManyMember"]),
    ...mapActions("app/society", ["getOneSociety"]),
    ...mapMutations("app/society_member", ["setError"]),

    showModal(){
      let element = this.$refs.paymentModal.$el
      openModal(element);
    },

    hideModal(){
      let element = this.$refs.paymentModal.$el
      closeModal(element)
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

    makePaymentEventHandler(member_id, society_id){
      this.showModal()
      this.$data.memberDueMonthlyPayment = {member_id, society_id}
      this.$data.memberID = member_id
    },

    updateParent(paymentMade){
      if (paymentMade){
        this.$toasted.show(`Payment made successfully`, { 
          type: "success", 
          icon: 'check-circle'
        })
        this.hideModal()
      }
    },

    getAllSocietyMemberEventHandler(){
      this.fetchMemberInSociety({society_id:this.$data.society_id})
      .then(data => {
        if (data){
          this.fetchManyMember(data.societyMembers.map(sms=>sms.member_id))
          .then(results => {
            if (results){
              const store = turnArrayToObject(results.members)
              this.$data.searchMemberResult = data.societyMembers.map(sms=>{
                sms.member_name = store[sms.member_id] ? store[sms.member_id].name : 'Unknown'
                return sms
              })
            }
            serverData = this.$data.searchMemberResult
            this.$data.searchMemberResult = dataResult = serverData
          })
          .catch(this.setError)
        }
      })
    },

    reloadIndexData(){
      this.getAllSocietyMemberEventHandler()
    },
  },
  computed:{
    ...mapGetters("app/society_member", ['isLoading', 'error'])
  },

  created(){
    this.getOneSociety(this.$data.society_id)
    .then(society => {
      if (society){
        this.$data.notificationMessage = `Ongoing meeting for ${society.name}`
      }
    });

    this.getAllSocietyMemberEventHandler() 
  }
}
</script>
