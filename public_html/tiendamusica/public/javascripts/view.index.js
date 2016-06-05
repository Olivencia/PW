$(function(){
  $('#submit-button').on("click", function(){
      $('#success').css("display","block");
  });

  if ($("#home").length){
    $('#login').on("mouseover", function(){
        $('#drop-login').show();
    });
    $('#login').on("mouseout", function(){
      $('#drop-login').on("mouseover", function(){
        $('#drop-login').show();
      });
      $('#drop-login').on("mouseout", function(){
        $('#drop-login').hide();
      });
      $('#login').on("mouseout", function(){
        $('#drop-login').hide();
      });
    });
  }
  else{
    $('#login a').attr("href","/");
  }

  $('#all-genre').on("mouseover", function(){
      $('#drop-genre').show();
  });
  $('#all-genre').on("mouseout", function(){
    $('#drop-genre').on("mouseover", function(){
      $('#drop-genre').show();
    });
    $('#drop-genre').on("mouseout", function(){
      $('#drop-genre').hide();
    });
    $('#all-genre').on("mouseout", function(){
      $('#drop-genre').hide();
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
