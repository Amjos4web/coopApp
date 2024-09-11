<template>
  <div>
    <HeaderNav/>
     <div v-if="societyIsLoading || meetingDateIsLoading || calendarYearIsLoading || societyPaymentIsLoading">
        <div class="text-center" :style="{width: '100%'}">
          <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
        </div>
      </div>
      <div id="content-page" class="content-page" v-else>
         <div v-if="societyPaymentError">
          <div class="error-div text-center">
            <span>
              {{societyPaymentError.message}}
            </span>
          </div>
        </div>
         <div v-if="societyError">
          <div class="error-div text-center">
            <span>
              {{societyError.message}}
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
         <div v-if="meetingDateError">
          <div class="error-div text-center">
            <span>
              {{meetingDateError.message}}
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
        <div class="container">
          <form @submit.prevent="fetchSocietyMonthlyPaymentEventHandler()">
          <div class="filter-result">
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label>Select society</label>
                  <select class="form-control" @change="getMeetingDates($event, 's')">
                    <option value="">Select Society</option>
                    <option v-for="s in societies" :key="s.id" :value="s.id">{{ s.name }}</option>
                  </select>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label>Year</label>
                  <select class="form-control" @change="getMeetingDates($event, 'y')">
                    <option value="">Select Year</option>
                    <option v-for="y in meetingYear" :value="y" :key="y">{{ y }}</option>
                  </select>
                </div>
              </div>
              <div class="col-md-4">
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
        <PaymentRecord/>
        <MakePaymentModal :societyPaymentDueList="societyPaymentDueList"
        :updateParent="updateParent" 
        :meetingDateForModal="meetingDateForModal"
        :meetingCalendarID="meetingCalendarID"
        :societyID="societyID"
        ref="makePayment"/>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import MakePaymentModal from '@/components/societies/MakePaymentModal'
import PaymentRecord from '@/components/societies/PaymentRecord'
import { openModal, closeModal } from '../../assets/js/helpers/utility';
import { mapActions, mapGetters, mapMutations } from 'vuex'

const formData = {
  society_id :"", 
  year : "", 
  meeting_calendar_id:""
};

export default {
  name: 'MonthlyDue',
  components: {
    HeaderNav,
    FooterBar,
    MakePaymentModal,
    PaymentRecord
  },
  data(){
    return{
      pageTitle: 'Society Montly Payment',
      previousPage: 'Dashboard',
      notificationMessage: null,
      societies: [],
      meetingYear:[],
      meetingDates: [],
      societyPaymentDueList:[],
      successMsg: '',
      meetingDateForModal: '',
      meetingCalendarID: '',
      societyID: ''
    } 
  },
  methods: {
    ...mapActions("app/society", ["getSocieties"]),
    ...mapActions("app/society_payment", ["saveSocietyPayments", "fetchSocietyMonthlyPayment"]),
    ...mapActions("app/meeting_calendar", ["getMeetingCalendarYear", "getMeetingCalendarForSocietyWithinAyear"]),
    ...mapMutations("app/society_payment", ["setError"]),

    openMakePaymentModal(){
      let element = this.$refs.makePayment.$el
      openModal(element)
    },

    closeMakePaymentModal(){
      let element = this.$refs.makePayment.$el
      closeModal(element)
    },

    fetchSocietyMonthlyPaymentEventHandler(){
      if (formData.meeting_calendar_id != ""){
        this.fetchSocietyMonthlyPayment({society_id:formData.society_id, meeting_calendar_id:formData.meeting_calendar_id})
        .then(data => {
          if (data){
            this.$data.societyPaymentDueList = data.societyPaymentDueList
            this.$data.societyID = formData.society_id
            this.$data.meetingCalendarID = formData.meeting_calendar_id
            this.openMakePaymentModal()
          }
        })
      }
    },

    getMeetingDates(event, from){
      if(from === "s"){
        formData.society_id = event.target.value
      }

      else if(from === "y"){
        formData.year = event.target.value
      }

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
        this.$data.successMsg = 'Payment made Successfully'
      }
    }
  },

  computed: {
    ...mapGetters("app/society_payment", {societyPaymentIsLoading:"isLoading", societyPaymentError:"error"}),
    ...mapGetters("app/society_payment", {meetingDateIsLoading:"isLoading", meetingDateError:"error"}),
    ...mapGetters("app/meeting_calendar", {calendarYearIsLoading:"isLoading", calendarYearError:"error"}),
    ...mapGetters("app/society", {societyIsLoading:"isLoading", societyError:"error"})
  },
  created(){
    this.getSocieties()
    .then(data => {
      if (data){
        this.$data.societies = data.societies
      }
    })

    this.getMeetingCalendarYear()
    .then(data2 => {
      if (data2){
        this.$data.meetingYear = data2.meetingCalendarYears
      }
    })
  }
}
</script>
