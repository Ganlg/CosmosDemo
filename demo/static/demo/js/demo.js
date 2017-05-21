//$(".chosen-select").chosen();
var global_param = {};

function init() {
  var token = $('input[name=csrfmiddlewaretoken]').val();
  var product_nav = $('input[name=product_nav]').val();
  $.post(product_nav, {
    'csrfmiddlewaretoken': token,
    'option': 1,
    'value': ''
  }, function (raw_data) {
    data = JSON.parse(raw_data).map(function (d) {
        return d['fields'];
      })
      //    console.log(data);

    var html = '<select data-placeholder="Choose a Brand..." class="chosen-select" tabindex="1">';
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
    var html = '<select data-placeholder="Choose a Category..." class="chosen-select" tabindex="2">';
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

    var html = '<select data-placeholder="Choose a Product..." class="chosen-select" tabindex="1">';
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
        'left': $('input.form-control').position().left,
//        'width': $('input.form-control').outerWidth()
      })
    })
  }
});

function submit_product(product_id) {
  var product_base_url = $('input[name=product_found]').val();
  var product_rank_url = $('input[name=product_rank]').val();
  var brand_info_url = $('input[name=brand_info]').val();
  var product_popularity_url = $('input[name=product_popularity]').val();
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
    $("#product_comparison .chosen-select").chosen({
      width: "100%",
      max_selected_options: 2
    });

  });

  $.post(brand_info_url, {
    'csrfmiddlewaretoken': token,
    'product_id': product_id
  }, function (raw_data) {
    //    console.log(raw_data);
    data = raw_data['result']
      //    draw_brand_force_graph(data);
    draw_brand_relation(data);
  })

  //  $.post(product_rank_url, {
  //    'csrfmiddlewaretoken': token,
  //    'product_id': product_id,
  //    'option': 'all'
  //  }, function (raw_data) {
  //    data = JSON.parse(raw_data);
  //    //    console.log(data)
  //    draw_product_rank_in_category(data, product_id);
  //  });

  $.post(product_popularity_url, {
    'csrfmiddlewaretoken': token,
    'product_id': product_id
  }, function (raw_data) {
    draw_category_popularity(raw_data);
  })

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
      //      console.log(product)
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

function draw_brand_force_graph(data) {
  //  console.log(data);
  global_param['check'] = data

  var brand_force_graph = echarts.init(document.getElementById('brand_force'));

  var categories = [{
    name: 'Brand',
    itemStyle: {
      normal: {
        color: "#a53021"
      }
    }

  }, {
    name: 'Category',
    itemStyle: {
      normal: {
        color: "#56177a"
      }
    }
  }, {
    name: 'Sub Category',
    itemStyle: {
      normal: {
        color: "#2fa8c6"
      }
    }
  }, {
    name: 'Product',
    itemStyle: {
      normal: {
        color: "#0b4fbc"
      }
    }

  }];

  var nodes = [];
  var links = []

  //  var node_index = 0;

  var brand_dict = {};
  var major_category_dict = {}
  var sub_category_dict = {};
  var product_list = [];

  for (var index in data) {

    var product = data[index];
    if (product_list.indexOf(product['product_name']) >= 0)
      continue
    else
      product_list.push(product['product_name'])


    var brand_index, major_category_index, sub_category_index;
    if (index == 0) {
      brand_dict[product['brand_id']] = nodes.length;
      nodes.push({
        name: product['brand_name'],
        draggable: true,
        category: 0
      });
      brand_index = brand_dict[product['brand_id']];
    } else {
      brand_index = brand_dict[product['brand_id']]
    }

    major_category_index = major_category_dict[product['major_category_id']];

    if (major_category_index == undefined) {
      major_category_dict[product['major_category_id']] = nodes.length;
      nodes.push({
        name: product['major_category_name'],
        draggable: true,
        category: 1,
        itemStyle: {
          normal: {
            opacity: 1
          }
        },
        flag: true
      });
      major_category_index = major_category_dict[product['major_category_id']];

      links.push({
        source: brand_index,
        target: major_category_index,
        name: 'Category',
      })

    }


    var product_index = nodes.length;
    nodes.push({
      name: product['product_name'],
      draggable: true,
      category: 3,
      itemStyle: {
        normal: {
          opacity: 1
        }
      },
      flag: true
    })

    if (product['sub_category_id'] != 1) {

      sub_category_index = sub_category_dict[product['sub_category_id']];

      if (sub_category_index == undefined) {
        sub_category_dict[product['sub_category_id']] = nodes.length;
        nodes.push({
          name: product['sub_category_name'],
          draggable: true,
          category: 2,
          itemStyle: {
            normal: {
              opacity: 1
            }
          },
          flag: true
        })
        sub_category_index = sub_category_dict[product['sub_category_id']];
        links.push({
          source: major_category_index,
          target: sub_category_index,
          name: 'Sub Category',
          lineStyle: {
            normal: {
              opacity: 1
            }
          },
        })
      }


      links.push({
        source: sub_category_index,
        target: product_index,
        name: 'Product',
        lineStyle: {
          normal: {
            opacity: 1
          }
        },
      })
    } else {

      links.push({
          source: major_category_index,
          target: product_index,
          name: 'Product',
          lineStyle: {
            normal: {
              opacity: 1
            }
          },
        })
        //      console.log(links.slice(-1))
    }




  }

  //  global_param['nodes'] = nodes;
  //  global_param['links'] = links;
  //  global_param['major_category_dict'] = major_category_dict;
  //  console.log(nodes)
  //  console.log(links)
  //  console.log(product_list)

  option = {
    title: {
      text: ''
    },
    tooltip: {},
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    label: {
      normal: {
        show: true,
        textStyle: {
          fontSize: 12
        },
      }
    },
    legend: {
      x: "center",
      show: true,
      data: ["Category", "Sub Category", 'Product']
    },
    series: [{
      type: 'graph',
      layout: 'force',
      symbolSize: 45,
      focusNodeAdjacency: true,
      roam: true,
      categories: categories,
      label: {
        normal: {
          show: true,
          textStyle: {
            fontSize: 12,
            formatter: '{b}'
          },
        }
      },
      force: {
        repulsion: 1000,
        gravity: 0.8
      },
      symbol: 'roundRect',
      edgeSymbolSize: [4, 50],
      edgeLabel: {
        normal: {
          show: false,
          textStyle: {
            fontSize: 10
          },
          formatter: "{c}"
        }
      },
      data: nodes,
      links: links,
      lineStyle: {
        normal: {
          opacity: 0.9,
          width: 1,
          curveness: 0
        }
      }
    }]
  };
  brand_force_graph.setOption(option);
}


