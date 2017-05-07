from django.shortcuts import render
from django.views.decorators.http import  require_POST
from django.http import JsonResponse, HttpResponse
from django.core.serializers import serialize
from django.db.models import Q

import json
import re

from tools.decorators import ajax_required
from .forms import MessageForm
from .models import ProductInfoRating, ProductInfoRatingRank
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
        result = ProductInfoRating.objects.filter(product_name__icontains=text).values('product_id', 'product_name', 'num')[:5]
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
def product_comparison(request):
    product_ids = json.loads(request.POST.get('product_ids'))
    result = ProductInfoRating.objects.filter(product_id__in=product_ids).order_by('product_name')

    return JsonResponse(serialize('json', result), safe=False)
    # return JsonResponse({'result': list(result)}, safe=False)
    # return JsonResponse([], safe=False)



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