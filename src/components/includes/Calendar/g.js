yearCalendar(){
        //get total day of previous year before current year
        const totalDaysOfPreviousYear = getTotalDaysOfPreviousYear(this.$props.year)
        //if the year is less than year 2000 return empty array
        if(totalDaysOfPreviousYear === 0) return [];
        //store all info to display each month of the year
        const calendar = [];
        //get previous year last day of the month
        let previousMonthLastDayOfWeek = totalDaysOfPreviousYear % 7;

        console.log(previousMonthLastDayOfWeek)

        for(let m = 0; m < 1; m++){
          const daysInMonth = m == 1 && isLeapYear(this.$props.year) ? 29 : months[m]
          const dayOfWeekArray = []

          for(let d = 0; d <= previousMonthLastDayOfWeek; d++){
            dayOfWeekArray.push(0);
          }//end for loop

          for(let d = 1; d <= daysInMonth; d++){
            dayOfWeekArray.push(((previousMonthLastDayOfWeek + d) % 7))
          }//end for loop

          previousMonthLastDayOfWeek = dayOfWeekArray[(dayOfWeekArray.length - 1)]
          //console.log({previousMonthLastDayOfWeek})
          for(let d = (previousMonthLastDayOfWeek + 1); d < 7; d++){
            dayOfWeekArray.push(0)
          }
          
          calendar.push({monthName:monthNames[m], dayOfWeekArray})
        }//end inner for loop
        
        return calendar
      },//end yearCalendar