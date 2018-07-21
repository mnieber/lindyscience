from rest_framework.views import APIView
from rest_framework.response import Response
from . import serializers
from . import models
from app.utils import _response_from_serializer


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

    def post(self, request):
        serializer = serializers.MoveVideoLinkSerializer(data=request.data)

        is_valid = serializer.is_valid()
        if is_valid:
            serializer.save()

        return _response_from_serializer(is_valid, serializer)


class MoveVideoLinkView(APIView):
    def patch(self, request, pk):
        serializer = serializers.MoveVideoLinkSerializer(
            instance=models.MoveVideoLink.objects.get(pk=pk),
            data=request.data,
            partial=True)

        is_valid = serializer.is_valid()
        if is_valid:
            serializer.save()

        return _response_from_serializer(is_valid, serializer)
