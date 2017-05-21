from django.conf.urls import url, include
from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^product_hint/$', views.product_hint, name='product_hint'),
    url(r'^product_found/$', views.product_found, name='product_found'),
    url(r'^product_rank/$', views.product_rank, name='product_rank'),
    url(r'^product_comparison/$', views.product_comparison, name='product_comparison'),
    url(r'brand_info/$', views.brand_info, name='brand_info'),
    url(r'product_nav/$', views.product_nav, name='product_nav'),
    url(r'product_popularity/$', views.product_popularity, name='product_popularity'),

    # url('test/$', views.test)
]
