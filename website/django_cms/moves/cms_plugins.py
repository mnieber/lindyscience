from cms.models.fields import PlaceholderField
from cms.models.pluginmodel import CMSPlugin
from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool
from django.contrib import admin
from django.db import models
from enumfields import Enum, EnumField
from taggit.managers import TaggableManager
from .utils import validate_video_url


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


class MoveVideoLinkInline(admin.StackedInline):
    model = MoveVideoLink
    extra = 1


class Difficulty(Enum):
    BEGINNER = 'beg'
    BEGINNER_INTERMEDIATE = 'beg/int'
    INTERMEDIATE = 'int'
    INTERMEDIATE_ADVANCED = 'int/adv'
    ADVANCED = 'adv'


class Move(CMSPlugin):
    name = models.CharField(max_length=200, unique=True)
    difficulty = EnumField(Difficulty, max_length=7)
    description = PlaceholderField('description', related_name="description")
    foo = PlaceholderField('foo', related_name="foo")
    tags = TaggableManager()

    def save(self, *args, **kwargs):
        from cms.api import add_plugin

        if self.pk:
            super().save(*args, **kwargs)  # Call the "real" save() method.
            add_plugin(
                self.description,
                'TextPlugin',
                'en',
                body="<p>Biography coming soon.</p>")
        else:
            super().save(*args, **kwargs)  # Call the "real" save() method.


@plugin_pool.register_plugin
class MovePlugin(CMSPluginBase):
    model = Move
    name = 'Move'
    render_template = "moves/move.html"
    cache = False
    inlines = (MoveVideoLinkInline, )

    def __str__(self):  # noqa
        return self.move.name
