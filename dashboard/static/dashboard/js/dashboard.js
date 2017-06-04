global_param = {
  'theme': 'macarons',
  'loading': {
    text: 'Loading...',
    color: '#3c8dbc',
    textColor: '#000',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0
  }
};

function init() {
  var token = $('input[name=csrfmiddlewaretoken]').val(),
    product_nav = $('input[name=product_nav]').val();

  $.post(product_nav, {
    'csrfmiddlewaretoken': token,
    'option': 1,
    'value': ''
  }, function (raw_data) {
    data = raw_data['result']
    var html = '<select data-placeholder="Choose a brand..." class="chosen-select" tabindex="1">';
    html += '<option value=""></option>';

    //    previous_brand = null
    for (var i in data) {
      item = data[i];
      html += '<option value=' + item['brand_id'] + '>' + item['brand_name'] + '</option>'
    }
    html += '</select>'
    $('#brand_list').html(html);
    $("#product_nav .chosen-select").chosen({
      width: "100%"
    });

    $('#brand_list .chosen-select').chosen().change(get_category)
  })


  //draw example chart
  draw_example_bar_chart();
  draw_example_radar_chart();
  draw_example_pie_chart1();
  draw_example_pie_chart2();
  draw_example_hbar_chart();


}

function get_category() {
  var brand_id = $('#brand_list .chosen-select').chosen().val()
  var token = $('input[name=csrfmiddlewaretoken]').val();
  var product_nav = $('input[name=product_nav]').val();
  $.post(product_nav, {
    'csrfmiddlewaretoken': token,
    'option': 2,
    'value': brand_id
  }, function (raw_data) {
    data = raw_data['result'];

    var previous_major_category = null
    var html = '<select data-placeholder="Choose a category..." class="chosen-select" tabindex="2">';
    html += '<option value=""></option>';

    for (var index in data) {
      var item = data[index];
      if (item['sub_category_name'] == 'Unknown')
        item['sub_category_name'] = 'All / Others'
      if (previous_major_category == null) {
        previous_major_category = item['major_category_name']
        html += '<optgroup label="' + previous_major_category + '">'
      } else if (previous_major_category != item['major_category_name']) {
        previous_major_category = item['major_category_name']
        html += '</optgroup>'
        html += '<optgroup label="' + previous_major_category + '">'
      }
      html += '<option value=' + item['major_category_id'] + ',' + item['sub_category_id'] + '>' +
        previous_major_category + ': ' + item['sub_category_name'] + '</option>'
    }
    html += '</optgroup>'
    html += '</select>'
    $('#category_list').html(html);
    $("#product_nav .chosen-select").chosen({
      width: "100%"
    });

    $('#category_list .chosen-select').chosen().change(get_product)
  });

}

function get_product() {
  var brand_id = $('#brand_list .chosen-select').chosen().val();
  var category_id = $('#category_list .chosen-select').chosen().val()
  var token = $('input[name=csrfmiddlewaretoken]').val();
  var product_nav = $('input[name=product_nav]').val();
  $.post(product_nav, {
    'csrfmiddlewaretoken': token,
    'option': 3,
    'value': brand_id + ',' + category_id
  }, function (raw_data) {
    data = raw_data['result']

    var html = '<select data-placeholder="Choose a product..." class="chosen-select" tabindex="3">';
    html += '<option value=""></option>';

    //    previous_brand = null
    for (var i in data) {
      item = data[i];

      html += '<option value=' + item['product_id'] + '>' + item['product_name'] + ' (' + item['num'] + ')' + '</option>'
    }
    html += '</select>'
    $('#product_list').html(html);
    $("#product_list .chosen-select").chosen({
      width: "100%"
    });

    $('#product_list .chosen-select').chosen().change(function () {
      var product_id = parseInt($('#product_list .chosen-select').chosen().val());
      submit_product(product_id);

    })
  })

}


function draw_example_bar_chart() {
  var example_bar_chart = echarts.init(document.getElementById('example-bar-chart'));
  var option = {
    //    color: ['#3398DB', '#D14A61'],
    legend: {
      data: ['Score', '# of Records']
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    xAxis: {
      name: 'Attribute',
      nameLocation: 'middle',
      nameGap: 25,
      type: 'category',
      data: ['Price', 'Smell', 'Effect', 'Packaging', 'Retention', 'Pure Emotion', 'Other'],
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Score',
        position: 'left',
        axisLine: {
          lineStyle: {
            //            color: '#3398DB'
          }
        },
        min: 0,
        max: 100
      },
      {
        type: 'value',
        name: '# of Records',
        position: 'right',
        axisLine: {
          lineStyle: {
            color: '#D14A61'
          }
        }
      },

    ],

    series: [
      {
        name: 'Score',
        type: 'bar',
        data: [80, 30, 50, 40, 20, 30, 45],
        yAxisIndex: 0,
        itemStyle: {
          normal: {
            color: function (params) {
              // build a color map as your need.
              var colorList = ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
            '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
            '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
            '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'];
              return colorList[params.dataIndex]
            }
          }
        }
      },
      {
        name: '# of Records',
        type: 'line',
        yAxisIndex: 1,
        data: [1000, 800, 1400, 700, 900, 1300, 1200],
        smooth: false
        }
        ]
  };
  example_bar_chart.setOption(option);
  window.addEventListener("resize", function () {
    example_bar_chart.resize();
  });

}


