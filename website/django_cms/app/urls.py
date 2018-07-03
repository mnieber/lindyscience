# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals
from cms.sitemaps import CMSSitemap
from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from .views import AppView

admin.autodiscover()

urlpatterns = [
    url(r'^sitemap\.xml$', sitemap, {'sitemaps': {
        'cmspages': CMSSitemap
    }}),
]

if settings.DEBUG:
    from django.conf.urls.static import static
    # Serve static and media files from development server
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(
        settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += i18n_patterns(
    url(r'^admin/', include(admin.site.urls)),  # NOQA
    url(r'^app/', AppView.as_view()),
    url(r'^', include('moves.urls')),
    url(r'^', include('votes.urls')),
    url(r'^', include('cms.urls')),
)
