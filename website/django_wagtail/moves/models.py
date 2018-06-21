from django.db import models
from django import forms
from moves.blocks import (StreamField, RichTextBlock, FieldPanel,
                          StreamFieldPanel, URLBlock, StructBlock,
                          IntegerBlock)
from enumfields import Enum, EnumField
from wagtail.core.models import Page
from urllib.parse import urlparse
from modelcluster.fields import ParentalKey
from modelcluster.contrib.taggit import ClusterTaggableManager
from taggit.models import TaggedItemBase


class Difficulty(Enum):
    BEGINNER = 'beg'
    BEGINNER_INTERMEDIATE = 'beg/int'
    INTERMEDIATE = 'int'
    INTERMEDIATE_ADVANCED = 'int/adv'
    ADVANCED = 'adv'


class VideoLinkBlock(StructBlock):
    url = URLBlock()
    nr_votes = IntegerBlock(default=0, editable=False)

    def clean(self):
        parsed_url = urlparse(self.url)
        if 'youtube' in parsed_url.netloc:
            if not any(['t' in x for x in parsed_url.params]):
                raise forms.ValidationError(
                    "Youtube urls should have a t=<timestamp> parameter")


class MovePageTag(TaggedItemBase):
    content_object = ParentalKey(
        'moves.MovePage',
        on_delete=models.CASCADE,
        related_name='tagged_items')


class MovePage(Page):
    difficulty = EnumField(Difficulty, max_length=7)
    description = StreamField([('paragraph', RichTextBlock())])
    tags = ClusterTaggableManager(through=MovePageTag, blank=True)
    video_links = StreamField([('video_link', VideoLinkBlock())], default=[])

    content_panels = Page.content_panels + [
        FieldPanel('difficulty'),
        StreamFieldPanel('description'),
        StreamFieldPanel('video_links'),
        FieldPanel('tags'),
    ]

    parent_page_types = ['moves.MoveIndexPage']


class MoveIndexPage(Page):
    subpage_types = ['moves.MovePage']
