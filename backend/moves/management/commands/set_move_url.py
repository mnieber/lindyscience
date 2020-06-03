from django.core.management.base import BaseCommand
from django.db import transaction

from moves import models


class Command(BaseCommand):
    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        with transaction.atomic():
            for move in models.Move.objects.all():
                video_links = [x for x in move.video_links.all()]
                if video_links:
                    move.link = video_links[0].link
                else:
                    move.link = None
                move.save()
