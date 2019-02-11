# -*- coding: utf-8 -*-
from django.conf.urls import include, url

urlpatterns = [
    url(r'^', include('djoser.urls')),
    url(r'^', include('djoser.urls.authtoken')),
]
