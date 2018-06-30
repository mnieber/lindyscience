from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^basic/?$', views.MoveView.as_view()),
    url(r'^$', views.MovesView.as_view()),
]
