from cms.models.fields import PlaceholderField
from cms.models.pluginmodel import CMSPlugin
from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool
from django.core.exceptions import ValidationError
from django.contrib import admin
from django.db import models
from enumfields import Enum, EnumField
from taggit.managers import TaggableManager
from urllib.parse import urlparse, parse_qs


class MoveVideoLink(models.Model):
    move = models.ForeignKey('Move', on_delete=models.CASCADE)
    url = models.URLField()
    nr_votes = models.IntegerField(default=0, editable=False)

    def clean_fields(self, exclude=None):
        super().clean_fields(exclude=exclude)
        parsed_url = urlparse(self.url)
        if parsed_url.netloc in ('youtube', 'youtu.be'):
            query = parse_qs(parsed_url.query)
            if 't' not in query:
                raise ValidationError({
                    'url':
                    'Youtube urls should have a t=<timestamp> parameter'
                })


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
    description = PlaceholderField('description')
    tags = TaggableManager()


@plugin_pool.register_plugin
class MoveListPlugin(CMSPluginBase):
    model = Move
    render_template = "moves/movelist.html"
    cache = False
    inlines = (MoveVideoLinkInline, )
