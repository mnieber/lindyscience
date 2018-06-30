from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.MovesView.as_view()),
]
