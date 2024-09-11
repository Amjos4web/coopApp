<template>
  <div>
    <HeaderNav/>
      <div id="content-page" class="content-page">
         <div v-if="memberPaymentError">
          <div class="error-div text-center">
            <span>
              {{memberPaymentError.message}}
            </span>
          </div>
        </div>
        
         <div v-if="calendarYearError">
          <div class="error-div text-center">
            <span>
              {{calendarYearError.message}}
            </span>
          </div>
        </div>
    
        <div v-if="successMsg">
          <div class="text-center success-div">
            <span>
              {{ successMsg }}
            </span>
          </div>
        </div>
        <div v-if="meetingDateIsLoading || calendarYearIsLoading || memberPaymentIsLoading || memberIsLoading">
          <div class="text-center" :style="{width: '100%'}">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
          </div>
        </div>
        <div class="container" v-else>
          <form @submit.prevent="fetchMemberMonthlyPaymentEventHandler()">
          <div class="filter-result">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Year</label>
                  <select class="form-control" @change="getMeetingDates($event)">
                    <option value="">Select Year</option>
                    <option v-for="y in meetingYear" :value="y" :key="y">{{ y }}</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Meeting Date</label>
                  <select class="form-control" @change="onMeetingCalendarChangeEventHandler($event)">
                    <option value="">Select Meeting Date</option>
                    <option v-for="m in meetingDates" :key="m.id" :value="m.id">{{ m.meeting_date }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-10">
            <input type="submit" value="Proceed" class="btn btn-info">
          </div>
          </form>
        </div>
      </div>
      <FooterBar/>
      <MakeNewPayment :memberPaymentDueList="memberPaymentDueList"
      :updateParent="updateParent" 
      :meetingDateForModal="meetingDateForModal"
      :meetingCalendarID="meetingCalendarID"
      :societyID="societyID"
      :memberID="memberID"
      ref="makePayment"/>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import MakeNewPayment from '@/components/payments/MakeNewPayment'
import { openModal, closeModal } from '../../assets/js/helpers/utility';
import { mapActions, mapGetters, mapMutations } from 'vuex'

const formData = {
  society_id :"", 
  year : "", 
  member_id: "",
  meeting_calendar_id:""
};

export default {
  name: 'edit-payment',
  components: {
    HeaderNav,
    FooterBar,
    MakeNewPayment
  },
  data(){
    return{
      pageTitle: '',
      previousPage: 'Dashboard',
      notificationMessage: null,
      meetingYear:[],
      meetingDates: [],
      memberPaymentDueList:[],
      successMsg: '',
      meetingDateForModal: '',
      meetingCalendarID: '',
      societyID: '',
      memberID: ''
    } 
  },
  methods: {
    ...mapActions("app/member_payment", ["saveMemberPayments", "getMemberPaymentByMeetingCalendarID"]),
    ...mapActions("app/meeting_calendar", ["getMeetingCalendarYear", "getMeetingCalendarForSocietyWithinAyear"]),
    ...mapActions("app/member", ["getOneMember"]),
    ...mapMutations("app/member_payment", ["setError"]),

    openMakePaymentModal(){
      let element = this.$refs.makePayment.$el
      openModal(element)
    },

    closeMakePaymentModal(){
      let element = this.$refs.makePayment.$el
      closeModal(element)
    },

    fetchMemberMonthlyPaymentEventHandler(){
      if (formData.meeting_calendar_id != ""){
        this.getMemberPaymentByMeetingCalendarID({
            member_id:this.$route.params.member_id,
            society_id:formData.society_id, 
            meeting_calendar_id:formData.meeting_calendar_id
          }
        )
        .then(data => {
          if (data){
            this.$data.memberPaymentDueList = data.memberPaymentDueList
            this.$data.societyID = formData.society_id
            this.$data.memberID = formData.member_id
            this.$data.meetingCalendarID = formData.meeting_calendar_id
            this.openMakePaymentModal()
          }
        })
      }
    },

    getMeetingDates(event){
      formData.year = event.target.value
      formData.society_id = this.$route.params.currentSocietyID
      formData.member_id = this.$route.params.member_id

      if (formData.year != "" && formData.society_id != ""){
        this.getMeetingCalendarForSocietyWithinAyear(formData)
        .then(data => {
          if (data){
            this.$data.meetingDates = data.meetingCalendars
            this.$data.meetingDateForModal = data.meetingCalendars.meeting_date
          }
        })
      }
    },

    onMeetingCalendarChangeEventHandler(event){
      formData.meeting_calendar_id = event.target.value
    },

    updateParent(hasPaid){
      if(hasPaid){
        this.closeMakePaymentModal()
        this.$toasted.show(`Payment made successfully`, { 
          type: "success", 
          icon: 'check-circle'
        })
      }
    }
  },

  computed: {
    ...mapGetters("app/member_payment", {memberPaymentIsLoading:"isLoading", memberPaymentError:"error"}),
    ...mapGetters("app/meeting_calendar", {meetingDateIsLoading:"isLoading", meetingDateError:"error"}),
    ...mapGetters("app/meeting_calendar", {calendarYearIsLoading:"isLoading", calendarYearError:"error"}),
    ...mapGetters("app/member", {memberIsLoading:"isLoading", memberError:"error"})
  },
  created(){
    this.getMeetingCalendarYear()
    .then(data2 => {
      if (data2){
        this.$data.meetingYear = data2.meetingCalendarYears
      }
    })

    this.getOneMember(this.$route.params.member_id)
    .then(data => {
      if (data){
        this.$data.pageTitle = `Editing Payment for ${data.name}`
      }
    })
  }
}
</script>
