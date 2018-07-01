from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^(?P<move_name>[^/]+)/?$', views.MoveView.as_view(), name='move'),
    url(r'^$', views.MovesView.as_view()),
]
