<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper">
      <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
      <div class="page-inner">
          <div class="container">
            <div class="alert alert-info">
              <p>{{ notificationMessage }}</p>
            </div>
            <div v-if="societyIsLoading">
              <div class="text-center mb-20">
                <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
              </div>
            </div>
            <div v-if="societyError">
              <div class="error-div mb-20">
                <span>
                  {{ societyError.message }}
                </span>
              </div>
            </div>
            
            <form @submit.prevent="getYearlyMeetingCalendarForSocietyEventHandler()">
              <div class="filter-result">
                <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>Select Society</label>
                        <select class="form-control" v-model="query.society_id"  @change="resetCalendarInterface(true)">
                          <option value="">Select Society</option>
                          <option v-for="s in societies" :key="s.id" :value="s.id">{{ s.name }}</option>
                        </select>
                        <span class="error" v-if="error && error.errors && error.errors.society_id">
                          {{ error.errors.society_id[0] }}
                        </span>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>Select Year</label>
                        <select class="form-control" v-model="query.year" @change="resetCalendarInterface(false)">
                          <option value="0">Select Year</option>
                          <option v-for="y in years" :value="y" :key="y">{{y}}</option>
                        </select>
                        <span class="error" v-if="error && error.errors && error.errors.year">
                          {{ error.errors.year[0] }}
                        </span>
                      </div>
                    </div>
                </div>
              </div>
              <div class="text-center mt-20">
                <input type="submit" value="Proceed" class="btn-general">
              </div>
            </form>
            <CalendarParent 
              :meetingDates="meetingDates" 
              :society_name="society_name"
              :getSelectedMeetingCalendar="getSelectedMeetingCalendar"
              :validateMeetingDateTime="validateMeetingDateTime"
              :submitFormHandler="submitFormHandler"
            />
          </div>
           <div v-if="mCIsLoading">
            <div class="text-center">
              <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
            </div>
          </div>
          <div v-if="mCError">
            <div class="error-div">
              <span>
                {{ mCError.message }}
              </span>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import CalendarParent from '@/components/includes/Calendar/CalendarParent'
import { closeNavbar, toggleAvatarDropDown } from "../assets/js/helpers/utility";
import { mapActions, mapGetters, mapMutations } from 'vuex';

let store = {}

