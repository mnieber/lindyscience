from rest_framework.views import APIView
from rest_framework.response import Response
from . import serializers
from . import models
from app.utils import _response_from_serializer, _failure


def _request_data_with_owner(request):
    request_data = request.data.copy()
    request_data['owner'] = request.user.id
    return request_data


def _save_serializer(serializer, request_data):
    if 'id' in request_data:
        return serializer.save(id=request_data['id'])
    else:
        return serializer.save()


class MovesView(APIView):
    def get(self, request):
        serializer = serializers.MoveSerializer(
            models.Move.objects.all(), many=True)
        return Response({
            'moves':
            serializer.data,
            'tags':
            [tag.name for tag in models.Move.tags.tag_model.objects.all()]
        })

    def post(self, request):
        request_data = _request_data_with_owner(request)
        serializer = serializers.MoveSerializer(data=request_data)
        is_valid = serializer.is_valid()
        if is_valid:
            _save_serializer(serializer, request_data)
        return _response_from_serializer(is_valid, serializer)


class MoveView(APIView):
    def patch(self, request, pk):
        instance = models.Move.objects.get(pk=pk)
        if instance.owner_id != request.user.id:
            return _failure('No permission', 403)

        serializer = serializers.MoveSerializer(
            instance=instance, data=request.data, partial=True)

        is_valid = serializer.is_valid()
        if is_valid:
            move = serializer.save()
            # HACK: fix the value of the tags field
            move.tags = request.data['tags']
            move.save()

        return _response_from_serializer(is_valid, serializer)


class MovePrivateDatasView(APIView):
    def get(self, request):
        serializer = serializers.MovePrivateDataSerializer(
            models.MovePrivateData.objects.all(), many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = serializers.MovePrivateDataSerializer(
            data=_request_data_with_owner(request))
        is_valid = serializer.is_valid()
        if is_valid:
            serializer.save()
        return _response_from_serializer(is_valid, serializer)


class MovePrivateDataView(APIView):
    def patch(self, request, pk):
        instance = models.MovePrivateData.objects.get(pk=pk)
        if instance.owner_id != request.user.id:
            return _failure('No permission', 403)

        serializer = serializers.MovePrivateDataSerializer(
            instance=instance, data=request.data, partial=True)

        is_valid = serializer.is_valid()
        if is_valid:
            serializer.save()

        return _response_from_serializer(is_valid, serializer)


class MoveVideoLinksView(APIView):
    def get(self, request):
        serializer = serializers.MoveVideoLinkSerializer(
            models.MoveVideoLink.objects.all(), many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = serializers.MoveVideoLinkSerializer(
            data=_request_data_with_owner(request))
        is_valid = serializer.is_valid()
        if is_valid:
            serializer.save()
        return _response_from_serializer(is_valid, serializer)


class MoveVideoLinkView(APIView):
    def patch(self, request, pk):
        instance = models.MoveVideoLink.objects.get(pk=pk)
        if instance.owner_id != request.user.id:
            return _failure('No permission', 403)

        serializer = serializers.MoveVideoLinkSerializer(
            instance=instance, data=request.data, partial=True)

        is_valid = serializer.is_valid()
        if is_valid:
            serializer.save()

        return _response_from_serializer(is_valid, serializer)


class MoveTipsView(APIView):
    def get(self, request):
        serializer = serializers.MoveTipSerializer(
            models.MoveTip.objects.all(), many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = serializers.MoveTipSerializer(
            data=_request_data_with_owner(request))
        is_valid = serializer.is_valid()
        if is_valid:
            serializer.save()
        return _response_from_serializer(is_valid, serializer)


class MoveTipView(APIView):
    def patch(self, request, pk):
        instance = models.MoveTip.objects.get(pk=pk)
        if instance.owner_id != request.user.id:
            return _failure('No permission', 403)

        serializer = serializers.MoveTipSerializer(
            instance=instance, data=request.data, partial=True)

        is_valid = serializer.is_valid()
        if is_valid:
            serializer.save()

        return _response_from_serializer(is_valid, serializer)
