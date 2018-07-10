from django.db import models
from cms.models.fields import PlaceholderField
from .utils import validate_video_url
from enumfields import Enum, EnumField
from votes.managers import VotableManager
from tagulous.models import TagField


class MoveVideoLink(models.Model):
    move = models.ForeignKey(
        'Move', on_delete=models.CASCADE, related_name='video_links')
    url = models.URLField()
    title = models.CharField(max_length=255, blank=True, null=True)
    votes = VotableManager()

    def default_title(self):
        return self.title or self.url

    def clean_fields(self, exclude=None):
        super().clean_fields(exclude=exclude)
        validate_video_url(self.url)


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

    def __str__(self):  # noqa
        return self.name
