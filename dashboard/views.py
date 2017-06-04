from django.shortcuts import render
from django.views.decorators.http import require_POST
from django.http import JsonResponse, HttpResponse
from django.core.serializers import serialize
from django.db.models import Q, Sum
from django.db import connection

import json
import re

from tools.decorators import ajax_required
from tools.module import dictfetchall
from .forms import MessageForm
from .models import \
    ProductInfoRating, ProductInfoRatingRank, Brand, ProductNav, CategoryReviewNum, BrandCategoryCount \

# Create your views here.
def index(request):
    return render(request, 'dashboard/dashboard.html')

@ajax_required
@require_POST
def product_hint(request):
    # print('hello')
    form = MessageForm(request.POST)
    # json_data = ''
    if form.is_valid():
        # print('ok')
        text = form.cleaned_data['text']
        result = ProductInfoRating.objects
        for sub_text in text.split(' '):
            if len(sub_text) == 0:
                continue
            result = result.filter(product_name__icontains=sub_text)

        result = result.values('product_id', 'product_name', 'num')[:6]
        return JsonResponse({'result': list(result)}, safe=False)
    return JsonResponse([], safe=False)


@ajax_required
@require_POST
def product_found(request):
    product_id = request.POST.get('product_id')
    if product_id:
        product_info = ProductInfoRating.objects.get(product_id=product_id)
        return JsonResponse(serialize('json', [product_info]), safe=False)
    return JsonResponse([], safe=False)

@ajax_required
@require_POST
def product_rank(request):
    product_id = request.POST.get('product_id')
    option = request.POST.get('option')
    if option == 'record' and product_id:
        prodcut_rank = ProductInfoRatingRank.objects.get(product_id=product_id)
        return JsonResponse(serialize('json', [prodcut_rank]), safe=False)
    elif option == 'comparison' and product_id:
        product_info = ProductInfoRating.objects.get(product_id=product_id)
        product_rank = ProductInfoRating.objects.filter(
            major_category_id=product_info.major_category_id,
            sub_category_id=product_info.sub_category_id
        ).values('product_id', 'brand_name', 'product_name', 'num').order_by('brand_name', 'product_name', 'num')


        return JsonResponse({'result': list(product_rank)}, safe=False)

    elif option == 'all' and product_id:
        product_info = ProductInfoRating.objects.get(product_id=product_id)
        product_rank = ProductInfoRating.objects.filter(
            major_category_id=product_info.major_category_id,
            sub_category_id=product_info.sub_category_id
        ).filter(
            Q(product_id=product_id) | Q(num__gte=10)
        )
        return JsonResponse(serialize('json', product_rank), safe=False)

    return JsonResponse([], safe=False)

@ajax_required
@require_POST
def brand_info(request):
    product_id = request.POST.get('product_id')
    product_info = ProductInfoRating.objects.get(product_id=product_id)
    brand_info = ProductInfoRating.objects.filter(brand_id=product_info.brand_id).values(
        'brand_id', 'major_category_id', 'sub_category_id', 'brand_name', 'major_category_name', 'sub_category_name', 'product_name',
        'effect_score', 'other_score', 'packaging_score', 'price_score', 'pure_emotion_score', 'retention_score', 'skin_combination_score',
        'skin_dry_score', 'skin_oil_score', 'skin_sensitive_score', 'smell_score', 'texture_greasy_score', 'texture_light_score',
        'usage_score', 'effect_num', 'other_num', 'packaging_num', 'price_num', 'pure_emotion_num', 'retention_num', 'skin_combination_num',
        'skin_dry_num', 'skin_oil_num', 'skin_sensitive_num', 'smell_num', 'texture_greasy_num', 'texture_light_num',
        'usage_num'
    )
    return JsonResponse({'result': list(brand_info)}, safe=False)

@ajax_required
@require_POST
def product_popularity(request):
    product_id = request.POST.get('product_id')
    all_category_num = CategoryReviewNum.objects.all()[:]
    product_info = ProductInfoRating.objects.get(product_id=product_id)
    all_product = ProductInfoRating.objects.filter(
        brand_id=product_info.brand_id
    ).values('major_category_name', 'sub_category_name').annotate(num_review=Sum('num'))

    return JsonResponse({
        'all_category': list(all_category_num.values_list()),
        'brand_category': list(all_product)
    }, safe=False)


@ajax_required
@require_POST
def product_comparison(request):
    product_ids = json.loads(request.POST.get('product_ids'))
    result = ProductInfoRating.objects.filter(product_id__in=product_ids).order_by('product_name')

    return JsonResponse(serialize('json', result), safe=False)
    # return JsonResponse({'result': list(result)}, safe=False)
    # return JsonResponse([], safe=False)

@ajax_required
@require_POST
def product_nav(request):
    option = int(request.POST.get('option'))
    value = request.POST.get('value')
    if option == 1:
        brand_list = Brand.objects.values('brand_id', 'brand_name').order_by('brand_name')
        return JsonResponse({
            'result': list(brand_list)
        }, safe=False)
    elif option == 2:
        brand_id = int(value)
        category_list = ProductNav.objects.filter(brand_id=brand_id)\
            .values('major_category_id', 'sub_category_id', 'major_category_name', 'sub_category_name')\
            .order_by('major_category_name', 'sub_category_name')
        return JsonResponse({'result': list(category_list)}, safe=False)
    elif option == 3:
        all_id = value.split(',')
        brand_id = int(all_id[0])
        major_category_id = int(all_id[1])
        sub_category_id = int(all_id[2])
        product_list = ProductInfoRating.objects.filter(
            brand_id=brand_id, major_category_id=major_category_id, sub_category_id=sub_category_id
        ).values('product_id', 'product_name', 'num').order_by('product_name')
        return JsonResponse({'result': list(product_list)}, safe=False)
    return JsonResponse([], safe=False)

