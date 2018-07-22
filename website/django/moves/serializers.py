from . import models
from rest_framework import serializers


class MoveSerializer(serializers.ModelSerializer):  # noqa
    class Meta:  # noqa
        model = models.Move
        exclude = ['description']

    difficulty = serializers.CharField()
    tags = serializers.CharField()


class MoveVideoLinkSerializer(serializers.ModelSerializer):  # noqa
    class Meta:  # noqa
        model = models.MoveVideoLink
        exclude = []


class MoveTipSerializer(serializers.ModelSerializer):  # noqa
    class Meta:  # noqa
        model = models.MoveTip
        exclude = []
