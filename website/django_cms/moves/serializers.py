from rest_framework import serializers
from .models import MoveVideoLink


class MoveVideoLinkSerializer(serializers.ModelSerializer):  # noqa
    class Meta:  # noqa
        model = MoveVideoLink
        exclude = []

    nr_votes = serializers.IntegerField(source='votes.count')
    default_title = serializers.CharField()
