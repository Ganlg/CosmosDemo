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
    url(r'brand_popularity/$', views.brand_popularity_category, name='brand_popularity_category'),
    url(r'competitor_brand/$', views.competitor_brand, name='competitor_brand'),
    url(r'user_skin_dist/$', views.user_skin_dist, name='user_skin_dist'),
    url(r'user_age_dist/$', views.user_age_dist, name='user_age_dist'),
    url(r'user_country_dist/$', views.user_country_dist, name='user_country_dist'),
    url(r'user_skin_type_dist/$', views.user_skin_type_dist, name='user_skin_type_dist'),
    url(r'user_skin_tone_dist/$', views.user_skin_tone_dist, name='user_skin_tone_dist'),


    # url('test/$', views.test)
]