function draw_example_radar_chart() {
  var example_radar_chart = echarts.init(document.getElementById('example-radar-chart'), global_param['theme']);
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
      }),
      name: {
        textStyle: {
          color: '#3c8dbc'
        }
      },
      //      radius: '50%'
    },
    series: [{
      type: 'radar',

      data: [{
        value: [80, 30, 50, 40, 20, 30, 45],
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

function draw_example_pie_chart2() {
  //  console.log(data);
  var example_pie_chart2 = echarts.init(document.getElementById('example-pie-chart2'), global_param['theme']);

  var option = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      data: ['Greasy', 'Light'],
      x: 'center',
      y: 'bottom'

    },

    series: [{
      'name': 'Texture',
      type: 'pie',
      radius: '55%',
      center: ['50%', '40%'],
      data: [{
        value: 800,
        name: 'Greasy'
      }, {
        value: 1200,
        name: 'Light'
      }],
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
  example_pie_chart2.setOption(option);
  window.addEventListener("resize", function () {
    example_pie_chart2.resize();
  });
}

function draw_example_pie_chart1() {
  var skin_name = ['Dry', 'Normal', 'Combination', 'Oil', 'Sensitive']
  var fake_score = [300, 100, 100, 20, 30]
  var skin_data = [];
  for (var i = 0; i < skin_name.length; i++) {
    var temp_score = fake_score[i]
    skin_data.push({
      value: temp_score,
      name: skin_name[i]
    });
  }
  var example_pie_chart1 = echarts.init(document.getElementById('example-pie-chart1'), global_param['theme']);

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
  example_pie_chart1.setOption(option);
  window.addEventListener("resize", function () {
    example_pie_chart1.resize();
  });

}

function draw_example_hbar_chart() {
  var example_hbar_chart = echarts.init(document.getElementById('example-hbar-chart'), global_param['theme']);

  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '{a} <br /> {b}: {c}%'
    },

    grid: {
      left: '20%',
      top: '5%'
    },
    legend: {},
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%'
      }
    },
    yAxis: {
      type: 'category',
      data: ['Skincare - Body', 'Skincare - Face', 'Lips', 'Bronzers', 'Self Tanners', 'Fragrances', 'Suncreen', 'Foundations'],
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        show: false
      }
    },

    series: [
        {
          name: 'Brand XX',
          type: 'bar',
          stack: 'pct',
          label: {
            normal: {
              show: true,
              position: 'right',
              formatter: '{c}%'
            }
          },
          itemStyle: {
            normal: {
              color: function (params) {
                // build a color map as your need.
                var colorList = [
                          '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                           '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                           '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                        ];
                return colorList[params.dataIndex]
              },
              label: {
                show: true,
                position: 'top',
                formatter: '{b}\n{c}'
              }
            }
          },
          data: [1, 2, 3, 5, 8, 10, 12, 13],


      }
    ]
      //    series: data
  };
  example_hbar_chart.setOption(option);
  window.addEventListener("resize", function () {
    example_hbar_chart.resize();
  });
}

// search product and draw the result

function draw_score_for_each_attribute(data, score_for_each_attribute) {
  //  var score_for_each_attribute = echarts.init(document.getElementById('score_for_each_attribute'));

  var score_data = [data['price_score'], data['smell_score'], data['effect_score'], data['packaging_score'], data['retention_score'], data['pure_emotion_score'], data['other_score']];
  var num_data = [data['price_num'], data['smell_num'], data['effect_num'], data['packaging_num'], data['retention_num'], data['pure_emotion_num'], data['other_num']]
  score_data = score_data.map(function (d) {
    return d == null ? null : d.toFixed(1);
  })

  $('div#score_for_each_attribute').parent().prev().children().text('Score for Each Attribute')
  var option = {
    //    color: ['#3398DB', '#D14A61'],
    //    title: {
    //      text: 'Score for Each Attribute',
    //    },
    legend: {
      data: ['Score', '# of Records']
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    grid: {
      left: '5%',
      right: '10%'
    },
    xAxis: {
      name: 'Attribute',
      nameLocation: 'middle',
      nameGap: 25,
      type: 'category',
      data: ['Price', 'Smell', 'Effect', 'Packaging', 'Retention', 'Pure Emotion', 'Other'],
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Score',
        position: 'left',
        axisLine: {
          lineStyle: {
            //            color: '#3398DB'
          }
        },
        min: 0,
        max: 100,


      },
      {
        type: 'value',
        name: '# of Records',
        position: 'right',
        axisLine: {
          lineStyle: {
            color: '#D14A61'
          }
        }
      },

    ],

    series: [
      {
        name: 'Score',
        type: 'bar',
        data: score_data,
        yAxisIndex: 0,
        itemStyle: {
          normal: {
            color: function (params) {
              // build a color map as your need.
              var colorList = ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
            '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
            '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
            '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'];
              return colorList[params.dataIndex]
            }
          }
        }
      },
      {
        name: '# of Records',
        type: 'line',
        yAxisIndex: 1,
        data: num_data
      }
    ]
  };
  score_for_each_attribute.hideLoading();
  score_for_each_attribute.setOption(option);
  window.addEventListener("resize", function () {
    score_for_each_attribute.resize();
  });

}

function draw_vote_for_skin_type(data, vote_for_skin_type) {
  var skin_name = ['Dry', 'Normal', 'Combination', 'Oil', 'Sensitive'];
  var skin_score = [data['skin_dry_score'], data['skin_normal_score'], data['skin_combination_score'], data['skin_oil_score'], data['skin_sensitive_num']];
  var skin_num = [data['skin_dry_num'], data['skin_normal_num'], data['skin_combination_num'], data['skin_oil_num'], data['skin_sensitive_num']];
  var skin_data = [];
  var total_score = 0;
  for (var i = 0; i < skin_score.length; i++) {

    if (skin_num[i] > 0) {

      var temp_score = (skin_score[i] * skin_num[i]).toFixed(0);
      total_score += temp_score;
      skin_data.push({
        value: temp_score,
        name: skin_name[i]
      });
    }
  }
  //  var vote_for_skin_type = echarts.init(document.getElementById('vote_for_skin_type'), global_param['theme']);

  var option = {
    //    title: {
    //      text: 'Votes for Skin Type',
    //      x: 'center'
    //    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      data: skin_data.map(function (d) {
        return d.name;
      }),
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
  vote_for_skin_type.hideLoading();
  vote_for_skin_type.setOption(option);
  window.addEventListener("resize", function () {
    vote_for_skin_type.resize();
  });

}