function draw_brand_relation(data) {
  //  console.log(data);
  var brand_relation = echarts.init(document.getElementById('brand_relation'));
  var data_tree = [];

  function product_children(product) {
    var name_list = ['effect', 'other', 'packaging', 'price', 'pure_emotion', 'retention', 'skin_combination', 'skin_dry', 'skin_oil', 'skin_sensitive', 'smell', 'texture_greasy', 'texture_light', 'usage'];
    var score_list = ['effect_score', 'other_score', 'packaging_score', 'price_score', 'pure_emotion_score', 'retention_score', 'skin_combination_score', 'skin_dry_score', 'skin_oil_score', 'skin_sensitive_score', 'smell_score', 'texture_greasy_score', 'texture_light_score', 'usage_score'];
    var num_list = ['effect_num', 'other_num', 'packaging_num', 'price_num', 'pure_emotion_num', 'retention_num', 'skin_combination_num', 'skin_dry_num', 'skin_oil_num', 'skin_sensitive_num', 'smell_num', 'texture_greasy_num', 'texture_light_num', 'usage_num'];
    //    var name_list = ['effect', 'other', 'packaging', 'price', 'pure_emotion', 'retention', 'skin_combination', 'skin_dry', 'skin_oil', 'skin_sensitive', 'smell', 'texture_greasy', 'texture_light', 'usage'];
    //    var score_list = ['effect_score', 'other_score', 'packaging_score', 'price_score', 'pure_emotion_score', 'retention_score', 'skin_combination_score', 'skin_dry_score', 'skin_oil_score', 'skin_sensitive_score', 'smell_score', 'texture_greasy_score', 'texture_light_score', 'usage_score'];
    //    var num_list = ['effect_num', 'other_num', 'packaging_num', 'price_num', 'pure_emotion_num', 'retention_num', 'skin_combination_num', 'skin_dry_num', 'skin_oil_num', 'skin_sensitive_num', 'smell_num', 'texture_greasy_num', 'texture_light_num', 'usage_num'];

    var result = [];

    for (var i in name_list) {
      result.push({
        name: name_list[i],
        value: product[score_list[i]],
        num: product[num_list[i]],
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
              //              count: len(sub_children),
              //              value: sub_children.reduce(function(a, b){ return a.value * a.count + b.value * b.count };) / len(sub_children)
            })

            //            data_tree[i]['children'][j].count = len(data_tree[i]['children'][j]['children'])
            //            data_tree[i]['children'][j].value = data_tree[i]['children'][j]['children']
            //              .recude(function(a, b){ return a.value * a.count + b.value * b.count}) / len(data_tree[i]['children'][j]['children'])

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
    num = Math.min(99, num);
    alpha = (num + 1) / 400 + 0.75;
    return {
      normal:{
        colorAlpha: alpha,
        color: color_list[color_id]
      }
    }

  }

  function calculate_value(data) {
    if ('children' in data) {

      var value_count = {
        value: 0,
        num: 0
      }
      for (var i in data['children']) {
        var sub_result = calculate_value(data['children'][i])
        value_count['value'] += sub_result['value'] * sub_result['num'];
        value_count['num'] += sub_result['num'];
      }
      if (value_count['num'] > 0)
        value_count['value'] = value_count['value'] / value_count['num']
        //      console.log(value_count)

      data['value'] = value_count['value']
      data['num'] = value_count['num']

      data['itemStyle'] = get_color_and_alpha(value_count['value'], value_count['num'])

      //      console.log(data)
      return value_count
    } else {

      if ('num' in data) {
        data['itemStyle'] = get_color_and_alpha(data['value'], data['num'])
        return {
          value: data['value'],
          num: data['num']
        }
      } else {
        data['itemStyle'] = get_color_and_alpha(0, 0)

        return {
          value: 0,
          num: 0,
        }
      }
    }

  }

  for (var i in data_tree) {
    var value_count = calculate_value(data_tree[i])
      //      break
      //    console.log((value_count))
      //    break;
      //      data_tree[i]['value'] = value_count['value']
      //      data_tree[i]['count'] = value_count['count']

  }
  console.log(data_tree)

  global_param['data_tree'] = data_tree


  //  console.log(data_tree);

  option = {

    title: {
      text: data[0]['brand_name'],
      left: 'center'
    },
    

    tooltip: {
      formatter: function (info) {
        var value = info.value;
        var treePathInfo = info.treePathInfo;
        var treePath = [];

        for (var i = 1; i < treePathInfo.length; i++) {
          treePath.push(treePathInfo[i].name);
        }

        return ['<div class="tooltip-title">' + echarts.format.encodeHTML(treePath.join('/')) + '</div>',
                'Score: ' + echarts.format.addCommas(value)].join('')
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
            show: true,
            textStyle:{
              color: '#000',
              fontSize: 16
            },
          },
          emphasis: {
            textStyle:{
              color: '#555',
              fontSize: 18
            }
          }
          //          show: true,
          ////          formatter: '{b}'
        },
        itemStyle: {
          normal: {
            borderColor: '#fff',
            borderWidth: 2,
          }
        },
        //        levels: [
        //          {
        //            itemStyle: {
        //              normal: {
        //                borderWidth: 3,
        //                borderColor: '#fff',
        //                gapWidth: 5
        //              }
        //            }
        //            },
        //          {
        //            itemStyle: {
        //              normal: {
        //                gapWidth: 1
        //              }
        //            }
        //            },
        //          {
        //            colorSaturation: [0.35, 0.5],
        //            itemStyle: {
        //              normal: {
        //                gapWidth: 1,
        //                borderColorSaturation: 0.6
        //              }
        //            }
        //            }
        //        ],
        data: data_tree
      }]
  };

  brand_relation.setOption(option);




}



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

