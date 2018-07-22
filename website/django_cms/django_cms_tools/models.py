from cms.models.fields import PlaceholderField
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models


class TempPlaceholder(models.Model):
    placeholder = PlaceholderField(
        'temporary placeholder', related_name="temp_placeholder")
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.IntegerField()
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content_object = GenericForeignKey('content_type', 'object_id')
