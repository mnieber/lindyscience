from rest_framework.views import APIView
from rest_framework.response import Response
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