function draw_vote_for_texture(data, vote_for_texture) {
  //  console.log(data);
  var texture_name = ['Greasy', 'Light']
  var texture_score = [data['texture_greasy_score'], data['texture_light_score']];
  var texture_num = [data['texture_greasy_num'], data['texture_light_num']];
  var texture_data = [];
  var total_score = 0;
  for (var i = 0; i < texture_score.length; i++) {
    if (texture_num[i] > 0) {
      var temp_score = (texture_score[i] * texture_num[i]).toFixed(0);
      total_score += temp_score;
      texture_data.push({
        value: temp_score,
        name: texture_name[i]
      });
    }
  }
  //  var vote_for_texture = echarts.init(document.getElementById('vote_for_texture'), global_param['theme']);

  var option = {
    //    title: {
    //      text: 'Votes for Texture',
    //      x: 'center'
    //    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      data: texture_name,
      x: 'center',
      y: 'bottom'

    },

    series: [{
      'name': 'Texture',
      type: 'pie',
      radius: '55%',
      center: ['50%', '40%'],
      data: texture_data,
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
  vote_for_texture.hideLoading();
  vote_for_texture.setOption(option);
  window.addEventListener("resize", function () {
    vote_for_texture.resize();
  });
}


function draw_product_rank_table(data) {
  //  console.log(data);
  var marker = "<span class='glyphicon glyphicon-ok'></span>";

  var price_rank = data['price_score_rank_sub'] / data['price_score_rank_sub_total'];
  var smell_rank = data['smell_score_rank_sub'] / data['smell_score_rank_sub_total'];
  var effect_rank = data['effect_score_rank_sub'] / data['effect_score_rank_sub_total'];
  var packaging_rank = data['packaging_score_rank_sub'] / data['packaging_score_rank_sub_total'];
  var emotion_rank = data['pure_emotion_score_rank_sub'] / data['pure_emotion_score_rank_sub_total'];
  var retention_rank = data['retention_score_rank_sub'] / data['retention_score_rank_sub_total'];
  var other_rank = data['other_score_rank_sub'] / data['other_score_rank_sub_total'];


  html = "<table class='table table-bordered'>";
  html += "<tr class='row'>"

  //  if(data['sub_category_id'] == 1)
  html += "<th class='col-xs-3'></th>"

  html += "<th class='col-xs-1 text-center'>Price</th><th class='col-xs-1 text-center'>Smell</th><th class='col-xs-1 text-center'>Effect</th><th class='col-xs-2 text-center'>Packaging</th><th class='col-xs-2 text-center'>Pure Emotion</th><th class='col-xs-1 text-center'>Retention</th><th class='col-xs-1 text-center'>Other</th></tr>";

  html += "<tr class='row color-top20'><th class='text-center'>Well Above Average<br>(top 20%)</th>";
  html += "<td class='text-center'>";
  if (price_rank > 0 & price_rank <= 0.2)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (smell_rank > 0 & smell_rank <= 0.2)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (effect_rank > 0 & effect_rank <= 0.2)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (packaging_rank > 0 & packaging_rank <= 0.2)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (emotion_rank > 0 & emotion_rank <= 0.2)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (retention_rank > 0 & retention_rank <= 0.2)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (other_rank <= 0.2)
    html += marker;
  html += "</td>";
  html += '</tr>';

  html += "<tr class='row color-top40'><th class='text-center'>Above Average<br>(top 40%)</th>";
  html += "<td class='text-center'>";
  if (price_rank <= 0.4 && price_rank > 0.2)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (smell_rank <= 0.4 && smell_rank > 0.2)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (effect_rank <= 0.4 && effect_rank > 0.2)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (packaging_rank <= 0.4 && packaging_rank > 0.2)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (emotion_rank <= 0.4 && emotion_rank > 0.2)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (retention_rank <= 0.4 && retention_rank > 0.2)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (other_rank <= 0.4 && other_rank > 0.2)
    html += marker;
  html += "</td>";
  html += '</tr>';

  html += "<tr class='row color-avg'><th class='text-center'>Average<br>(40% ~ 60%)</th>";
  html += "<td class='text-center'>";
  if (price_rank <= 0.6 && price_rank > 0.4)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (smell_rank <= 0.6 && smell_rank > 0.4)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (effect_rank <= 0.6 && effect_rank > 0.4)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (packaging_rank <= 0.6 && packaging_rank > 0.4)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (emotion_rank <= 0.6 && emotion_rank > 0.4)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (retention_rank <= 0.6 && retention_rank > 0.4)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (other_rank <= 0.6 && other_rank > 0.4)
    html += marker;
  html += "</td>";
  html += '</tr>';

  html += "<tr class='row color-bot40'><th class='text-center'>Below Average<br>(Bottom 40%)</th>";
  html += "<td class='text-center'>";
  if (price_rank <= 0.8 && price_rank > 0.6)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (smell_rank <= 0.8 && smell_rank > 0.6)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (effect_rank <= 0.8 && effect_rank > 0.6)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (packaging_rank <= 0.8 && packaging_rank > 0.6)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (emotion_rank <= 0.8 && emotion_rank > 0.6)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (retention_rank <= 0.8 && retention_rank > 0.6)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (other_rank <= 0.8 && other_rank > 0.6)
    html += marker;
  html += "</td>";
  html += '</tr>';

  html += "<tr class='row color-bot20'><th class='text-center'>Well Below Average<br>(Bottom 20%)</th>";
  html += "<td class='text-center'>";
  if (price_rank > 0.8)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (smell_rank > 0.8)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (effect_rank > 0.8)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (packaging_rank > 0.8)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (emotion_rank > 0.8)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (retention_rank > 0.8)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (other_rank > 0.8)
    html += marker;
  html += "</td>";
  html += '</tr>';

  $('#rank_attribute').html(html);
}


function draw_brand_relation(data, brand_relation) {
  //  var brand_relation = echarts.init(document.getElementById('brand_relation'), global_param['theme']);
  var data_tree = [];

  function product_children(product) {
    var name_list = ['effect', 'other', 'packaging', 'price', 'pure_emotion', 'retention', 'skin_combination', 'skin_dry', 'skin_oil', 'skin_sensitive', 'smell', 'texture_greasy', 'texture_light', 'usage'];
    var score_list = ['effect_score', 'other_score', 'packaging_score', 'price_score', 'pure_emotion_score', 'retention_score', 'skin_combination_score', 'skin_dry_score', 'skin_oil_score', 'skin_sensitive_score', 'smell_score', 'texture_greasy_score', 'texture_light_score', 'usage_score'];
    var num_list = ['effect_num', 'other_num', 'packaging_num', 'price_num', 'pure_emotion_num', 'retention_num', 'skin_combination_num', 'skin_dry_num', 'skin_oil_num', 'skin_sensitive_num', 'smell_num', 'texture_greasy_num', 'texture_light_num', 'usage_num'];
    var result = [];

    for (var i in name_list) {
      result.push({
        name: name_list[i],
        value: product[num_list[i]],
        num: product[num_list[i]],
        score: product[score_list[i]]
          //        count: 1
      })
    }
    return result

  }

  for (var index in data) {
    var product = data[index];
    var major_category_name, sub_category_name, product_name;

    major_category_name = product['major_category_name'];
    sub_category_name = product['sub_category_name'];
    product_name = product['product_name'];

    if (sub_category_name == 'Unknown')
      sub_category_name = 'Other'

    var major_category_found = false;

    for (var i in data_tree) {
      var tree_major_category_node = data_tree[i];
      if (tree_major_category_node['name'] == major_category_name) {
        major_category_found = true;
        var major_children = tree_major_category_node['children'];
        var sub_category_found = false;
        for (var j in major_children) {
          var sub_category_node = major_children[j];
          if (sub_category_node['name'] == sub_category_name) {
            sub_category_found = true;
            var sub_children = product_children(product)
            data_tree[i]['children'][j]['children'].push({
              name: product_name,
              children: sub_children,
            })
            break;
          }
        }
        if (!sub_category_found) {
          data_tree[i]['children'].push({
            name: sub_category_name,
            children: [{
              name: product_name
            }]
          })
        }
        break;
      }

    }

    if (!major_category_found) {
      data_tree.push({
        name: major_category_name,
        children: [{
          name: sub_category_name,
          children: [{
            name: product_name,
            children: product_children(product)
          }]

        }]

      })
    }
  }

  function get_color_and_alpha(value, num) {
    var color_list = ['#ff1a1a', '#ffb31a', '#cccccc', '#4dff4d', '#00cc00'];

    var color_id = parseInt(value / 20);
    var alpha = 1;
    if (color_id > 4)
      color_id = 4
      //    num = Math.min(99, num);
      //    alpha = (num + 1) / 400 + 0.75;
    return {
      normal: {
        //        colorAlpha: alpha,
        color: color_list[color_id]
      }
    }

  }

  function calculate_value(data) {
    if ('children' in data) {

      var value_count = {
        value: 0,
        num: 0,
        score: 0
      }
      for (var i in data['children']) {
        var sub_result = calculate_value(data['children'][i])
        value_count['score'] += sub_result['score'] * sub_result['num'];
        value_count['num'] += sub_result['num'];
        //        value_count['value'] += sub_result['value']
      }
      if (value_count['num'] > 0)
        value_count['score'] = value_count['score'] / value_count['num']
      data['value'] = value_count['num']
      data['num'] = value_count['num']
      data['score'] = value_count['score']
      data['itemStyle'] = get_color_and_alpha(value_count['score'], value_count['num'])
      return value_count
    } else {

      if ('num' in data) {
        data['itemStyle'] = get_color_and_alpha(data['score'], data['num'])
        return {
          value: data['value'],
          num: data['num'],
          score: data['score']
        }
      } else {
        data['itemStyle'] = get_color_and_alpha(0, 0)

        return {
          value: 0,
          num: 0,
          score: 0
        }
      }
    }

  }

  for (var i in data_tree) {
    var value_count = calculate_value(data_tree[i])
  }

  for (var i in data_tree) {
    var children = data_tree[i].children;
    if (children.length == 1) {
      var sub_children = children[0].children
      data_tree[i].children = sub_children;
    }
  }

  //    console.log(data_tree)

  //    global_param['data_tree'] = data_tree

  $('#brand_relation').parent().prev().children().text(data[0]['brand_name']);
  option = {
    grid: {
      left: '5%',
      top: '5%',
      right: '5%'
    },


    tooltip: {
      formatter: function (info) {
        //        console.log(info)
        var num = info.data.num;
        var score = info.data.score;
        var treePathInfo = info.treePathInfo;
        var treePath = [];

        for (var i = 1; i < treePathInfo.length; i++) {
          treePath.push(treePathInfo[i].name);
        }

        return ['<div class="tooltip-title">' + echarts.format.encodeHTML(treePath.join('/')) + '</div>',
                'Score: ' + Math.round(score) + '<br>',
                'Records: ' + echarts.format.addCommas(num)].join('')
      }
    },

    series: [
      {
        name: data[0]['brand_name'],
        type: 'treemap',
        visibleMin: 300,
        leafDepth: 1,
        label: {
          normal: {
            //            show: true,
            //            formatter: '{b}',
            textStyle: {
              color: '#000',
              fontSize: 12
            },
          },
          emphasis: {
            //            formatter: '{b}',
            textStyle: {
              color: '#555',
              //              fontSize: 14
            }
          }
        },
        itemStyle: {
          normal: {
            borderColor: '#fff',
            borderWidth: 2,
          }
        },
        data: data_tree
      }]
  };

  brand_relation.hideLoading();
  brand_relation.setOption(option);
  window.addEventListener("resize", function () {
    brand_relation.resize();
  });
}


function draw_category_popularity(data, popularity_by_category) {
  //  var popularity_by_category = echarts.init(document.getElementById('popularity_by_category'));

  var major_category_num = {};
  var brand_major_category_num = {}
  var all_category = data['all_category']
  var brand_category = data['brand_category']

  for (var i in all_category) {
    var major_category = all_category[i][3]
    if (major_category in major_category_num)
      major_category_num[major_category] += all_category[i][5]
    else
      major_category_num[major_category] = all_category[i][5]
  }

  for (var i in brand_category) {
    var major_category = brand_category[i]['major_category_name'];
    if (major_category in brand_major_category_num)
      brand_major_category_num[major_category] += brand_category[i]['num_review']
    else
      brand_major_category_num[major_category] = brand_category[i]['num_review']
  }
  var result = []

  for (key in brand_major_category_num) {
    var brand_num = brand_major_category_num[key];
    var all_num = major_category_num[key];

    result.push([key, parseFloat(brand_num) / all_num])
  }
  result.sort(function (a, b) {
    return a[1] > b[1] ? 1 : -1;
  })
  result_temp = result.filter(function (d) {
    return parseInt(d[1] * 10000) / 100 > 0;
  })
  if (result_temp.length >= 1) {
    result = result_temp;
  }


  //    console.log(result)

  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '{b}: {c}%'
    },
    legend: {},
    grid: {
      left: '20%',
      top: '5%',
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%'
      }
    },
    yAxis: {
      type: 'category',
      data: result.map(function (d) {
        return d[0]
      }),
      axisTick: {
        alignWithLabel: true
      }
    },

    series: [
      {
        name: 'From Brand',
        type: 'bar',
        stack: 'pct',
        label: {
          normal: {
            show: true,
            position: 'right',
            formatter: '{c}%'
          }
        },
        itemStyle: {
          normal: {
            color: function (params) {
              // build a color map as your need.
              var colorList = ['#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B', '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD', '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0', '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed', '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0', '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700', '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'];

              //              var colorList = ['#00fa9a', '#1e90ff', '#26C0C0', '#27727B', '#30e0e0', '#32cd32', '#3cb371', '#40e0d0', '#60C0DD', '#6495ed', '#6699FF', '#7b68ee', '#87cefa', '#9BCA63', '#B5C334', '#b8860b', '#ba55d3', '#C1232B', '#C6E579', '#cd5c5c', '#D7504B', '#da70d6', '#E87C25', '#F0805A', '#F3A43B', '#F4E001', '#FAD860', '#FCCE10', '#FE8463', '#ff6347', '#ff6666', '#ff69b4', '#ff7f50', '#ffa500', '#ffd700']
              return colorList[params.dataIndex]
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{b}\n{c}'
            }
          }
        },
        data: result.map(function (d) {
          return parseInt(d[1] * 10000) / 100
        })
        },

    ]
  };
  popularity_by_category.hideLoading();
  popularity_by_category.setOption(option);
  window.addEventListener("resize", function () {
    popularity_by_category.resize();
  });

}


