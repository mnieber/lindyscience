from django.db import models
from cms.models.fields import PlaceholderField
from .utils import validate_video_url
from enumfields import Enum, EnumField
from taggit.managers import TaggableManager


class MoveVideoLink(models.Model):
    class Meta:
        verbose_name = 'Video Link'
        verbose_name_plural = 'Video Links'

    move = models.ForeignKey(
        'Move', on_delete=models.CASCADE, related_name='video_links')
    url = models.URLField()
    nr_votes = models.IntegerField(default=0, editable=False)

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
    tags = TaggableManager()

    # def save(self, *args, **kwargs):
    #     from cms.api import add_plugin

    #     if not self.pk:
    #         super().save(*args, **kwargs)  # Call the "real" save() method.
    #         add_plugin(
    #             self.description,
    #             'TextPlugin',
    #             'en',
    #             body="<p>Describe the move here.</p>")
    #     else:
    #         super().save(*args, **kwargs)  # Call the "real" save() method.

    def __str__(self):  # noqa
        return self.name