function draw_category_popularity(data) {
  var popularity_by_category = echarts.init(document.getElementById('popularity_by_category'));
  console.log(data)

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
    return a[1] > b[1]
  })

  console.log(result)

  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {},
    //    grid: {
    //      left: '3%',
    //      right: '4%',
    //      bottom: '3%',
    //      containLabel: true
    //    },
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
//            {
//        name: 'Others',
//        type: 'bar',
//        stack: 'pct',
//        label: {
//          normal: {
//            show: false,
//            position: 'insideRight',
//            formatter: '{b}: {c}%'
//          }
//        },
//        itemStyle:{
//          normal:{
//            color: '#555'
//          } 
//        },
//        data: result.map(function(d){return 100 - parseInt(d[1] * 10000) / 100})
//        },

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
            color: '#80b3ff'
          }
        },
        data: result.map(function (d) {
          return parseInt(d[1] * 10000) / 100
        })
        },

    ]
  };
  popularity_by_category.setOption(option);

}




function openOrFold(param) {
  var linksNodes = []; //中间变量
  var data = param.data; //表示当前选择的某一节点

  var option = myChart.getOption(); //获取已生成图形的Option
  var nodesOption = option.series[0].nodes; //获得所有节点的数组
  var linksOption = option.series[0].links; //获得所有连接的数组
  var categoryLength = option.series[0].categories.length; //获得类别数组的大小

  /**
  该段代码判断当前节点的category是否为最终子节点，
  如果是，则弹出该节点的label
  */
  if (data.category == (categoryLength - 1)) {
    alert(data.label);
  }

  /**判断是否选择到了连接线上*/
  if (data != null && data != undefined) {
    /**
    判断所选节点的flag
    如果为真，则表示要展开数据,
    如果为假，则表示要折叠数据
    */
    if (data.flag) {
      /**
      遍历连接关系数组
      最终获得所选择节点的一层子节点
      */
      for (var m in linksOption) {
        //引用的连接关系的目标，既父节点是当前节点
        if (linksOption[m].target == data.id) {
          linksNodes.push(linksOption[m].source); //获得子节点数组
        }
      } //for(var m in linksOption){...}
      /**
      遍历子节点数组
      设置对应的option属性
      */
      if (linksNodes != null && linksNodes != undefined) {
        for (var p in linksNodes) {
          nodesOption[linksNodes[p]].ignore = false; //设置展示该节点
          nodesOption[linksNodes[p]].flag = true;
        }
      }
      //设置该节点的flag为false，下次点击折叠子孙节点
      nodesOption[data.id].flag = false;
      //重绘
      myChart.setOption(option);
    } else {
      /**
      遍历连接关系数组
      最终获得所选择节点的所有子孙子节点
      */
      for (var m in linksOption) {
        //引用的连接关系的目标，既父节点是当前节点
        if (linksOption[m].target == data.id) {
          linksNodes.push(linksOption[m].source); //找到当前节点的第一层子节点
        }
        if (linksNodes != null && linksNodes != undefined) {
          for (var n in linksNodes) {
            //第一层子节点作为父节点，找到所有子孙节点
            if (linksOption[m].target == linksNodes[n]) {
              linksNodes.push(linksOption[m].source);
            }
          }
        }
      } //for(var m in linksOption){...}
      /**
      遍历最终生成的连接关系数组
      */
      if (linksNodes != null && linksNodes != undefined) {
        for (var p in linksNodes) {
          nodesOption[linksNodes[p]].ignore = true; //设置折叠该节点
          nodesOption[linksNodes[p]].flag = true;
        }
      }
      //设置该节点的flag为true，下次点击展开子节点
      nodesOption[data.id].flag = true;
      //重绘
      myChart.setOption(option);
    } //if (data.flag) {...}
  } //if(data != null && data != undefined){...}
} //function openOrFold(param){...}


