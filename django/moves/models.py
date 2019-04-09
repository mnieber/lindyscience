from .utils import validate_video_url
from django.db import models
from tagulous.models import TagField
from app.models import Entity

# Moves models


class VideoLink(Entity):
    move = models.ForeignKey(
        'Move', on_delete=models.CASCADE, related_name='video_links')
    url = models.URLField()
    title = models.CharField(max_length=255, blank=True, null=True)
    vote_count = models.IntegerField(default=0)

    def default_title(self):
        return self.title or self.url

    def clean_fields(self, exclude=None):
        super().clean_fields(exclude=exclude)
        validate_video_url(self.url)


class Tip(Entity):
    move = models.ForeignKey(
        'Move', on_delete=models.CASCADE, related_name='tips')
    text = models.CharField(max_length=255, blank=True, null=True)
    vote_count = models.IntegerField(default=0)


class Move(Entity):
    name = models.CharField(max_length=200, unique=False)
    slug = models.CharField(max_length=200, unique=False)
    description = models.TextField()
    source_move_list = models.ForeignKey(
        'MoveList', on_delete=models.CASCADE, related_name='sourced_moves')
    tags = TagField(force_lowercase=True, max_count=10, space_delimiter=False)

    def __str__(self):  # noqa
        return self.name


class MoveList2Move(models.Model):
    move = models.ForeignKey(Move, on_delete=models.CASCADE)
    move_list = models.ForeignKey('MoveList', on_delete=models.CASCADE)
    order = models.FloatField()

    class Meta:
        ordering = ['order']


class MoveList(Entity):
    name = models.CharField(max_length=200, unique=True)
    slug = models.CharField(max_length=200, unique=True)
    role = models.CharField(
        max_length=200,
        choices=[('', 'default'), ('drafts', 'drafts'), ('trash', 'trash')],
        default='')
    is_private = models.BooleanField(default=False)
    description = models.TextField()
    tags = TagField(
        force_lowercase=True, max_count=10, space_delimiter=False, blank=True)
    moves = models.ManyToManyField(Move, through=MoveList2Move)

    def __str__(self):  # noqa
        return self.name


class MovePrivateData(Entity):
    move = models.ForeignKey(
        'Move', on_delete=models.CASCADE, related_name='private_datas')
    notes = models.TextField()
    tags = TagField(
        force_lowercase=True, max_count=10, space_delimiter=False, blank=True)

    def __str__(self):  # noqa
        return "Notes by %s on %s" % (self.owner, self.move)
