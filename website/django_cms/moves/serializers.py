from . import models
from collections import Counter
from rest_framework import serializers
from votes.models import Vote


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

    nr_votes = serializers.SerializerMethodField()
    default_title = serializers.CharField()

    def get_nr_votes(self, obj):
        likes = obj.votes.likes()
        counts = Counter(likes)
        count = counts.get(True, 0) - counts.get(False, 0)
        return count if count else 0


class VoteSerializer(serializers.ModelSerializer):  # noqa
    class Meta:  # noqa
        model = Vote
        exclude = []

    model = serializers.SerializerMethodField()

    def get_model(self, obj):
        return obj.content_type.name
