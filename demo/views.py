from django.shortcuts import render
from django.views.decorators.http import  require_POST
from django.http import JsonResponse, HttpResponse
from django.core.serializers import serialize
from django.db.models import Q, Sum

import json
import re

from tools.decorators import ajax_required
from .forms import MessageForm
from .models import ProductInfoRating, ProductInfoRatingRank, Brand, ProductNav, CategoryReviewNum
# Create your views here.
def index(request):
    return render(request, 'demo/demo.html')

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

# @ajax_required
# @require_POST
# def product_search(request):
#     form = MessageForm(request.POST)
#     if form.is_valid():
#         text = form.cleaned_data['text']
#         query_sets = ProductInfoRating.objects.values('product_id', 'product_name', 'num').all()
#         result = fuzzyfinder(text, query_sets, 'product_name')
#         # result = ProductInfoRating.objects.filter(product_name__icontains=text).values('product_id', 'product_name', 'num')[:5]
#         return JsonResponse({'result': list(result)}, safe=False)
#     return JsonResponse([], safe=False)


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
        # print(product_rank[1])

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
    # print(type(option))
    if option == 1:
        # print('good')
        brand_list = Brand.objects.all().order_by('brand_name')
        return JsonResponse(serialize('json', brand_list), safe=False)
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



def fuzzyfinder(user_input, collection, name):
    suggestions = []
    pattern = '.*?'.join(user_input)  # Converts 'djm' to 'd.*?j.*?m'
    regex = re.compile(pattern)  # Compiles a regex.
    for item in collection:
        match = regex.search(item[name])  # Checks if the current item matches the regex.
        if match:
            suggestions.append((len(match.group()), match.start(), item[name]))
    result = []
    count = 0
    for _, _, x in sorted(suggestions):
        if count < 5:
            result.append(x)
        else:
            break
        count += 1
    return result


def test(request):
    return render(request, 'demo/test.html')