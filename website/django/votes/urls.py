from django.conf.urls import url
from . import api

urlpatterns = [
    url(r'^votes/?$', api.CurrentUserVotesView.as_view(), name='votes'),
]
