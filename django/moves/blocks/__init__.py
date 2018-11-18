from django.db import models  # noqa
from wagtail.snippets.models import register_snippet  # noqa
from wagtail.core.fields import RichTextField, StreamField  # noqa
from wagtail.admin.edit_handlers import (  # noqa
    FieldPanel, StreamFieldPanel)
from wagtail.images.edit_handlers import ImageChooserPanel  # noqa
from wagtail.images.blocks import ImageChooserBlock  # noqa
from wagtail.snippets.blocks import SnippetChooserBlock  # noqa
from wagtail.snippets.edit_handlers import SnippetChooserPanel  # noqa
from wagtail.core.blocks import (  # noqa
    StreamBlock, StructBlock, CharBlock, RichTextBlock, ListBlock, URLBlock,
    IntegerBlock)
