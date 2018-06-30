from django.db import models
from cms.models.fields import PlaceholderField


class MovesPage(models.Model):
    name = models.CharField(max_length=255)
    moves = PlaceholderField('moves')

    def __str__(self):  # noqa
        return self.name
