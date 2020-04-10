from django.core.management.base import BaseCommand
from moves import models
from django.db import transaction


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("move_list_id"),

    def handle(self, move_list_id, *args, **options):
        move_list = models.MoveList.objects.get(pk=move_list_id)
        move_ids = [x.id for x in move_list.moves.all()]

        with transaction.atomic():
            for move in models.Move.objects.all():
                if move.id not in move_ids:
                    x = models.MoveList2Move(move_list=move_list,
                                             move=move,
                                             order=0)
                    x.save()
            move_list.save()
