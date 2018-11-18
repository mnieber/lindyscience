import uuid
from django.db import models
from django.conf import settings


class Entity(models.Model):
    class Meta:
        abstract = True

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created = models.DateField(auto_now_add=True)


class ProfileToMoveList(models.Model):
    profile = models.ForeignKey('Profile')
    move_list = models.ForeignKey('moves.MoveList')
    order = models.FloatField()

    class Meta:
        ordering = ['order']


class Profile(Entity):
    recent_move_list = models.ForeignKey('moves.MoveList', related_name='+')
    move_lists = models.ManyToManyField(
        'moves.MoveList', through=ProfileToMoveList)

    def __str__(self):  # noqa
        return "Profile of %s" % self.owner.username
