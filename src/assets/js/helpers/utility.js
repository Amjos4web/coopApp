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