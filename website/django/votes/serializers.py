from . import models
from rest_framework import serializers


class VoteSerializer(serializers.ModelSerializer):  # noqa
    class Meta:  # noqa
        model = models.Vote
        exclude = []

    model = serializers.SerializerMethodField()

    def get_model(self, obj):
        return obj.content_type.name
