from django.conf.urls import url
from . import views
from . import api

urlpatterns = [
    url(r'^moves/?$', api.MovesView.as_view(), name='moves'),
    url(r'^move-video-links/?$', api.MoveVideoLinksView.as_view()),
    url(r'^move-video-links/(?P<pk>[a-z0-9\-]+)/?$',
        api.MoveVideoLinkView.as_view()),
    url(r'^moves/(?P<move_name>[^/]+)/description/?$',
        views.MoveDescriptionView.as_view()),
    url(r'^moves/(?P<move_name>[^/]+)/edit/?$',
        views.EditMoveView.as_view(),
        name='edit_move'),
    url(r'^votes/?$', api.CurrentUserVotesView.as_view(), name='votes'),
]
