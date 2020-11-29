function getTime() {
  var timeSplit = document.getElementById('time').value.split(':'),
      hours,
      minutes,
      meridian;
  hours = timeSplit[0];
  minutes = timeSplit[1];
  if (hours > 12) {
    meridian = 'PM';
    hours -= 12;
  } else if (hours < 12) {
    meridian = 'AM';
    if (hours == 0) {
      hours = 12;
    }
  } else {
    meridian = 'PM';
  }
  return (hours + ':' + minutes + ' ' + meridian);
}


(function($) {
  "use strict"; // Start of use strict

  // Toggle the side navigation
  $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Close any open menu accordions when window is resized below 768px
  $(window).resize(function() {
    if ($(window).width() < 768) {
      $('.sidebar .collapse').collapse('hide');
    };
    
    // Toggle the side navigation when window is resized below 480px
    if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
      $("body").addClass("sidebar-toggled");
      $(".sidebar").addClass("toggled");
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll', function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(e) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    e.preventDefault();
  });

  $("form#loginForm").submit(function() {
    var username = $('#username').val();
    var password = $('#password').val();
    $.ajax({
      type: "POST",
      url: "http://localhost:8080/login",
      data: JSON.stringify({ username: username, password: password }),
      contentType: 'application/json',
      success: function(response, textStatus, xhr) {
        console.log(response);
        localStorage.setItem("user", response.patientId);
        window.location = "index.html?user="+response.patientId;
      },
      error: function(xhr, textStatus, errorThrown) {
        console.log("error");
        $("#errorMessage").removeClass('d-none');
      }
    });
    return false;
  });

  $("form#addReading").submit(function() {
    var reading = $('#reading').val();
    var time = getTime();
    var patientId = localStorage.getItem("user");
    var description = $('#description1').val() === null?$('#description2').val():$('#description1').val();
    console.log(JSON.stringify({ reading: reading, time: time,patientId:patientId,description:description }))
    $.ajax({
      type: "POST",
      url: "http://localhost:8080/observation",
      data: JSON.stringify({patientId:patientId,description:description , reading: reading, time: time}),
      contentType: 'application/json',
      success: function(response, textStatus, xhr) {
        console.log(response);
      },
      error: function(xhr, textStatus, errorThrown) {
        console.log("error");
        //$("#errorMessage").removeClass('d-none');
      }
    });
    return false;
  });

})(jQuery); // End of use strict
