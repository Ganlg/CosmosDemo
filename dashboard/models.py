# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from __future__ import unicode_literals
from django.db import models


class ProductInfoRating(models.Model):
    product_id = models.IntegerField(primary_key=True)
    brand_id = models.IntegerField()
    major_category_id = models.IntegerField()
    sub_category_id = models.IntegerField()
    brand_name = models.CharField(max_length=40)
    major_category_name = models.CharField(max_length=24)
    sub_category_name = models.CharField(max_length=24)
    product_name = models.CharField(max_length=120)
    rating = models.FloatField(blank=True, null=True)
    repurchase = models.CharField(max_length=4, blank=True, null=True)
    pkg_quality = models.FloatField(blank=True, null=True)
    price = models.IntegerField(blank=True, null=True)
    ingredient = models.TextField(blank=True, null=True)
    effect_score = models.FloatField(blank=True, null=True)
    other_score = models.FloatField(blank=True, null=True)
    packaging_score = models.FloatField(blank=True, null=True)
    price_score = models.FloatField(blank=True, null=True)
    pure_emotion_score = models.FloatField(blank=True, null=True)
    retention_score = models.FloatField(blank=True, null=True)
    skin_combination_score = models.FloatField(blank=True, null=True)
    skin_dry_score = models.FloatField(blank=True, null=True)
    skin_normal_score = models.FloatField(blank=True, null=True)
    skin_oil_score = models.FloatField(blank=True, null=True)
    skin_sensitive_score = models.FloatField(blank=True, null=True)
    smell_score = models.FloatField(blank=True, null=True)
    texture_greasy_score = models.FloatField(blank=True, null=True)
    texture_light_score = models.FloatField(blank=True, null=True)
    usage_score = models.FloatField(blank=True, null=True)
    effect_num = models.IntegerField(blank=True, null=True)
    other_num = models.IntegerField(blank=True, null=True)
    packaging_num = models.IntegerField(blank=True, null=True)
    price_num = models.IntegerField(blank=True, null=True)
    pure_emotion_num = models.IntegerField(blank=True, null=True)
    retention_num = models.IntegerField(blank=True, null=True)
    skin_combination_num = models.IntegerField(blank=True, null=True)
    skin_dry_num = models.IntegerField(blank=True, null=True)
    skin_normal_num = models.IntegerField(blank=True, null=True)
    skin_oil_num = models.IntegerField(blank=True, null=True)
    skin_sensitive_num = models.IntegerField(blank=True, null=True)
    smell_num = models.IntegerField(blank=True, null=True)
    texture_greasy_num = models.IntegerField(blank=True, null=True)
    texture_light_num = models.IntegerField(blank=True, null=True)
    usage_num = models.IntegerField(blank=True, null=True)
    num = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'product_info_rating'


class ProductInfoRatingRank(models.Model):
    product_id = models.IntegerField(primary_key=True)
    major_category_id = models.IntegerField()
    sub_category_id = models.IntegerField()
    effect_score = models.FloatField(blank=True, null=True)
    effect_score_rank_sub = models.IntegerField(blank=True, null=True)
    effect_score_rank_sub_total = models.IntegerField(blank=True, null=True)
    other_score = models.FloatField(blank=True, null=True)
    other_score_rank_sub = models.IntegerField(blank=True, null=True)
    other_score_rank_sub_total = models.IntegerField(blank=True, null=True)
    packaging_score = models.FloatField(blank=True, null=True)
    packaging_score_rank_sub = models.IntegerField(blank=True, null=True)
    packaging_score_rank_sub_total = models.IntegerField(blank=True, null=True)
    price_score = models.FloatField(blank=True, null=True)
    price_score_rank_sub = models.IntegerField(blank=True, null=True)
    price_score_rank_sub_total = models.IntegerField(blank=True, null=True)
    pure_emotion_score = models.FloatField(blank=True, null=True)
    pure_emotion_score_rank_sub = models.IntegerField(blank=True, null=True)
    pure_emotion_score_rank_sub_total = models.IntegerField(blank=True, null=True)
    retention_score = models.FloatField(blank=True, null=True)
    retention_score_rank_sub = models.IntegerField(blank=True, null=True)
    retention_score_rank_sub_total = models.IntegerField(blank=True, null=True)
    skin_combination_score = models.FloatField(blank=True, null=True)
    skin_combination_score_rank_sub = models.IntegerField(blank=True, null=True)
    skin_combination_score_rank_sub_total = models.IntegerField(blank=True, null=True)
    skin_dry_score = models.FloatField(blank=True, null=True)
    skin_dry_score_rank_sub = models.IntegerField(blank=True, null=True)
    skin_dry_score_rank_sub_total = models.IntegerField(blank=True, null=True)
    skin_normal_score = models.FloatField(blank=True, null=True)
    skin_normal_score_rank_sub = models.IntegerField(blank=True, null=True)
    skin_normal_score_rank_sub_total = models.IntegerField(blank=True, null=True)
    skin_oil_score = models.FloatField(blank=True, null=True)
    skin_oil_score_rank_sub = models.IntegerField(blank=True, null=True)
    skin_oil_score_rank_sub_total = models.IntegerField(blank=True, null=True)
    skin_sensitive_score = models.FloatField(blank=True, null=True)
    skin_sensitive_score_rank_sub = models.IntegerField(blank=True, null=True)
    skin_sensitive_score_rank_sub_total = models.IntegerField(blank=True, null=True)
    smell_score = models.FloatField(blank=True, null=True)
    smell_score_rank_sub = models.IntegerField(blank=True, null=True)
    smell_score_rank_sub_total = models.IntegerField(blank=True, null=True)
    texture_greasy_score = models.FloatField(blank=True, null=True)
    texture_greasy_score_rank_sub = models.IntegerField(blank=True, null=True)
    texture_greasy_score_rank_sub_total = models.IntegerField(blank=True, null=True)
    texture_light_score = models.FloatField(blank=True, null=True)
    texture_light_score_rank_sub = models.IntegerField(blank=True, null=True)
    texture_light_score_rank_sub_total = models.IntegerField(blank=True, null=True)
    usage_score = models.FloatField(blank=True, null=True)
    usage_score_rank_sub = models.IntegerField(blank=True, null=True)
    usage_score_rank_sub_total = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'product_info_rating_rank'


class Brand(models.Model):
    brand_id = models.IntegerField()
    brand_name = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'brand'

class ProductNav(models.Model):
    brand_id = models.IntegerField()
    brand_name = models.CharField(max_length=40)
    major_category_id = models.IntegerField()
    major_category_name = models.CharField(max_length=36)
    sub_category_id = models.IntegerField()
    sub_category_name = models.CharField(max_length=36)

    class Meta:
        managed = False
        db_table = 'product_nav'


class CategoryReviewNum(models.Model):
    major_category_id = models.IntegerField()
    sub_category_id = models.IntegerField()
    major_category_name = models.CharField(max_length=32)
    sub_category_name = models.CharField(max_length=32)
    num_review = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'category_review_num'