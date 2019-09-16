from django.core.management.base import BaseCommand
from moves import models
from django.db import transaction


class Command(BaseCommand):
    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        __import__('pudb').set_trace()
        with transaction.atomic():
            for move in models.Move.objects.all():
                video_links = [x for x in move.video_links.all()]
                if video_links:
                    move.link = video_links[0].link
                else:
                    move.link = None
                move.save()
