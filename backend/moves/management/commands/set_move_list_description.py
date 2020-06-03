from django.core.management.base import BaseCommand
from django.db import transaction

from moves import models
from moves.utils import create_draft_js_content


class Command(BaseCommand):
    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        with transaction.atomic():
            for move_list in models.MoveList.objects.all():
                move_list.description = create_draft_js_content(move_list.name)
                move_list.save()