//$(document).ready(function () {
//  var navListItems = $('#product_nav div.setup-panel div a'),
//    allWells = $('#product_nav .setup-content'),
//    allNextBtn = $('#product_nav .nextBtn');
//
//  allWells.hide();
//  
//  navListItems.click(function (e) {
//    e.preventDefault();
//    var $target = $($(this).attr('href')),
//      $item = $(this);
//
//    if (!$item.hasClass('disabled')) {
//      navListItems.removeClass('btn-primary').addClass('btn-default');
//      $item.addClass('btn-primary');
//      allWells.hide();
//      $target.show();
//      $target.find('input:eq(0)').focus();
//    }
//  });
//  
//  allNextBtn.click(function () {
//    var curStep = $(this).closest(".setup-content"),
//      curStepBtn = curStep.attr("id"),
//      nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
//      curInputs = curStep.find("input[type='text'],input[type='url']"),
//      isValid = true;
//
//    $(".form-group").removeClass("has-error");
//    for (var i = 0; i < curInputs.length; i++) {
//      if (!curInputs[i].validity.valid) {
//        isValid = false;
//        $(curInputs[i]).closest(".form-group").addClass("has-error");
//      }
//    }
//
//    if (isValid)
//      nextStepWizard.removeAttr('disabled').trigger('click');
//  });
//
//  $('div.setup-panel div a.btn-primary').trigger('click');
//})





//
//$(document).ready(function () {
//  var navListItems = $('#product_nav div.setup-panel div a'),
//    allWells = $('#product_nav .setup-content'),
//    allNextBtn = $('#product_nav .nextBtn');
//
//  allWells.hide();
//
//  navListItems.click(function (e) {
//    e.preventDefault();
//    var $target = $($(this).attr('href')),
//      $item = $(this);
//
//    if (!$item.hasClass('disabled')) {
//      navListItems.removeClass('btn-primary').addClass('btn-default');
//      $item.addClass('btn-primary');
//      allWells.hide();
//      $target.show();
//      $target.find('input:eq(0)').focus();
//    }
//  });
//
//  allNextBtn.click(function () {
//    var curStep = $(this).closest(".setup-content"),
//      curStepBtn = curStep.attr("id"),
//      nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
//      curInputs = curStep.find("input[type='text'],input[type='url']"),
//      isValid = true;
//
//    $(".form-group").removeClass("has-error");
//    for (var i = 0; i < curInputs.length; i++) {
//      if (!curInputs[i].validity.valid) {
//        isValid = false;
//        $(curInputs[i]).closest(".form-group").addClass("has-error");
//      }
//    }
//
//    if (isValid)
//      nextStepWizard.removeAttr('disabled').trigger('click');
//  });
//
//  $('div.setup-panel div a.btn-primary').trigger('click');
//});