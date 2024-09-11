<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper">
      <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
      <div class="page-inner">
          <div class="container">
            <div v-if="societyIsLoading || sMisLoading">
              <div class="text-center mb-20">
                <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
              </div>
            </div>
            <div v-if="societyError">
              <div class="error-div mb-20 text-center">
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
import CalendarParent from '@/components/meetingCalendar/CalendarParent'
import { closeNavbar, toggleAvatarDropDown } from "../../assets/js/helpers/utility";
import { mapActions, mapGetters } from 'vuex';

let store = {}

export default {
  name: 'meeting-calendar',
  components: {
    HeaderNav,
    PageHeader,
    CalendarParent,
  },
  data(){
    return {
      pageTitle: 'Meeting Calendar',
      previousPage: 'Dashboard',
      
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
    ...mapActions("app/society", ["fetchManySociety", "getOneSociety"]),
    ...mapActions("app/society_member", ["fetchAllSocietyToWhichIBelongs"]),
    ...mapActions("app/meeting_calendar", [
      "getMeetingCalendarYear",
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
      this.fetchAllSocietyToWhichIBelongs(),
      this.getMeetingCalendarYear(),
    ])
    .then(result => {
      if(result.every(r=>!!r)){
        
        const society_ids = result[0].societyMembers.map(sm=>sm.society_id)

        this.fetchManySociety(society_ids)
        .then(data => {
          console.log(data)
          if (data){
            this.$data.societies = data.societies
            this.$data.years = result[1].meetingCalendarYears
            console.log(this.$data.societies)
          } // end if (data)
        })// end then method
      } // end if(result.every(r=>!!r))
    })
  },

  computed: {
    ...mapGetters("app/meeting_calendar", {mCIsLoading:"isLoading", mCError:"error"}),
    ...mapGetters("app/society", {societyIsLoading:"isLoading", societyError:"error"}),
    ...mapGetters("app/society_member", {sMisLoading:"isLoading", sMerror:"error"})
  },

  mounted(){
    toggleAvatarDropDown(),
    closeNavbar()
  }
}
</script>