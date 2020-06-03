from django.core.management.base import BaseCommand

from moves.models import Move


class Command(BaseCommand):
    def handle(self, *args, **options):
        for move in Move.objects.all():
            print(move.tags.get_tag_list())
