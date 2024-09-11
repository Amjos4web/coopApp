<template>
  <div class="col-md-4">
    <div class="text-center mb-20">
      <small>{{ meetingDetail ? `${positionPostfix(meetingDetail.day)}, ${monthName} ${year} @ ${meetingDetail.title}` : "Not Yet Selected"}}</small>
    </div>
    <div class="month">      
      <ul>
        <li>
          {{monthName}}<br>
          <span style="font-size:18px">{{year}}</span>
        </li>
      </ul>
    </div>

    <ul class="weekdays">
      <li>Su</li>
      <li>Mo</li>
      <li>Tu</li>
      <li>We</li>
      <li>Th</li>
      <li>Fr</li>
      <li>Sa</li>
    </ul>

    <ul class="days">  
      
      <li 
        v-for="(dayObject, index) in dayOfWeekArray" 
        :key="index" 
        :style="activeStyle(dayObject)"
        @click="getSelectedMeetingDate(dayObject, year, monthIndex)"
      >{{dayObject.day}}</li>
    </ul>

    <div class="form-group col-12 mt-10">
      <input type="time" class="form-control" 
        :value="meetingDetail ? meetingDetail.time : '' " 
        @input="getSelectedMeetingTime($event, monthIndex)"
        @blur="validateWhenTimeBlur()"
      >
      <span class="error" :id="monthIndex"></span>
    </div>
  </div> 
</template>
<script>
  //import $ from "jquery"

  export default {
    name:"calendar-child",
    
    props:{
      monthName:String,
      dayOfWeekArray:Array,
      year:Number,
      meetingDetail:Object,
      getSelectedMeetingDate:Function,
      getSelectedMeetingTime:Function,
      monthIndex:Number,
      validateMeetingDateTime:Function,
    },
    methods:{

      positionPostfix(day){
        const mod = day % 10
        if(mod === 1){
          return day + "st"
        }
        else if(mod === 2){
          return day + "nd"
        }
        else if(mod === 3){
          return day + "rd"
        }
        else{
          return day + "th"
        }
      },

      activeStyle(dayObject){

        if(dayObject.disabled){
          return {
            color:"#c8c8ca",
            cursor:"default",
          }//end return object
        }//end if
        
        if((!dayObject.disabled) && this.$props.meetingDetail && this.$props.meetingDetail.day === dayObject.day){
          return {
            padding: 5,
            background: "#1abc9c",
            color: "white !important"
          }//end return object
        }//end if
        return {}
      },//end method activeStyle  

      validateWhenTimeBlur(){
        const msg = this.$props.validateMeetingDateTime(this.$props.monthIndex)
        // if(msg){
        //   document.querySelector(`span.error#${this.$props.monthIndex}`).textContent = msg
        //   //$(`span.error#${this.$props.monthIndex}`).text(msg)
        // }else{
        //   //$(`span.error#${this.$props.monthIndex}`).text("")
        //   document.querySelector(`span.error#${this.$props.monthIndex}`).textContent = ''
        // }
      }
    },//end methods
    updated(){
      this.validateWhenTimeBlur()
    }
  }
</script>