function draw_category_popularity_by_brand(data, category_popularity_by_brand, category_popularity_by_brand_pie) {

  var result = {};
  var key = data['key'];


  data['brand_dist'].sort(function (a, b) {
    return a[key] - b[key] > 0 ? 1 : -1;
  });
  //  global_param['check_data'] = data

  var total_num = 0
  var name_list = []
  var value = [];
  var pie_data = []

  for (var i in data['brand_dist']) {
    total_num += data['brand_dist'][i][key]
  }

  var other_value = 0
  for (var i in data['brand_dist']) {
    var val = data['brand_dist'][i][key]
    var pct = val / total_num
    if (pct > 0.02) {
      name_list.push(data['brand_dist'][i]['brand_name'])
      value.push(val)

      pie_data.push({
        value: val,
        name: data['brand_dist'][i]['brand_name']
      })
    } else {
      other_value += val
    }
  }
  name_list.push('Other')
  value.push(other_value)

  pie_data.push({
    value: other_value,
    name: 'Other'
  })

  //  pie_data.push({
  //    value: other_value,
  //    name: 'Other'
  //  })

  //  var category_popularity_by_brand = echarts.init(document.getElementById('category_popularity_by_brand'), global_param['theme']);

  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '{b}: {c}'
    },
    grid: [
      {
        left: '20%',
        top: 10,
      }
    ],

    xAxis: [{
      type: 'value',
      name: '# of Reviews',
      nameLocation: 'middle',
      nameGap: 25

    }],

    yAxis: [{
      type: 'category',
      data: name_list.slice(0, -1),
      //      data: name_list,
    }],

    series: [{
      type: 'bar',
      data: value.slice(0, -1),
      //      data: value,
      itemStyle: {
        normal: {
          color: function (params) {
            // build a color map as your need.
            var colorList = ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
            '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
            '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
            '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'];
            return colorList[params.dataIndex]
          }
        }
      }


    }]

  }
  category_popularity_by_brand.hideLoading();
  category_popularity_by_brand.setOption(option);
  window.addEventListener("resize", function () {
    category_popularity_by_brand.resize();
  });



  //  var category_popularity_by_brand_pie = echarts.init(document.getElementById('category_popularity_by_brand_pie'), global_param['theme']);
  var option2 = {
    tooltip: {
      trigger: 'item',
      formatter: "{b} : {c} ({d}%)"
    },
    series: [
      {

        type: 'pie',
        radius: ['40%', '55%'],
        data: pie_data,
        label: {
          normal: {
            formatter: "{b} ({d}%)"
          },
          emphasis: {
            textStyle: {
              fontSize: 13,
            }
          }
        },
        itemStyle: {
          normal: {
            color: function (params) {
              // build a color map as your need.
              var colorList = ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
            '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
            '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
            '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'];
              return colorList[params.dataIndex]
            }
          }
        }

      }
    ]

  }

  category_popularity_by_brand_pie.hideLoading();
  category_popularity_by_brand_pie.setOption(option2);
  window.addEventListener("resize", function () {
    category_popularity_by_brand_pie.resize();
  });


  //  console.log(name_list)
  //  console.log(value)

}

