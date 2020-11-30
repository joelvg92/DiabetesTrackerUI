// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

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

function Last7Days () {
  var result = [];
  for (var i=7; i>0; i--) {
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
    console.log(date1+":"+date2);
    if(date2<date1){
      objectArray.splice(i,1);
    }
  }
  return objectArray;
}


function getData(){
  var patientId = localStorage.getItem("user");
  var resultSet = null;
  var results = [];
  $.ajax({
    type: "GET",
    url:"https://diabetes-tracker-backend.herokuapp.com/observation/"+ patientId,
    async: false,
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
      if(results.length<=7){
        var length =(7 - results.length);
        for(var j=0; j<length; j++){
          results.unshift(0);
        }
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log('Error: ' + xhr.responseText);
    }
})
  console.log(results);
  return results;
}

// Area Chart Example
var ctx = document.getElementById("myAreaChart2");
var result = Last7Days();
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: result,
    datasets: [{
      label: "Diabetic record",
      lineTension: 0.3,
      backgroundColor: "rgba(78, 115, 223, 0.05)",
      borderColor: "rgba(78, 115, 223, 1)",
      pointRadius: 3,
      pointBackgroundColor: "rgba(78, 115, 223, 1)",
      pointBorderColor: "rgba(78, 115, 223, 1)",
      pointHoverRadius: 3,
      pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
      pointHoverBorderColor: "rgba(78, 115, 223, 1)",
      pointHitRadius: 10,
      pointBorderWidth: 2,
      data: getData(),
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          maxTicksLimit: 5,
          padding: 10,
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
            return number_format(value) + ' mg/dL';
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': ' + number_format(tooltipItem.yLabel) + ' mg/dL';
        }
      }
    }
  }
});
