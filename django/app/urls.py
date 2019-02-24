# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals
from django.conf import settings
from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.urls import include, path
from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from app.views import AppView

admin.autodiscover()

urlpatterns = []

if settings.DEBUG:
    from django.conf.urls.static import static
    # Serve static and media files from development server
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(
        settings.STATIC_URL, document_root=settings.STATIC_ROOT)

maybe_csrf_exempt = csrf_exempt if settings.DEBUG else lambda x: x

urlpatterns += i18n_patterns(
    path(r'admin/', admin.site.urls),
    path(r'auth/', include('accounts.urls')),
    url(r'app/', AppView.as_view()),
    path(r'graphql', maybe_csrf_exempt(GraphQLView.as_view(graphiql=True))),
)
