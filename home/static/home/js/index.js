function draw_example_radar_chart() {
  var example_radar_chart = echarts.init(document.getElementById('example-radar-chart'), 'macarons');
  var indicator = ['Price', 'Smell', 'Effect', 'Packaging', 'Retention', 'Pure Emotion', 'Other']
    //  var label = ['price_score', 'smell_score', 'effect_score', 'packaging_score', 'retention_score', 'pure_emotion_score', 'other_score'];
  var option = {
    tooltip: {},
    legend: {
      data: ['Product 1', 'Product 2'],
      orient: 'horizontal',
      left: 'center',
      bottom: 0
    },
    radar: {
      // shape: 'circle',
      indicator: indicator.map(function (d) {
        return {
          name: d,
          max: 100,
          min: 0
        }
      })
    },
    series: [{
      type: 'radar',
      data: [{
        value: [80, 30, 58, 65, 55, 68, 60],
        name: 'Product 1'
      }, {
        value: [70, 50, 60, 80, 60, 70, 65],
        name: 'Product 2'
      }]
    }]
  };

  example_radar_chart.setOption(option);
  window.addEventListener("resize", function () {
    example_radar_chart.resize();
  });
}


function draw_example_pie_chart() {
  var skin_name = ['Dry', 'Normal', 'Combination', 'Oil', 'Sensitive']
  var fake_score = [300, 100, 80, 20, 30]
  var skin_data = [];
  for (var i = 0; i < skin_name.length; i++) {
    var temp_score = fake_score[i]
    skin_data.push({
      value: temp_score,
      name: skin_name[i]
    });
  }
  var example_pie_chart = echarts.init(document.getElementById('example-pie-chart'), 'macarons');

  var option = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      data: skin_name,
      x: 'center',
      y: 'bottom'
    },

    series: [{
      'name': 'Skin Type',
      type: 'pie',
      radius: '55%',
      center: ['50%', '40%'],
      data: skin_data,
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        normal: {
          formatter: "{b} ({d}%)"
        },
        emphasis: {
          textStyle: {
            fontSize: 13,
          }
        }
      }

    }]
  };
  example_pie_chart.setOption(option);
  window.addEventListener("resize", function () {
    example_pie_chart.resize();
  });

}

function draw_example_polar() {

  var example_polar_chart = echarts.init(document.getElementById('example-polar-chart'), 'macarons');

  var fake_data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Sink detox', 'Sun Protection', 'Facial Steaming', 'Lotion Mask', 'Facial Oil']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Sink detox',
        type: 'line',
//        stack: 'count',
        data: fake_data.map(function (d) {
          return Math.round(Math.random() * 10000 + Math.random() * 1000 + 200);
        })
        },
      {
        name: 'Sun Protection',
        type: 'line',
//        stack: 'count',
        data: fake_data.map(function (d) {
          return Math.round(Math.random() * 10000 + Math.random() * 1000 + 200);
        })
        },
      {
        name: 'Facial Steaming',
        type: 'line',
//        stack: 'count',
        data: fake_data.map(function (d) {
          return Math.round(Math.random() * 10000 + Math.random() * 1000 + 200);
        })
        },
      {
        name: 'Lotion Mask',
        type: 'line',
//        stack: 'count',
        data: fake_data.map(function (d) {
          return Math.round(Math.random() * 10000 + Math.random() * 1000 + 200);
        })
        },
      {
        name: 'Facial Oil',
        type: 'line',
//        stack: 'count',
        data: fake_data.map(function (d) {
          return Math.round(Math.random() * 10000 + Math.random() * 1000 + 200);
        })
        }
    ]
  };
  example_polar_chart.setOption(option);
  window.addEventListener("resize", function () {
    example_polar_chart.resize();
  });

}


$(document).ready(function () {
  // Add smooth scrolling to all links in navbar + footer link
  $(".navbar a, footer a[href='#myPage']").on('click', function (event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 900, function () {

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });

  $(window).scroll(function () {
    $(".slideanim").each(function () {
      var pos = $(this).offset().top;

      var winTop = $(window).scrollTop();
      if (pos < winTop + 600) {
        $(this).addClass("slide");
      }
    });
  });


  var video_height = $('#home_video').height() + 50;
  $('div.video_wrapper').height(video_height);

  window.addEventListener("resize", function () {
    var video_height = $('#home_video').height() + 50;
    $('div.video_wrapper').height(video_height);
  });

  draw_example_radar_chart();
  draw_example_pie_chart();
  draw_example_polar();


  $("#contact button").click(function (e) {

    var customer_name = $('input[name=name]').val();
    var customer_email = $('input[name=email]').val();
    var comments = $('textarea[name=comments]').val();
    var contact_url = $('input[name=contact]').val();
    var token = $('input[name=csrfmiddlewaretoken]').val();

    if (customer_name == '' || customer_email == '' || comments == '')
      return

    $.post(contact_url, {
      'csrfmiddlewaretoken': token,
      'name': customer_name,
      'email': customer_email,
      'comments': comments
    }, function (data) {
      if (data['status'] == 'success') {
        $('#myModal .modal-body p').html('We recieved your request and will contact you soon!');
        $('input[name=name]').val('');
        $('input[name=email]').val('');
        $('textarea[name=comments]').val('');
      } else if (data['status'] == 'email fail') {
        $('#myModal .modal-body p').html(data['errors'])
      } else if ('email' in data['errors']) {
        $('#myModal .modal-body p').html(data['errors']['email'])
      } else if ('name' in data['errors']) {
        $('#myModal .modal-body p').html(data['errors']['name'])
      } else if ('comments' in data['errors']) {
        $('#myModal .modal-body p').html(data['errors']['comments'])
      }
    })
  });



});