@ajax_required
@require_POST
def brand_popularity_category(request):
    product_id = request.POST.get('product_id')
    product_info = ProductInfoRating.objects.get(product_id=product_id)

    major_category_name = re.sub(r'[\s-]', '_', product_info.major_category_name.lower())
    major_category_name = re.sub(r'_+', '_', major_category_name)
    # print(major_category_name)
    result = BrandCategoryCount.objects.values('brand_name', major_category_name)
    return JsonResponse({
        'major_category_name': product_info.major_category_name,
        'key': major_category_name,
        'brand_dist': list(result)
    }, safe=False)


@ajax_required
@require_POST
def competitor_brand(request):
    product_id = request.POST.get('product_id')

    if not product_id.isdigit():
        return JsonResponse([], safe=False)

    cursor = connection.cursor()
    sql = '''
        select
        b.brand_name,
        a.num_review
        from (select 
        t2.brand_id,
        count(*) as num_review
        from product_user_review t1
        inner join product_user_review t2
        on t1.product_id = {}
        and t1.major_category_id = t2.major_category_id
        and t1.user_id = t2.user_id
        group by t2.brand_id
        order by num_review desc
        limit 10
        ) a
        left join brand b 
        on a.brand_id = b.brand_id
        order by a.num_review
    '''.format(product_id)

    cursor.execute(sql)
    result = dictfetchall(cursor)
    # brand_list = Brand.objects.all()
    # brand_dict = {}
    # for brand in brand_list:
    #     brand_dict[brand.brand_id] = brand.brand_name
    #
    # result = []
    # for item in result_temp:
    #     result.append({
    #         'brand_name': brand_dict[item['brand_id']],
    #         'num_review': item['num_review']
    #     })
    return JsonResponse(result, safe=False)

@ajax_required
@require_POST
def user_skin_dist(request):
    product_id = request.POST.get('product_id')
    if not product_id.isdigit():
        return JsonResponse([], safe=False)
    cursor = connection.cursor()
    sql = '''
        select
        t3.skin_type,
        avg(t1.score) as score,
        count(*) as num
        from product_user_review t1
        left join user_info t2
        on t1.user_id = t2.user_id
        left join skin_type t3
        on t2.skin_type_id =  t3.skin_type_id
        where product_id = {}
        group by t3.skin_type
        order by num 
    '''.format(product_id)

    cursor.execute(sql)
    result = dictfetchall(cursor)
    # brand_list = Brand.objects.all()
    # brand_dict = {}
    # for brand in brand_list:
    #     brand_dict[brand.brand_id] = brand.brand_name
    #
    # result = []
    # for item in result_temp:
    #     result.append({
    #         'brand_name': brand_dict[item['brand_id']],
    #         'num_review': item['num_review']
    #     })
    return JsonResponse(result, safe=False)

@ajax_required
@require_POST
def user_age_dist(request):
    product_id = request.POST.get('product_id')
    if not product_id.isdigit():
        return JsonResponse([], safe=False)
    cursor = connection.cursor()
    sql = '''
        select 
        t2.age,
        count(*) as num
        from product_user_review t1
        inner join user_info t2
        on t1.product_id = {}
        and t1.user_id = t2.user_id
        group by t2.age
        order by t2.age
    '''.format(product_id)

    cursor.execute(sql)
    result = dictfetchall(cursor)
    return JsonResponse(result, safe=False)

@ajax_required
@require_POST
def user_country_dist(request):
    product_id = request.POST.get('product_id')
    if not product_id.isdigit():
        return JsonResponse([], safe=False)
    cursor = connection.cursor()
    sql = '''
        select 
        case when lower(t2.location) like '%united states%' then 'United States'
        else t2.location end as clean_location,
        count(*) as num
        from product_user_review t1
        inner join user_info t2
        on t1.product_id = {}
        and t1.user_id = t2.user_id
        group by clean_location
        order by num
    '''.format(product_id)

    cursor.execute(sql)
    result = dictfetchall(cursor)
    return JsonResponse(result, safe=False)

@ajax_required
@require_POST
def user_skin_type_dist(request):
    product_id = request.POST.get('product_id')
    if not product_id.isdigit():
        return JsonResponse([], safe=False)
    cursor = connection.cursor()
    sql = '''
        select 
        t3.skin_type,
        count(*) as num
        from product_user_review t1
        inner join user_info t2
        on t1.product_id = 102
        and t1.user_id = t2.user_id
        inner join skin_type t3
        on t2.skin_type_id = t3.skin_type_id
        group by skin_type
        order by num
    '''.format(product_id)

    cursor.execute(sql)
    result = dictfetchall(cursor)
    return JsonResponse(result, safe=False)

@ajax_required
@require_POST
def user_skin_tone_dist(request):
    product_id = request.POST.get('product_id')
    if not product_id.isdigit():
        return JsonResponse([], safe=False)
    cursor = connection.cursor()
    sql = '''
        select 
        t3.skin_tone,
        count(*) as num
        from product_user_review t1
        inner join user_info t2
        on t1.product_id = 102
        and t1.user_id = t2.user_id
        inner join skin_tone t3
        on t2.skin_tone_id = t3.skin_tone_id
        group by skin_tone
        order by num
    '''.format(product_id)

    cursor.execute(sql)
    result = dictfetchall(cursor)
    return JsonResponse(result, safe=False)