function draw_competitor_brand(data, competitor_brand) {

  //  var competitor_brand = echarts.init(document.getElementById('competitor_brand'), global_param['theme']);
  //  function inittran(){
  //    competitor_brand.showLoading()
  //  }

  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '{b}: {c}'
    },
    grid: [
      {
        left: '20%',
        top: 10,
      }
    ],

    xAxis: [{
      type: 'value',
      nameLocation: 'middle',
      name: '# of Reviews',
      nameGap: 25,

    }],

    yAxis: [{
      type: 'category',
      data: data.map(function (d) {
        return d['brand_name']
      }),
    }],

    series: [{
      type: 'bar',
      data: data.map(function (d) {
        return d['num_review'];
      }),
      itemStyle: {
        normal: {
          color: function (params) {
            // build a color map as your need.
            var colorList = ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
            '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
            '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
            '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'];
            return colorList[params.dataIndex]
          }
        }
      }
    }]

  }
  competitor_brand.hideLoading();

  competitor_brand.setOption(option);
  window.addEventListener("resize", function () {
    competitor_brand.resize();
  });


}

function draw_user_skin_dist(data, user_skin_dist) {

  //  var user_skin_dist = echarts.init(document.getElementById('user_skin_dist'));
  option = {
    //    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: '5%',
      right: '4%',
      //      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: data.map(function (d) {
          return d['skin_type']
        }),
        axisTick: {
          alignWithLabel: true
        },
        name: 'Product Rating by Users with Different Skin Type',
        nameGap: 25,
        nameLocation: 'middle'
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'User Rating'
        }
    ],
    series: [
      {
        name: 'User Rating',
        type: 'bar',
        data: data.map(function (d) {
          return Math.round(d['score'] * 100) / 100
        }),
        itemStyle: {
          normal: {
            color: function (params) {
              // build a color map as your need.
              var colorList = ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
            '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
            '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
            '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'];
              return colorList[params.dataIndex]
            }
          }
        }

        }
    ]
  };

  user_skin_dist.hideLoading();
  user_skin_dist.setOption(option);
  window.addEventListener("resize", function () {
    user_skin_dist.resize();
  });


}


