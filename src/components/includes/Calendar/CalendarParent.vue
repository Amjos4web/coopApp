<template>
  <div class="panel panel-default mt-20" v-show="meetingDates.year !== 0">
    <div class="panel-heading">
      <i class="fa fa-calendar"></i> Setting meeting calendar <b>{{ society_name }}</b> for the year <b>{{ meetingDates.year }}</b>
    </div>
    <div class="panel-body">
      <div class="row">
        <CalendarChild 
          v-for="(month, index) in yearCalendar" 
          :key="month.monthName" 
          :monthName="month.monthName"
          :dayOfWeekArray="month.dayOfWeekArray"
          :year="meetingDates.year"
          :meetingDetail="meetingDates.detail[index]"
          :getSelectedMeetingDate="getSelectedMeetingDate"
          :getSelectedMeetingTime="getSelectedMeetingTime"
          :monthIndex="index"
          :validateMeetingDateTime="validateMeetingDateTime"
        />
      </div> 
      <div class="text-center">
        <input type="submit" value="Save" name="save" class="btn btn-success" @click="submitFormHandler()">
      </div>
    </div>
  </div>
</template>
<script>
  
  import CalendarChild from "./CalendarChild"

  const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  const monthNames = [
    "January", "February", "March", "April", "May", 
    "June", "July", "August", "September", "October", 
    "November", "December"
  ] 

  //am using a ref day of 1/1/2000 which as saturday as the first day
  const refYear = 2000
  //so from sunday to friday belong to December 1999
  const startOffsetRefDayOfWeek = 5

  const isLeapYear = year => ((year % 400 === 0) || ((year % 4 === 0) && (year % 100 !== 0)))

  const getTotalDaysOfPreviousYear = (currentYear)=>{
    //we only display date from year ref year 2000
    if(currentYear < refYear) return 0;
    //store the last day of December for the current year
    let totalDaysOfPreviousYear = startOffsetRefDayOfWeek;
    //loop from refYear to currentYear to get 1st of January of current year
    for(let year = refYear; year < currentYear; year++){
      //loop over every month in the year
      for(let m = 0; m < months.length; m++){
        //if month is February and is a leap year. February will have 29 days else 28
        if(m === 1 && isLeapYear(year)){
          totalDaysOfPreviousYear += 29
        }else{
          totalDaysOfPreviousYear += months[m]
        }
      }//end for loop
    }//end for loop
    return totalDaysOfPreviousYear
  }//end function method

  export default {
    name:"CalendarParent",
    components:{CalendarChild},
    
    props:{
      meetingDates:Object,
      getSelectedMeetingCalendar:Function,
      validateMeetingDateTime:Function,
      submitFormHandler:Function,
      society_name: String
    },
    computed:{
      yearCalendar(){
        //get total day of previous year before current year
        const totalDaysOfPreviousYear = getTotalDaysOfPreviousYear(this.$props.meetingDates.year)
        //if the year is less than year 2000 return empty array
        if(totalDaysOfPreviousYear === 0) return [];
        //store all info to display each month of the year
        const calendar = [];
        //get previous year last day of the month
        let previousMonthLastDayOfWeek = totalDaysOfPreviousYear % 7

        let prevMonthDay = 31

        //console.log(previousMonthLastDayOfWeek)

        for(let m = 0; m < months.length; m++){
          const daysInMonth = m === 1 && isLeapYear(this.$props.meetingDates.year) ? 29 : months[m]
          const dayOfWeekArray = []

          let counter = 1

          for(let d = previousMonthLastDayOfWeek; d >= 0; d--){
            dayOfWeekArray.push({day:(prevMonthDay - d), disabled:true})
          }//end for loop

          for(let d = 1; d <= daysInMonth; d++){
            dayOfWeekArray.push({day:d, disabled:false})
          }//end for loop

          previousMonthLastDayOfWeek = ((previousMonthLastDayOfWeek + daysInMonth) % 7)
          //console.log({previousMonthLastDayOfWeek})
          counter = 1;
          for(let d = dayOfWeekArray.length; d < 42; d++){
            dayOfWeekArray.push({day:counter, disabled:true})
            counter += 1;
          }
          calendar.push({monthName:monthNames[m], dayOfWeekArray})

          prevMonthDay = daysInMonth
        }//end for loop
        return calendar
      },//end yearCalendar
    },//end computed
    methods:{
      getSelectedMeetingDate(dayObject, year, monthIndex){
        //if the day does not belong to date, it'll be disabled 
        //return
        if(dayObject.disabled) return;
        //I am not going to allow month index beyong 11, since there is 12 month in a year
        if(monthIndex > 11) return
        //the true indicate to the parent that's the date is being sent and not time
        this.$props.getSelectedMeetingCalendar(`${year}-${(monthIndex + 1)}-${dayObject.day}`, monthIndex, true)
      },
      getSelectedMeetingTime(event, monthIndex){
        //const val = event.target.value
        if(event.target.value)
        this.$props.getSelectedMeetingCalendar(`${event.target.value}:00`, monthIndex, false)
        //console.log({monthIndex, val:event.target.value})
      }
    },//end methods object
  }
</script>