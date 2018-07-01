from rest_framework import serializers
from .models import MoveVideoLink
from app.middleware import get_current_user


class MoveVideoLinkSerializer(serializers.ModelSerializer):  # noqa
    class Meta:  # noqa
        model = MoveVideoLink
        exclude = []

    nr_votes = serializers.IntegerField(source='votes.count')
    is_liked_by_current_user = serializers.SerializerMethodField()
    default_title = serializers.CharField()

    def get_is_liked_by_current_user(self, obj):
        votes = obj.votes.all(get_current_user()).filter(pk=obj.pk)
        return votes.exists()
