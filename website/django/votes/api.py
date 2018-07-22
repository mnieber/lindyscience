from . import models
from . import serializers
from app.utils import _response_from_serializer
from django.contrib.contenttypes.models import ContentType
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum


class CurrentUserVotesView(APIView):
    def get(self, request):
        serializer = serializers.VoteSerializer(
            models.Vote.objects.filter(owner_id=request.user.id), many=True)
        return Response(serializer.data)

    def post(self, request):
        content_type = ContentType.objects.get_by_natural_key(
            request.data['app_label'].lower(), request.data['model'].lower())

        request_data = request.data.copy()
        request_data['owner'] = request.user.id
        request_data['content_type'] = content_type.id

        votes = models.Vote.objects.filter(
            owner=request_data['owner'],
            content_type=request_data['content_type'],
            object_id=request_data['object_id'])
        serializer = serializers.VoteSerializer(
            instance=votes[0] if votes.exists() else None, data=request_data)
        is_valid = serializer.is_valid()
        if is_valid:
            vote = serializer.save()
            vote_count = models.Vote.objects.filter(
                object_id=vote.object_id).aggregate(Sum('value'))
            content_type.model_class().objects.filter(
                pk=vote.object_id).update(vote_count=vote_count['value__sum'])

        return _response_from_serializer(is_valid, serializer)
