from rest_framework.views import APIView
from rest_framework.response import Response
from votes.models import Vote
from . import serializers
from . import models


def _success(data):
    return Response(dict(success=True, data=data), status=200)


def _failure(error, status):
    return Response(dict(success=False, error=error), status=status)


def _response_from_serializer(is_valid, serializer):
    if is_valid:
        return _success(serializer.data)

    error_strings = []
    for field, errors in serializer.errors.items():
        error_strings.append("%s - %s" % (field, "/".join(errors)))

    return _failure(error=", ".join(error_strings), status=400)


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


class CurrentUserVotesView(APIView):
    def get(self, request):
        serializer = serializers.VoteSerializer(
            Vote.objects.filter(user_id=request.user.id), many=True)
        return Response(serializer.data)
