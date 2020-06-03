from django.core.management.base import BaseCommand
from django.db import transaction

from moves import models


class Command(BaseCommand):
    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        with transaction.atomic():
            for move in models.Move.objects.all():
                move_lists = [x for x in move.movelist_set.all()]
                if not move_lists:
                    __import__("pudb").set_trace()
                move.source_move_list = move_lists[0]
                move.save()
