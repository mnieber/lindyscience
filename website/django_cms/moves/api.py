from rest_framework.views import APIView
from rest_framework.response import Response
from votes.models import Vote
from . import serializers
from . import models


class MovesView(APIView):
    def get(self, request):
        serializer = serializers.MoveSerializer(
            models.Move.objects.all(), many=True)
        return Response(serializer.data)


class MoveVideoLinksView(APIView):
    def get(self, request):
        serializer = serializers.MoveVideoLinkSerializer(
            models.MoveVideoLink.objects.all(), many=True)
        return Response(serializer.data)


class CurrentUserVotesView(APIView):
    def get(self, request):
        serializer = serializers.VoteSerializer(
            Vote.objects.filter(user_id=request.user.id), many=True)
        return Response(serializer.data)