function draw_user_age_dist(data, user_age_dist) {
  option = {
    //    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: '15%',
      right: '4%',
      //      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: data.map(function (d) {
          return d['age']
        }),
        axisTick: {
          alignWithLabel: true
        },
        name: 'User Age',
        nameGap: 25,
        nameLocation: 'middle'
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '# of Users'
        }
    ],
    series: [
      {
        name: '# of User',
        type: 'bar',
        data: data.map(function (d) {
          return d['num']
        }),
        itemStyle: {
          normal: {
            color: function (params) {
              // build a color map as your need.
              var colorList = ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
            '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
            '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
            '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'];
              return colorList[params.dataIndex]
            }
          }
        }

        }
    ]
  };

  user_age_dist.hideLoading();
  user_age_dist.setOption(option);
  window.addEventListener("resize", function () {
    user_age_dist.resize();
  });

}

function draw_user_country_dist(data, user_country_dist) {

  var option = {
    tooltip: {
      trigger: 'item',
      formatter: "{b} : {c} ({d}%)"
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '55%'],
        data: data.map(function (d) {
          return {
            name: d['clean_location'],
            value: d['num']
          }
        }),
        label: {
          normal: {
            formatter: "{b} ({d}%)"
          },
          emphasis: {
            textStyle: {
              fontSize: 13,
            }
          }
        },
      }
    ]

  }

  user_country_dist.hideLoading();
  user_country_dist.setOption(option);
  window.addEventListener("resize", function () {
    user_country_dist.resize();
  });
}


function draw_user_skin_type_dist(data, user_skin_type_dist) {

  var option = {
    tooltip: {
      trigger: 'item',
      formatter: "{b} : {c} ({d}%)"
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '55%'],
        data: data.map(function (d) {
          return {
            name: d['skin_type'],
            value: d['num']
          }
        }),
        label: {
          normal: {
            formatter: "{b} ({d}%)"
          },
          emphasis: {
            textStyle: {
              fontSize: 13,
            }
          }
        },
      }
    ]

  }

  user_skin_type_dist.hideLoading();
  user_skin_type_dist.setOption(option);
  window.addEventListener("resize", function () {
    user_skin_type_dist.resize();
  });
}

function draw_user_skin_tone_dist(data, user_skin_tone_dist) {

  var option = {
    tooltip: {
      trigger: 'item',
      formatter: "{b} : {c} ({d}%)"
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '55%'],
        data: data.map(function (d) {
          return {
            name: d['skin_tone'],
            value: d['num']
          }
        }),
        label: {
          normal: {
            formatter: "{b} ({d}%)"
          },
          emphasis: {
            textStyle: {
              fontSize: 13,
            }
          }
        },
      }
    ]

  }

  user_skin_tone_dist.hideLoading();
  user_skin_tone_dist.setOption(option);
  window.addEventListener("resize", function () {
    user_skin_tone_dist.resize();
  });
}


