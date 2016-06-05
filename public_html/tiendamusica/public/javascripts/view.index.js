$(function(){
  $('#submit-button').on("click", function(){
      $('#success').css("display","block");
  });

  $('.submenu-nav-bar.drop').on("mouseover", function(){
      $('.dropdown').show();
  });
  $('.submenu-nav-bar.drop').on("mouseout", function(){
    $('.dropdown').on("mouseover", function(){
      $('.dropdown').show();
    });
    $('.dropdown').on("mouseout", function(){
      $('.dropdown').hide();
    });
    $('.submenu-nav-bar.drop').on("mouseout", function(){
      $('.dropdown').hide();
    });
  });

  $('#nav-bar-artists').on("mouseover", function(){
      console.log("hola");
  });

  $('#nav-bar-lasts-discs').on("mouseover", function(){
      console.log("hola");
  });

  
});

$(document).ready(function(){
  $('.bxslider').bxSlider({
    slideWidth: 300,
    minSlides: 4,
    maxSlides: 4,
    moveSlides: 4,
    slideMargin: 10
  });




});
