from rest_framework import serializers
from . import models
from app.middleware import get_current_user


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

    nr_votes = serializers.IntegerField(source='votes.count')
    is_liked_by_current_user = serializers.SerializerMethodField()
    default_title = serializers.CharField()

    def get_is_liked_by_current_user(self, obj):
        votes = obj.votes.all(get_current_user()).filter(pk=obj.pk)
        return votes.exists()