function submit_product(product_id) {

  $('.demo').fadeOut();

  var product_base_url = $('input[name=product_found]').val();
  var product_rank_url = $('input[name=product_rank]').val();
  var brand_info_url = $('input[name=brand_info]').val();
  var product_popularity_url = $('input[name=product_popularity]').val();
  var brand_popularity_category_url = $('input[name=brand_popularity_category]').val();
  var competitor_brand_url = $('input[name=competitor_brand]').val();
  var user_skin_dist_url = $('input[name=user_skin_dist]').val();
  var user_age_dist_url = $('input[name=user_age_dist]').val();
  var user_country_dist_url = $('input[name=user_country_dist]').val();
  var user_skin_type_dist_url = $('input[name=user_skin_type_dist]').val();
  var user_skin_tone_dist_url = $('input[name=user_skin_tone_dist]').val();

  var token = $('input[name=csrfmiddlewaretoken]').val();


  $('input[name=text]').val('');
  $('#search_hint').html('');

  global_param['product_id'] = product_id;

  $('div.report').fadeIn();
  //  $('div.comparison chart div').html('')
  $('div#attribute_comparison').html('')


  var score_for_each_attribute = echarts.init(document.getElementById('score_for_each_attribute'));
  var vote_for_skin_type = echarts.init(document.getElementById('vote_for_skin_type'), global_param['theme']);
  var vote_for_texture = echarts.init(document.getElementById('vote_for_texture'), global_param['theme']);

  score_for_each_attribute.showLoading(opts = global_param['loading']);
  vote_for_skin_type.showLoading(opts = global_param['loading']);
  vote_for_texture.showLoading(opts = global_param['loading']);

  $.post(product_base_url, {
    'csrfmiddlewaretoken': token,
    'product_id': product_id
  }, function (raw_data) {
    data = JSON.parse(raw_data)
      //          console.log(raw_data)
    product_info = data[0]['fields']

    //    product_info = raw_data['result']
    //    console.log(product_info)
    var title = '<h2 class="text-center">Cosmos Report</h2>'
      //    title += '<h4 class="text-center">for<h4>'
    title += '<h2 class="text-center"><span class="bg-success">' + product_info['product_name'] + '</span></h2>';
    title += '<h4><span class="bg-primary">' + product_info['brand_name'] + '</span>'
    title += '&nbsp;<span class="bg-info">' + product_info['major_category_name'] + '</span>'
    if (product_info['sub_category_name'] != 'Unknown') {
      title += '&nbsp;<span class="bg-danger">' + product_info['sub_category_name'] + '</span>'
    }
    if (product_info['num'] > 1) {
      title += '&nbsp;<span class="bg-success">' + product_info['num'] + ' Reviews' + '</span>'
    } else {
      title += '&nbsp;<span class="bg-success">' + product_info['num'] + ' Review' + '</span>'
    }
    title += '</h4>'

    $('#report_title').html(title)

    draw_score_for_each_attribute(product_info, score_for_each_attribute);
    draw_vote_for_skin_type(product_info, vote_for_skin_type);
    draw_vote_for_texture(product_info, vote_for_texture);
    //    console.log(product_info)


    $('#popularity_by_category_title').html('Popular Makeup Categories from ' + product_info['brand_name']);
    $('#popularity_other_brand_title').html('Popular Brands for ' + product_info['major_category_name']);
    $('#competitor_brand_title').html('Top 10 Competitors for ' + product_info['major_category_name']);

    $('.report').fadeIn();

  })

  $.post(product_rank_url, {
    'csrfmiddlewaretoken': token,
    'product_id': product_id,
    'option': 'record'
  }, function (raw_data) {
    data = JSON.parse(raw_data);
    product_rank = data[0]['fields'];
    draw_product_rank_table(product_rank);
  });


  var brand_relation = echarts.init(document.getElementById('brand_relation'), global_param['theme']);
  brand_relation.showLoading(opts = global_param['loading']);
  $.post(brand_info_url, {
    'csrfmiddlewaretoken': token,
    'product_id': product_id
  }, function (raw_data) {
    //          console.log(raw_data);
    data = raw_data['result']
      //    draw_brand_force_graph(data);
    draw_brand_relation(data, brand_relation);
  });
  //
  //  //  $.post(product_rank_url, {
  //  //    'csrfmiddlewaretoken': token,
  //  //    'product_id': product_id,
  //  //    'option': 'all'
  //  //  }, function (raw_data) {
  //  //    data = JSON.parse(raw_data);
  //  //    //    console.log(data)
  //  //    draw_product_rank_in_category(data, product_id);
  //  //  });
  //

  var popularity_by_category = echarts.init(document.getElementById('popularity_by_category'));
  popularity_by_category.showLoading(opts = global_param['loading']);
  $.post(product_popularity_url, {
    'csrfmiddlewaretoken': token,
    'product_id': product_id
  }, function (raw_data) {
    draw_category_popularity(raw_data, popularity_by_category);
  })



  $.post(product_rank_url, {
    'csrfmiddlewaretoken': token,
    'product_id': product_id,
    'option': 'comparison'
  }, function (raw_data) {
    data = raw_data['result']
      //    console.log(data)
    var html = '<select data-placeholder="Products for Comparison" class="chosen-select" multiple tabindex="6">';
    html += '<option value=""></option>';

    previous_brand = null
    for (var i in data) {
      item = data[i];
      if (previous_brand == null) {
        previous_brand = item['brand_name']
        html += '<optgroup label="' + previous_brand + '">'
      } else if (previous_brand != item['brand_name']) {
        previous_brand = item['brand_name']
        html += '</optgroup>'
        html += '<optgroup label="' + previous_brand + '">'

      }

      html += '<option value=' + item['product_id'] + '>' + item['product_name'] + ' (' + item['num'] + ')' + '</option>'
    }
    html += '</optgroup>'
    html += '</select>'
    $('#product_for_comparison').html(html);
    $("#product_comparison .chosen-select").chosen({
      width: "100%",
      max_selected_options: 2
    });

  });

  var category_popularity_by_brand = echarts.init(document.getElementById('category_popularity_by_brand'), global_param['theme']);
  var category_popularity_by_brand_pie = echarts.init(document.getElementById('category_popularity_by_brand_pie'), global_param['theme']);
  category_popularity_by_brand.showLoading();
  category_popularity_by_brand_pie.showLoading();
  $.post(brand_popularity_category_url, {
    'csrfmiddlewaretoken': token,
    'product_id': product_id,
  }, function (raw_data) {
    //    console.log(raw_data)
    draw_category_popularity_by_brand(raw_data, category_popularity_by_brand, category_popularity_by_brand_pie);
  })


  var competitor_brand = echarts.init(document.getElementById('competitor_brand'), global_param['theme']);
  competitor_brand.showLoading(opts = global_param['loading']);

  $.post(competitor_brand_url, {
    'csrfmiddlewaretoken': token,
    'product_id': product_id,
  }, function (raw_data) {
    //            console.log(raw_data)
    draw_competitor_brand(raw_data, competitor_brand)
  })


  var user_skin_dist = echarts.init(document.getElementById('user_skin_dist'), global_param['theme']);
  user_skin_dist.showLoading(opts = global_param['loading']);

  $.post(user_skin_dist_url, {
    'csrfmiddlewaretoken': token,
    'product_id': product_id,
  }, function (raw_data) {
    //    console.log(raw_data)

    draw_user_skin_dist(raw_data, user_skin_dist)
  })

  var user_age_dist = echarts.init(document.getElementById('user_age_dist'), global_param['theme']);
  user_age_dist.showLoading(opts = global_param['loading']);

  $.post(user_age_dist_url, {
    'csrfmiddlewaretoken': token,
    'product_id': product_id,
  }, function (raw_data) {
    //    console.log(raw_data)

    draw_user_age_dist(raw_data, user_age_dist)
  })


  var user_country_dist = echarts.init(document.getElementById('user_country_dist'), global_param['theme']);
  user_country_dist.showLoading(opts = global_param['loading']);

  $.post(user_country_dist_url, {
    'csrfmiddlewaretoken': token,
    'product_id': product_id,
  }, function (raw_data) {
    //    console.log(raw_data)

    draw_user_country_dist(raw_data, user_country_dist)
  })
  
  
  var user_skin_type_dist = echarts.init(document.getElementById('user_skin_type_dist'), global_param['theme']);
  user_skin_type_dist.showLoading(opts = global_param['loading']);

  $.post(user_skin_type_dist_url, {
    'csrfmiddlewaretoken': token,
    'product_id': product_id,
  }, function (raw_data) {
    //    console.log(raw_data)

    draw_user_skin_type_dist(raw_data, user_skin_type_dist)
  })
  
  var user_skin_tone_dist = echarts.init(document.getElementById('user_skin_tone_dist'), global_param['theme']);
  user_skin_tone_dist.showLoading(opts = global_param['loading']);

  $.post(user_skin_tone_dist_url, {
    'csrfmiddlewaretoken': token,
    'product_id': product_id,
  }, function (raw_data) {
    //    console.log(raw_data)

    draw_user_skin_tone_dist(raw_data, user_skin_tone_dist)
  })





}


