function getTime(field) {
  var timeSplit = document.getElementById(field).value.split(':'),
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

/*var timer = null;
$('#mealName').keyup(function(){
  clearTimeout(timer);
  timer = setTimeout(searchFood, 1000)
});*/


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
//reset form
  $("#closeBloodSugarReading").click(function(){
    $("form#addReading").trigger("reset");
    $("#successMessage").toggleClass('d-none');
  });

  $("#closeMeal").click(function(){
    $("form#addMeal").trigger("reset");
    $("#successMealMessage").toggleClass("d-none");
  });

  $("#closeMedicationSearch").click(function(){
    $("form#addMedical").trigger("reset");
    $("#successMealMessage").toggleClass("d-none");
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
    var time = getTime("time");
    var patientId = localStorage.getItem("user");
    var description = $('#description1').val() === null?$('#description2').val():$('#description1').val();
    $.ajax({
      type: "POST",
      url: "http://localhost:8080/observation",
      data: JSON.stringify({patientId:patientId,description:description , reading: reading, time: time}),
      contentType: 'application/json',
      success: function(response, textStatus, xhr) {
        console.log(response);
        $("#successMessage").toggleClass('d-none');
      },
      error: function(xhr, textStatus, errorThrown) {
        console.log("error");
      }
    });
    return false;
  });

  $("form#addMeal").submit(function() {
    var mealName = $('#mealName').val();
    var time = getTime("mealTime");
    var patientId = localStorage.getItem("user");
    var mealPortion = $('#mealPortion').val();
    var unit= $('#foodInfo').val();
    $.ajax({
      type: "POST",
      url: "http://localhost:8080/nutritionOrder",
      data: JSON.stringify({patientId:patientId,name:mealName , dosage: mealPortion,unit:unit, time: time}),
      contentType: 'application/json',
      success: function(response, textStatus, xhr) {
        console.log(response);
        $("#successMealMessage").toggleClass('d-none');
      },
      error: function(xhr, textStatus, errorThrown) {
        console.log("error");
      }
    });
    return false;
  });

  $("form#addMedical").submit(function() {
    var medicineName = $('#medicineName').val();
    var medicationTime = getTime("medicationTime");
    var patientId = localStorage.getItem("user");
    var medicationDosage = $('#medicationDosage').val();
    var unit= $('#medicationUnit').val();
    $.ajax({
      type: "POST",
      url: "http://localhost:8080/medication",
      data: JSON.stringify({patientId:patientId,name:medicineName , dosage: medicationDosage,unit:unit, time: medicationTime}),
      contentType: 'application/json',
      success: function(response, textStatus, xhr) {
        console.log(response);
        $("#successMedicationMessage").toggleClass('d-none');
      },
      error: function(xhr, textStatus, errorThrown) {
        console.log("error");
      }
    });
    return false;
  });

  $("#pastMedications").click(function(){
    var patientId = localStorage.getItem("user");
    var resultSet = null;
    $.ajax({
      type: "GET",
      url:"http://localhost:8080/medication/"+ patientId,
      success: function (data) {
        resultSet = data;
        //$('#searchFood').modal('toggle');
        var resultstring='<table class="table">';
        resultstring+= '<th>'+ 'No' + '</th>';
        resultstring+= '<th>'+ 'Time Recorded' + '</th>';
        resultstring+= '<th>'+ 'Medication Name' + '</th>';
        resultstring+= '<th>'+ 'Dosage/Quantity' + '</th>';
        resultstring+= '<th>'+ 'Unit' + '</th>';
        $(resultSet).each(function(i, result) {
          resultstring+='<tr>';
          resultstring+='<td>'+ i + '</td>';
          resultstring+='<td>'+ result.time + '</td>';
          resultstring+='<td>'+ result.medicationName + '</td>';
          resultstring+='<td>'+ result.dosage.split(" ")[0] + '</td>';
          resultstring+='<td>'+ result.dosage.split(" ")[1] + '</td>';
          resultstring+='</tr>';
        });
        resultstring+='</table>';
        $('#getMedicationsTable').html(resultstring);
        //console.log(data.branded[0].food_name);
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log('Error: ' + xhr.responseText);
      }
    });
  });

  $("#searchFoodButton").click(function(){
    var name = $("#mealName").val()
    var resultSet = null;
    $.ajax({
      type: "GET",
      url:"http://localhost:8080/food/find?foodName="+ name,
      success: function (data) {
        resultSet = data.branded;
        $('#searchFood').modal('toggle');
        var resultstring='<table class="table">';
        resultstring+= '<th>'+ 'No' + '</th>';
        resultstring+= '<th>'+ 'Food name' + '</th>';
        resultstring+= '<th>'+ 'Calories' + '</th>';
        resultstring+= '<th>'+ 'Serving quantity' + '</th>';
        resultstring+= '<th>'+ 'Select' + '</th>';
        $(resultSet).each(function(i, result) {
          resultstring+='<tr>';
            resultstring+='<td>'+ i+ '</td>';
            resultstring+='<td>'+ result.food_name + '</td>';
            resultstring+='<td>'+ result.nf_calories + '</td>';
            resultstring+='<td>'+ result.serving_qty + '</td>';
            resultstring+="<td><button id='selectFoodButton'  type='button' class='btn btn-primary'>Select</button></td>";
          resultstring+='</tr>';
        });
        resultstring+='</table>';
        $('#searchFoodTable').html(resultstring);
        //console.log(data.branded[0].food_name);
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log('Error: ' + xhr.responseText);
      }
    });
  });

  $("#searchMedicineButton").click(function(){
    var name = $("#medicineName").val()
    var resultSet = null;
    $.ajax({
      type: "GET",
      url:"http://localhost:8080/medication/find?medicationName="+ name,
      success: function (data) {
        resultSet = data;
        $('#searchMedicine').modal('toggle');
        var resultstring='<table class="table">';
        resultstring+= '<th>'+ 'No' + '</th>';
        resultstring+= '<th>'+ 'Medicine name' + '</th>';
        resultstring+= '<th>'+ 'Type' + '</th>';
        resultstring+= '<th>'+ 'Select' + '</th>';
        $(resultSet).each(function(i, result) {
          var unescapedString = unescape(result);
          var splitVal = unescapedString.split(",")
          resultstring+='<tr>';
          resultstring+='<td>'+ i+ '</td>';
          resultstring+='<td>'+ splitVal[2].replaceAll('"',"") + '</td>';
          resultstring+='<td>'+ splitVal[3].replaceAll('"',"") + '</td>';
          resultstring+="<td><button id='selectMedicineButton'  type='button' class='btn btn-primary'>Select</button></td>";
          resultstring+='</tr>';
        });
        resultstring+='</table>';
        $('#searchMedicineTable').html(resultstring);
        //console.log(data.branded[0].food_name);
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log('Error: ' + xhr.responseText);
      }
    });
  });


  $("#searchFood #searchFoodTable").on("click", "#selectFoodButton", function(){
    var $row = $(this).closest("tr"),       // Finds the closest row <tr>
        $tds = $row.find("td");             // Finds all children <td> elements
    var result='';
    $.each($tds, function() {               // Visits every single <td> element
      console.log($(this).text());        // Prints out the text within the <td>
      result+=$(this).text()+':';
    });
    $('#searchFood').modal('hide');
    $('#foodInfo').val(result);
    $('#mealName').val(result.split(":")[1]);
  });

  $("#closeSearch").click(function(){
    $('#searchFood').modal('hide');
  });

  $("#searchMedicine #searchMedicineTable").on("click", "#selectMedicineButton", function(){
    var $row = $(this).closest("tr"),       // Finds the closest row <tr>
        $tds = $row.find("td");             // Finds all children <td> elements
    var result='';
    $.each($tds, function() {               // Visits every single <td> element
      result+=$(this).text()+':';
    });
    $('#searchMedicine').modal('hide');
    $('#medicalInfo').val(result);
    var resultSplit=result.split(":");
    var resultSplit2 = resultSplit[1].split(" ");
    var word =null;
    for(var i=0; i<resultSplit2.length; i++){
      if(resultSplit2[i].includes("MG") || resultSplit2[i].includes("MG\\ML") || resultSplit2[i].includes("ML")){
        word = resultSplit2[i];
      }
    }
    if(word!==null) {
      $('#medicineName').val(resultSplit[1].replaceAll(word, ""));
      $('#medicationUnit').val(word);
    }else{
      $('#medicineName').val(resultSplit[1]);
      var med = $('#medicationUnit').val();
      console.log(med);
      if(med!==null){}
      $('#medicationUnit').val("");
    }
  });

  $("#closeMedicationSearch").click(function(){
    $('#searchMedicine').modal('hide');
  });
})(jQuery); // End of use strict
