import uuid
from django.db import models
from django.conf import settings


class Entity(models.Model):
    class Meta:
        abstract = True
        ordering = ['-created']

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL,
                              on_delete=models.CASCADE)
    created = models.DateField(auto_now_add=True)