export default {
  name: 'Calendar',
  components: {
    HeaderNav,
    PageHeader,
    CalendarParent
  },
  data(){
    return {
      pageTitle: 'Meeting Calendar',
      previousPage: 'Dashboard',
      notificationMessage: 'This is where meeting calendar is being set for each society and year',
      
      societies:[],
      years:[],
      society_name: '',
      query: {
        society_id: '',
        year: 0
      },
      meetingDates:{year:0, detail:{}},
      error:null,
    }
  },

  methods:{
    ...mapActions("app/society", ["getSocieties", "getOneSociety"]),
    ...mapActions("app/meeting_calendar", [
      "getMeetingCalendarYear", "saveMeetingCalendar",
      "getMeetingCalendarForSocietyWithinAyear",
    ]),

    resetCalendarInterface(fromSocietySelect){
      //I need to initial year element when
      //a new society element is selected
      if(fromSocietySelect){
        this.$data.query.year = 0
      }
      this.$data.meetingDates = {year:0, detail:{}}
      store = {}
    },

    getYearlyMeetingCalendarForSocietyEventHandler(){
      const year = parseInt(this.$data.query.year)
      const society_id = this.$data.query.society_id

      let errored = false
      const error = new Error("You have error in your input")
      error.errors = {}
      if(!year){
        errored = true
        error.errors.year = ["Please select a year"]
      }

      if(!society_id){
        errored = true
        error.errors.society_id = ["Please select a society"]
      }

      if(errored){
        this.$data.error = error;
        return
      }

      this.$data.error = null

      this.getMeetingCalendarForSocietyWithinAyear({society_id, year})
      .then(data => {
        this.getOneSociety(society_id)
        .then(result => {
          if (result){
            this.$data.society_name = result.name
          }
        })
        this.setMeetingDatesHelper(data)
      })//end then
    },//end method

    getSelectedMeetingCalendar(value, monthIndex, isDateOrTime){

      if(store[monthIndex]){
        if(isDateOrTime){
          store[monthIndex][0] = value
        }else{
          store[monthIndex][1] = value
        }
      }else{
        store[monthIndex] = isDateOrTime ? [value, undefined] : [undefined, value]
      }
      //console.log(store);
      //update if the date has been selected
      if(store[monthIndex][0]){

        //get date
        const date = store[monthIndex][0]
        //get time
        const time = store[monthIndex][1]
        let dateObj = null, newDetail = null
        if(time){
          //convert date string to date object
          dateObj = new Date(date + " " + time);
          //set date month as key containing object of day and the time the
          //meeting will take place on that date.
          newDetail = {
            day : dateObj.getDate(),
            time, 
            title : dateObj.toLocaleTimeString()
          }//end object
        }else{
          //convert date string to date object
          dateObj = new Date(date)
          //set date month as key containing object of day and the time the
          //meeting will take place on that date.
          newDetail = {
            day : dateObj.getDate(),
            time:"", 
            title:""
          }//end object
        }//end else
        this.$data.meetingDates.detail = {...this.meetingDates.detail, [monthIndex]:newDetail}
        
      }//end if(store[monthIndex][0])
    },

    validateMeetingDateTime(monthIndex){
      const dateTime = store[monthIndex];
      if(!dateTime){
        return false
      }//end if
      if(!dateTime[0]){
        return "Select Meeting Date"
      }
      else if(!dateTime[1]){
        return "Select Meeting Time"
      }
      return false
    },//end function

    submitFormHandler(){
      /**
       * If no calendar data was selected, show error to user
       */
      let errMsg = "No meeting date supplied"
      let meeting_dates = []

      for(let monthIndex in store){
        //if a selected meeting calendar does not
        //include date or time 
        if(!store[monthIndex].every(i=>!!i)){
          errMsg = "Please check your input again and re-submit"
          break
        }//end if
        meeting_dates.push(store[monthIndex].join(" "))
        errMsg = false
      }//end for loop

      if(errMsg){
        const error = new Error("You have error in your input")
        error.errors = {meeting_dates:[errMsg]}
        this.$data.error = error
        return
      }

      this.saveMeetingCalendar({
        meeting_dates, 
        society_id:this.$data.query.society_id,
        year:this.$data.query.year
      })
      .then(data=>{
        //console.log(data);
      })
    },//end method

    setMeetingDatesHelper(data){
      if(data){
        //loop through previously saved society meeting dates
        this.$data.meetingDates = data.meetingCalendars.map(mc=>{
          //trim and split to have dates and time seperately
          return mc.meeting_date.trim().split(" ").filter(f=>f !== "")
        }).reduce((prev, cur)=>{
          //get date
          const date = cur[0].trim()
          //get time
          const time = cur[1].trim()
          
          //convert date string to date object
          const dateObj = new Date(date + " " + time);
          //set date month as key containing object of day and the time the
          //meeting will take place on that date.
          const monthIndex = dateObj.getMonth()
          prev.detail[monthIndex] = {day:dateObj.getDate(), time, title:dateObj.toLocaleTimeString()}
          //store this, it'll be sent back to server later when client click save
          store[monthIndex] = [date, time]

          // console.log(store[monthIndex]);
          //return object back to caller
          return prev
        }, {detail:{}, year:this.$data.query.year})//end reduce
      }//end if
    }
  },

  created(){
    Promise.all([
      this.getSocieties(),
      this.getMeetingCalendarYear()
    ])
    .then(result => {
      //console.log()
      if(result.every(r=>!!r)){
        this.$data.societies = result[0].societies
        this.$data.years = result[1].meetingCalendarYears
      }
    })
  },

  computed: {
    ...mapGetters("app/meeting_calendar", {mCIsLoading:"isLoading", mCError:"error"}),
    ...mapGetters("app/society", {societyIsLoading:"isLoading", societyError:"error"})
  },

  mounted(){
    toggleAvatarDropDown(),
    closeNavbar()
  }
}
</script>