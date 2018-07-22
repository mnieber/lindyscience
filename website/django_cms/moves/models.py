from .utils import validate_video_url
from cms.models.fields import PlaceholderField
from django.conf import settings
from django.db import models
from enumfields import Enum, EnumField
from tagulous.models import TagField
import uuid


class MoveVideoLink(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    move = models.ForeignKey(
        'Move', on_delete=models.CASCADE, related_name='video_links')
    url = models.URLField()
    title = models.CharField(max_length=255, blank=True, null=True)
    vote_count = models.IntegerField(default=0)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def default_title(self):
        return self.title or self.url

    def clean_fields(self, exclude=None):
        super().clean_fields(exclude=exclude)
        validate_video_url(self.url)


class MoveTip(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    move = models.ForeignKey(
        'Move', on_delete=models.CASCADE, related_name='tips')
    text = models.CharField(max_length=255, blank=True, null=True)
    vote_count = models.IntegerField(default=0)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)


class Difficulty(Enum):
    BEGINNER = 'beg'
    BEGINNER_INTERMEDIATE = 'beg/int'
    INTERMEDIATE = 'int'
    INTERMEDIATE_ADVANCED = 'int/adv'
    ADVANCED = 'adv'


class Move(models.Model):
    name = models.CharField(max_length=200, unique=True)
    difficulty = EnumField(Difficulty, max_length=7)
    description = PlaceholderField('description', related_name="description")
    tags = TagField(force_lowercase=True, max_count=10)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):  # noqa
        return self.name


class MovePrivateData(models.Model):
    move = models.ForeignKey('Move', on_delete=models.CASCADE)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    notes = PlaceholderField('Private notes', related_name="notes")

    def __str__(self):  # noqa
        return "Notes by %s on %s" % (self.owner, self.move)
