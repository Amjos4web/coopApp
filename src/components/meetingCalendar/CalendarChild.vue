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
      >{{dayObject.day}}</li>
    </ul>

    <div class="input-group col s12">
      <input type="time" 
        :value="meetingDetail ? meetingDetail.time : '' " 
        disabled
      >
    </div>
  </div> 
</template>
<script>
  export default {
    name:"calendar-child",
    
    props:{
      monthName:String,
      dayOfWeekArray:Array,
      year:Number,
      meetingDetail:Object,
      monthIndex:Number,
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
    },//end methods
  }
</script>