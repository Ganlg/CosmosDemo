//$(".chosen-select").chosen();
var global_param = {};

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
      //      console.log(data)
      var product_list = data['result']
      var inner_html = '<div class="list-group col-xs-6" >'
      for (var i in product_list) {
        item = product_list[i]
        inner_html += '<a href="javascript:void(0)" onclick="submit_product(' + item['product_id'] + ')"' + 'class="list-group-item">' + item['product_name'] + '<span class="badge">' + item['num'] + '</span></a>'
      }
      inner_html += '</div>'
      $('#search_hint').html(inner_html);

      $('#search_hint div').css({
        'left': $('input.form-control').position().left
      })
    })
  }
});

function submit_product(product_id) {
  var product_base_url = $('input[name=product_found]').val();
  var product_rank_url = $('input[name=product_rank]').val();
  var token = $('input[name=csrfmiddlewaretoken]').val();
  $('input[name=text]').val('');
  $('#search_hint').html('');

  global_param['product_id'] = product_id;
  
  $('div.report').fadeIn();
  $('div.comparison .dashboard').html('')

  $.post(product_base_url, {
    'csrfmiddlewaretoken': token,
    'product_id': product_id
  }, function (raw_data) {
    data = JSON.parse(raw_data)
      //    console.log(raw_data)
    product_info = data[0]['fields']
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

    draw_score_for_each_attribute(product_info);
    draw_vote_for_skin_type(product_info);
    draw_vote_for_texture(product_info);



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
    $(".chosen-select").chosen({
      width: "100%",
      max_selected_options: 2
    });

  });

  //  $.post(product_rank_url, {
  //    'csrfmiddlewaretoken': token,
  //    'product_id': product_id,
  //    'option': 'all'
  //  }, function (raw_data) {
  //    data = JSON.parse(raw_data);
  //    //    console.log(data)
  //    draw_product_rank_in_category(data, product_id);
  //  });

}

function draw_score_for_each_attribute(data) {

  var score_for_each_attribute = echarts.init(document.getElementById('score_for_each_attribute'));

  var score_data = [data['price_score'], data['smell_score'], data['effect_score'], data['packaging_score'], data['retention_score'], data['pure_emotion_score'], data['other_score']];
  var num_data = [data['price_num'], data['smell_num'], data['effect_num'], data['packaging_num'], data['retention_num'], data['pure_emotion_num'], data['other_num']]
  score_data = score_data.map(function (d) {
    return d == null ? null : d.toFixed(1);
  })

  var option = {
    color: ['#3398DB', '#D14A61'],
    title: {
      text: 'Score for Each Attribute',
    },
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
            color: '#3398DB'
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
        data: score_data,
        yAxisIndex: 0
      },
      {
        name: '# of Records',
        type: 'line',
        yAxisIndex: 1,
        data: num_data
      }
    ]
  };
  score_for_each_attribute.setOption(option);
  window.addEventListener("resize", function () {
    score_for_each_attribute.resize();
  });

}