function compare_product(data) {
  //    console.log(data)
  var attribute_comparison = echarts.init(document.getElementById('attribute_comparison'), global_param['theme']);
  var indicator = ['Price', 'Smell', 'Effect', 'Packaging', 'Retention', 'Pure Emotion', 'Other']
  var label = ['price_score', 'smell_score', 'effect_score', 'packaging_score', 'retention_score', 'pure_emotion_score', 'other_score'];
  var option = {
    //    title: {
    //      text: 'Products Comparison'
    //    },
    tooltip: {},
    legend: {
      data: data.map(function (d) {
        return d['product_name'];
      }),
      orient: 'vertical',
      left: 5,
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
      data: data.map(function (d) {
        return {
          value: label.map(function (v) {
            return d[v]
          }),
          name: d['product_name']
        }

      })
    }]
  };

  attribute_comparison.setOption(option);
  window.addEventListener("resize", function () {
    attribute_comparison.resize();
  });

}



init();


$('#search-text input').keyup(function (event) {
  var keyCode = (event.keyCode ? event.keyCode : event.which);
  if (keyCode == 13) {
    $('#search-text button').trigger('click');
    return false;
  } else {
    var hint_url = $('input[name=product_hint]').val();


    var token = $('input[name=csrfmiddlewaretoken]').val();
    var text = $('input[name=text]').val();
    $.post(hint_url, {
      'csrfmiddlewaretoken': token,
      'text': text
    }, function (data) {
      //            console.log(data)
      var product_list = data['result']
      var inner_html = '<div class="list-group col-xs-6" >'
      for (var i in product_list) {
        item = product_list[i]
        inner_html += '<a href="javascript:void(0)" onclick="submit_product(' + item['product_id'] + ')"' + 'class="list-group-item">' + item['product_name'] + '<span class="badge">' + item['num'] + '</span></a>'
      }
      inner_html += '</div>'
      $('#search_hint').html(inner_html);

      $('#search_hint div').css({
        'left': $('input.form-control').position().left,
        'width': $('input.form-control').outerWidth()
      });
    })
  }
});


$("#product_comparison button").click(function (e) {
  //  var url = $('input[name=url]').val()
  //  var token = $('input[name=csrfmiddlewaretoken]').val()
  //  var text = $('input[name=text]').val()
  //  $('input[name=text]').val('')
  //  console.log(text)
  //  $.post(url, {
  //    'csrfmiddlewaretoken': token,
  //    'text': text
  //  }, function(data){
  ////    sentiment_chart(data['sentiment'])
  ////    console.log(data)
  //    sentiment_chart(Math.round(data[data.length-1]['score']));
  //    $('#graph g').remove()
  //    create_sentiment_graph(data)
  //  })
  var comparison = $("#product_comparison .chosen-select").chosen().val();
  comparison = comparison.map(function (d) {
    return parseInt(d);
  })
  if (comparison.length == 0)
    return

  var url = $('input[name=product_comparison]').val()
  var token = $('input[name=csrfmiddlewaretoken]').val()
  comparison.push(global_param['product_id'])
  $.post(url, {
    'csrfmiddlewaretoken': token,
    'product_ids': JSON.stringify(comparison)
  }, function (raw_data) {
    data = JSON.parse(raw_data).map(function (d) {
        return d['fields']
      })
      //    console.log(data)
    compare_product(data);
  })


})