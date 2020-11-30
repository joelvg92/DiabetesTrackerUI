function formatDate(date){
  var dd = date.getDate();
  var mm = date.getMonth()+1;
  var yyyy = date.getFullYear();
  if(dd<10) {dd='0'+dd}
  if(mm<10) {mm='0'+mm}
  date = mm+'/'+dd+'/'+yyyy;
  return date
}

function formateDatev2(date){
  var date = new Date(date);
  return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
}

function Last1Days () {
  var result = [];
  for (var i=1; i>0; i--) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    result.push( formatDate(d) )
  }

  return result;
}

function Last7Days () {
  var result = [];
  for (var i=1; i>0; i--) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    result.push( formatDate(d) )
  }

  return result;
}

function groupBy(objectArray, property) {
  return objectArray.reduce(function (acc, obj) {
    var key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}

function updateData(objectArray){
  for(var i=0; i<objectArray.length; i++){
    var val =objectArray[i].time.split(":")[0];
    objectArray[i].time = val;
  }
  return objectArray;
}

function updateData2(objectArray,date){
  for(var i=0; i<objectArray.length; i++){
    var date1=new Date(date);
    var date2=new Date(formateDatev2(objectArray[i].time));
    if(date2<date1){
      objectArray.splice(i,1);
    }
  }
  return objectArray;
}


function getData(){
  var patientId = localStorage.getItem("user");
  $.ajax({
    type: "GET",
    url:"https://diabetes-tracker-backend.herokuapp.com/nutritionOrder/"+ patientId,
    async: true,
    success: function (data) {
      var resultSet = updateData(data);
      var resultSet2=updateData2(resultSet,Last1Days()[0]);
      var groups = groupBy(resultSet2,'time');
      var sum=0;
      for(var key in groups){
        for(var i =0; i<groups[key].length; i++){
          sum+=Number(groups[key][i].calories);
        }
      }
      $('#TotalCalorieCount').text(sum);
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log('Error: ' + xhr.responseText);
    }
  })
}

function getData2(){
  var patientId = localStorage.getItem("user");
  var resultSet = null;
  var results = [];
  $.ajax({
    type: "GET",
    url:"https://diabetes-tracker-backend.herokuapp.com/nutritionOrder/"+ patientId,
    async: true,
    success: function (data) {
      resultSet = updateData(data);
      var resultSet2=updateData2(resultSet,Last7Days()[0]);
      var groups = groupBy(resultSet2,'time');
      var counter=0;
      for(var key in groups){
        var sum=0;
        for(var i =0; i<groups[key].length; i++){
          sum+=Number(groups[key][i].calories);
        }
        results[counter] =sum;
        counter++;
      }
      var dataArr= Math.max.apply(Math, results.map(function(o) { return o;}))
      if(Number(dataArr) > 2000){
        $('#foodIntakeStatus').text('Food intake is high, please control the diet!!');
      }else{
        $('#foodIntakeStatus').text('Food intake is normal,good job!!');
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log('Error: ' + xhr.responseText);
    }
  })
  return results;
}

function getData3(){
  var patientId = localStorage.getItem("user");
  var resultSet = null;
  var results = [];
  $.ajax({
    type: "GET",
    url:"https://diabetes-tracker-backend.herokuapp.com/observation/"+ patientId,
    async: true,
    success: function (data) {
      resultSet = updateData(data);
      var resultSet2=updateData2(resultSet,Last7Days()[0]);
      var groups = groupBy(resultSet2,'time');
      var counter=0;
      for(var key in groups){
        var dataArr= Math.max.apply(Math, groups[key].map(function(o) { return o.diabeticRecord; }))
        results[counter] =dataArr;
        counter++;
      }
      var maxVal= Math.max.apply(Math, results.map(function(o) { return o; }))
      if(Number(maxVal) > 200){
        $('#diabeticRecordStatus').text('Diabetic record is high!!');
      }else{
        $('#diabeticRecordStatus').text('Diabetic record is normal,good job!!');
      }
      if(results.length<=7){
        var length =(7 - results.length);
        for(var j=0; j<length; j++){
          results.unshift(0);
        }
      }
      console.log(results[6]);
      if(results[6]==Number(0)) {
        addAlert('Please take your medications and enter the blood sugar reading');
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log('Error: ' + xhr.responseText);
    }
  })
}

function addAlert(message) {
  $('#alertss').append(
      '<div class="alert alert-success alert-dismissible">' +
      '<button type="button" class="close" data-dismiss="alert">' +
      '&times;</button>' + message + '</div>');
}

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

  $("#closePastMealsModal").click(function(){
    $("#pastMealsModal").trigger("reset");
    $('#pastMealsModal').modal('hide');
  });

  $("#closeGetMedications").click(function(){
    $("#getMedications").trigger("reset");
    $('#getMedications').modal('hide');
  });

  $("#closePastObservationsModal").click(function(){
    $("#pastObservationsModal").trigger("reset");
    $('#pastObservationsModal').modal('hide');
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
      url: "https://diabetes-tracker-backend.herokuapp.com/login",
      data: JSON.stringify({ username: username, password: password }),
      contentType: 'application/json',
      success: function(response, textStatus, xhr) {
        console.log(response);
        localStorage.setItem("user", response.patientId);
        localStorage.setItem("username", response.username);
        window.location = "index.html";
      },
      error: function(xhr, textStatus, errorThrown) {
        console.log("error");
        $("#errorMessage").removeClass('d-none');
      }
    });
    return false;
  });

  $("form#signup").submit(function() {
    var username = $('#username').val();
    var password = $('#password').val();
    var name = $('#firstName').val() + " "+ $('#lastName').val();
    var gender = $('#gender').val();
    var age = $('#age').val();
    $.ajax({
      type: "POST",
      url: "https://diabetes-tracker-backend.herokuapp.com/signup",
      data: JSON.stringify({ username: username, password: password, name:name,gender:gender,age:age,email:'testemail123@gmail.com',phone:'2012203000',dob:'1993-10-25' }),
      contentType: 'application/json',
      success: function(response, textStatus, xhr) {
        console.log(response);
        localStorage.setItem("user", response.patientId);
        localStorage.setItem("username", response.username);
        window.location = "index.html";
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
      url: "https://diabetes-tracker-backend.herokuapp.com/observation",
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
      url: "https://diabetes-tracker-backend.herokuapp.com/nutritionOrder",
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
      url: "https://diabetes-tracker-backend.herokuapp.com/medication",
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
      url:"https://diabetes-tracker-backend.herokuapp.com/medication/"+ patientId,
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

  $("#pastObservations").click(function(){
    var patientId = localStorage.getItem("user");
    var resultSet = null;
    $.ajax({
      type: "GET",
      url:"https://diabetes-tracker-backend.herokuapp.com/observation/"+ patientId,
      success: function (data) {
        resultSet = data;
        //$('#searchFood').modal('toggle');
        var resultstring='<table class="table">';
        resultstring+= '<th>'+ 'No' + '</th>';
        resultstring+= '<th>'+ 'Time Recorded' + '</th>';
        resultstring+= '<th>'+ 'Diabetic Value' + '</th>';
        $(resultSet).each(function(i, result) {
          resultstring+='<tr>';
          resultstring+='<td>'+ i + '</td>';
          resultstring+='<td>'+ result.time + '</td>';
          resultstring+='<td>'+ result.diabeticRecord +' mg/dL' + '</td>';
          resultstring+='</tr>';
        });
        resultstring+='</table>';
        $('#pastObservationsTable').html(resultstring);
        //console.log(data.branded[0].food_name);
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log('Error: ' + xhr.responseText);
      }
    });
  });

  $("#pastMeals").click(function(){
    var patientId = localStorage.getItem("user");
    var resultSet = null;
    $.ajax({
      type: "GET",
      url:"https://diabetes-tracker-backend.herokuapp.com/nutritionOrder/"+ patientId,
      success: function (data) {
        resultSet = data;
        //$('#searchFood').modal('toggle');
        var resultstring='<table class="table">';
        resultstring+= '<th>'+ 'No' + '</th>';
        resultstring+= '<th>'+ 'Time Recorded' + '</th>';
        resultstring+= '<th>'+ 'Food Name' + '</th>';
        resultstring+= '<th>'+ 'Meal Size' + '</th>';
        resultstring+= '<th>'+ 'Calories' + '</th>';
        $(resultSet).each(function(i, result) {
          resultstring+='<tr>';
          resultstring+='<td>'+ i + '</td>';
          resultstring+='<td>'+ result.time + '</td>';
          resultstring+='<td>'+ result.foodName + '</td>';
          resultstring+='<td>'+ result.mealSize + '</td>';
          resultstring+='<td>'+ result.calories + '</td>';
          resultstring+='</tr>';
        });
        resultstring+='</table>';
        $('#pastMealsTable').html(resultstring);
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
      url:"https://diabetes-tracker-backend.herokuapp.com/food/find?foodName="+ name,
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
      url:"https://diabetes-tracker-backend.herokuapp.com/medication/find?medicationName="+ name,
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

  $("#logoutProcess").click(function(){
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    window.location = "login.html";
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
