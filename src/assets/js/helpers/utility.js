const $ = window.jQuery;

export function closeNavbar(){
  $("#sideNav").click(function(){
    if($(this).hasClass('closed')){
      $('.navbar-side').animate({left: '0px'});
      $(this).removeClass('closed');
      $('#page-wrapper').animate({'margin-left' : '260px'});
      
    }
    else{
        $(this).addClass('closed');
      $('.navbar-side').animate({left: '-260px'});
      $('#page-wrapper').animate({'margin-left' : '0px'}); 
    }  
  });	


  $('#main-menu').metisMenu();
			
  $(window).bind("load resize", function () {
      if ($(this).width() < 768) {
          $('div.sidebar-collapse').addClass('collapse')
      } else {
          $('div.sidebar-collapse').removeClass('collapse')
      }
  });
}

export function toggleAvatarDropDown(){
  $('#avatarDropDownContent').click(function(){
    $('ul#dropdown1').toggle();
    $('ul#dropdown1').css({opacity: '.9'});
  })
}

export function openModal(elem){
  $(elem).modal('show');
}

export function closeModal(elem){
  $(elem).modal('hide');
}

export function getLoanDurationDifference(currentDate, loanStartDate){
  let newCurrentDate = Date.parse(currentDate)
  let newLoanStartDate = Date.parse(loanStartDate)

  let diff = newCurrentDate - newLoanStartDate

  // let daysDifference = Math.floor(difference/1000/60/60/24);
  // difference -= daysDifference*1000*60*60*24

  // let hoursDifference = Math.floor(difference/1000/60/60);
  // difference -= hoursDifference*1000*60*60

  // let minutesDifference = Math.floor(difference/1000/60);
  // difference -= minutesDifference*1000*60

  // let secondsDifference = Math.floor(difference/1000);

  // return `${daysDifference} day/s  
  //   ${hoursDifference} hour/s
  //   ${minutesDifference} minute/s
  //   ${secondsDifference} second/s`

  let day = 1000 * 60 * 60 * 24;

  let days = Math.floor(diff/day);
  let months = Math.floor(days/31);
  let years = Math.floor(months/12);

  let message = "Loan was granted ";
  message += days + " days " 
  message += months + " months "
  message += years + " years ago \n"

  return message
}