function draw_vote_for_skin_type(data) {
  var skin_name = ['Dry', 'Normal', 'Combination', 'Oil', 'Sensitive']
  var skin_score = [data['skin_dry_score'], data['skin_normal_score'], data['skin_combination_score'], data['skin_oil_score'], data['skin_sensitive_num']];
  var skin_num = [data['skin_dry_num'], data['skin_normal_num'], data['skin_combination_num'], data['skin_oil_num'], data['skin_sensitive_num']];
  var skin_data = [];
  var total_score = 0;
  for (var i = 0; i < skin_score.length; i++) {
    var temp_score = (skin_score[i] * skin_num[i]).toFixed(0);
    total_score += temp_score;
    skin_data.push({
      value: temp_score,
      name: skin_name[i]
    });
  }
  var vote_for_skin_type = echarts.init(document.getElementById('vote_for_skin_type'));

  var option = {
    title: {
      text: 'Votes for Skin Type',
      x: 'center'
    },
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
      center: ['50%', '60%'],
      data: skin_data,
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
  vote_for_skin_type.setOption(option);
  window.addEventListener("resize", function () {
    vote_for_skin_type.resize();
  });

}

function draw_vote_for_texture(data) {
  //  console.log(data);
  var texture_name = ['Greasy', 'Light']
  var texture_score = [data['texture_greasy_score'], data['texture_light_score']];
  var texture_num = [data['texture_greasy_num'], data['texture_light_num']];
  var texture_data = [];
  var total_score = 0;
  for (var i = 0; i < texture_score.length; i++) {
    var temp_score = (texture_score[i] * texture_num[i]).toFixed(0);
    total_score += temp_score;
    texture_data.push({
      value: temp_score,
      name: texture_name[i]
    });
  }
  var vote_for_texture = echarts.init(document.getElementById('vote_for_texture'));

  var option = {
    title: {
      text: 'Votes for Texture',
      x: 'center'
    },
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
      center: ['50%', '60%'],
      data: texture_data,
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
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
  if (price_rank <= 0.2)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (smell_rank <= 0.2)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (effect_rank <= 0.2)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (packaging_rank <= 0.2)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (emotion_rank <= 0.2)
    html += marker;
  html += "</td>";
  html += "<td class='text-center'>";
  if (retention_rank <= 0.2)
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

function draw_product_rank_in_category(data, product_id) {
//  console.log(data);
  var product_name = []
  var price_score = []
  var price_num = []

  var product = null

  for (var i = 0; i < data.length; i++) {
    var item0 = data[i];
    var item = item0['fields'];
    //    console.log(item)
    if (item0['pk'] == product_id) {
      product = item;
      console.log(product)
    } else {
      product_name.push(item['product_name']);
      price_score.push(item['price_score']);
      price_num.push(item['price_num']);
    }
  }

  draw_price_rank_chart(product_name, price_score, price_num, product);
}

function draw_price_rank_chart(product_name, price_score, price_num, product) {
  var price_rank_chart = echarts.init(document.getElementById('price_rank_chart'));
  var data = [];
  for (var i = 0; i < price_score.length; i++)
    if (price_num[i] > 10)
      data.push([price_num[i], price_score[i], product_name[i]]);
  option = {
    legend: {
      x: 'center',
      y: 'bottom',
      data: [product['product_name'], 'Other']

    },
    title: {
      text: 'Price Score Chart'
    },
    xAxis: {
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      //      type: 'log'
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      scale: true
    },
    series: [{
        name: product['product_name'],
        data: [[product['price_num'], product['price_score']]],
        type: 'scatter',
        symbolSize: 10,
        label: {
          emphasis: {
            show: true,
            formatter: product['product_name'],
            position: 'top'
          }
        },
        itemStyle: {
          normal: {
            shadowBlur: 10,
            shadowColor: 'rgba(25, 100, 150, 0.5)',
            shadowOffsetY: 5,
            color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
              offset: 0,
              color: 'rgb(129, 227, 238)'
                }, {
              offset: 1,
              color: 'rgb(25, 183, 207)'
                }])
          }
        }
    },
      {
        name: 'Other',
        data: data,
        type: 'scatter',
        symbolSize: function (d) {
          return Math.sqrt(d[0]);
        },
        label: {
          emphasis: {
            show: true,
            formatter: function (param) {
              return param.data[2];
            },
            position: 'top'
          },
          color: '#00FF00',
        },
        itemStyle: {
          normal: {
            shadowBlur: 10,
            shadowColor: 'rgba(120, 36, 50, 0.5)',
            shadowOffsetY: 5,
            color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
              offset: 0,
              color: 'rgb(251, 118, 123)'
                }, {
              offset: 1,
              color: 'rgb(204, 46, 72)'
                }])
          }
        }
    }]
  };
  price_rank_chart.setOption(option);

}

//$("#search-text button").click(function (e) {
//  var url = $('input[name=url]').val()
//  var token = $('input[name=csrfmiddlewaretoken]').val()
//  var text = $('input[name=text]').val()
//  $('input[name=text]').val('')
////  console.log(text)
//    //  $.post(url, {
//    //    'csrfmiddlewaretoken': token,
//    //    'text': text
//    //  }, function(data){
//    ////    sentiment_chart(data['sentiment'])
//    ////    console.log(data)
//    //    sentiment_chart(Math.round(data[data.length-1]['score']));
//    //    $('#graph g').remove()
//    //    create_sentiment_graph(data)
//    //  })
//});


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


function compare_product(data) {
  //  console.log(data)
  var attribute_comparison = echarts.init(document.getElementById('attribute_comparison'));
  var indicator = ['Price', 'Smell', 'Effect', 'Packaging', 'Retention', 'Pure Emotion', 'Other']
  var label = ['price_score', 'smell_score', 'effect_score', 'packaging_score', 'retention_score', 'pure_emotion_score', 'other_score'];
  var option = {
    title: {
      text: 'Products Comparison'
    },
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
      data: data.map(function(d){
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