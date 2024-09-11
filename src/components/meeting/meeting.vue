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
          <div class="filter-result">
            <div class="row">
              <form action="" method="get">
                <div class="row text-center">
                  <div class="input-field col s8 m8 offset-m2">
                    <input type="text" name="memberName" id="memberName" class="" autofocus>
                    <label for="member name">Enter Member's Name</label>
                    <span class="error-message" id="memberName-error"></span>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="text-center">
            <input type="submit" value="Filter Result" class="btn-general">
          </div>
        </div>
        
        <div class="container">
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead>
                <tr class="theading">
                  <th>S/N</th>
                  <th>Name</th>
                  <th>Make Payment</th>
                  <th>View Payment Records</th>
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
                <tr class="tcontent" v-for="(societyMember, index) in societyMembers" :key="societyMember.id">
                  <td>{{ (index) + 1 }}</td>
                  <td>{{ societyMember.member_name }}</td>
                  <td>
                    <button class="btn btn-danger btn-sm makePayment" @click="makePaymentEventHandler(societyMember.member_id, societyMember.society_id)">Make Payment</button>
                  </td>
                  <td>
                    <button class="btn btn-info btn-sm viewPayments" data-target="#paymentRecords" data-toggle="modal">View Payment Records</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PaymentRecord/>
      <MakePaymentModal :memberDueMonthlyPayment="memberDueMonthlyPayment" 
      :memberID="memberID"
      :updateParent="updateParent" 
      ref="paymentModal"/>
    </div>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import PaymentRecord from '@/components/meeting/PaymentRecord'
import MakePaymentModal from '@/components/meeting/MakePaymentModal'
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import Notification from '@/components/includes/PageNotification'
import { closeNavbar, toggleAvatarDropDown, closeModal, openModal } from "../../assets/js/helpers/utility"
import { mapActions , mapGetters, mapMutations } from 'vuex'
import {turnArrayToObject} from '../../utility'

export default {
  name: 'meeting',
  components: {
    HeaderNav,
    PageHeader,
    MakePaymentModal,
    PaymentRecord,
    Notification
  },
  data(){
    return {
      pageTitle: 'Meeting',
      previousPage: 'Dashboard',
      notificationMessage: '',
      societyMembers: [],
      memberDueMonthlyPayment:{member_id:'', society_id:''},
      memberID: '',
      successMsg: '',
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

    makePaymentEventHandler(member_id, society_id){
      this.showModal()
      this.$data.memberDueMonthlyPayment = {member_id, society_id}
      this.$data.memberID = member_id
    },

    updateParent(paymentMade){
      if (paymentMade){
        this.$data.successMsg = 'Payment made successfully'
        this.hideModal()
      }
    }
  },
  computed:{
    ...mapGetters("app/society_member", ['isLoading', 'error'])
  },

  created(){
    const society_id = this.$route.params.society_id
    console.log({society_id});
    this.getOneSociety(society_id)
    .then(society => {
      console.log("after fetching", society)
      if (society){
        this.$data.notificationMessage = `Ongoing meeting for ${society.name}`
      }
    });

    this.fetchMemberInSociety({society_id:society_id})
    .then(data => {
      console.log(data)
      if (data){
        this.fetchManyMember(data.societyMembers.map(sms=>sms.member_id))
        .then(results => {
          const store = turnArrayToObject(results.members)
          this.$data.societyMembers = data.societyMembers.map(sms=>{
            sms.member_name = store[sms.member_id] ? store[sms.member_id].name : 'Unknown'
            return sms
          })
        })
        .catch(this.setError)
      }
    })
    
  },
  mounted(){
    toggleAvatarDropDown(),
    closeNavbar()
  }
}
</script>
