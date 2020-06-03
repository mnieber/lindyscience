# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from app.views import AppView
from django.conf import settings
from django.conf.urls import url
from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.urls import include, path
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.base import RedirectView
from graphene_django.views import GraphQLView

admin.autodiscover()

urlpatterns = []

if settings.DEBUG or getattr(settings, "FORCE_SERVE_STATIC", False):
    from django.conf.urls.static import static

    # Serve static and media files from development server
    prev = settings.DEBUG
    settings.DEBUG = True
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    settings.DEBUG = prev

urlpatterns += i18n_patterns(
    path(r"admin/", admin.site.urls),
    path(r"auth/", include("accounts.urls")),
    path(r"graphql/", csrf_exempt(GraphQLView.as_view(graphiql=True))),
    url(r"app/", AppView.as_view()),
    url(r"^$", RedirectView.as_view(url="app/")),
)
