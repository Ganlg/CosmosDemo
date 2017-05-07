from django.conf.urls import url, include
from . import views


urlpatterns = [
    url(r'^$', views.index),
    url(r'^product_hint/$', views.product_hint, name='product_hint'),
    url(r'^product_found/$', views.product_found, name='product_found'),
    url(r'^product_rank/$', views.product_rank, name='product_rank'),
    url(r'^product_comparison/$', views.product_comparison, name='product_comparison'),

]
