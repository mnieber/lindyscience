from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from ._utils import drop_db, create_db


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('--force', action='store_true')

    def handle(self, force, *args, **options):
        db = settings.DATABASES['default']['NAME']

        if not settings.ALLOW_DESTRUCTIVE and not force:
            raise CommandError("Destructive operation not allowed")

        print(settings.DATABASES['default']['PASSWORD'])
        drop_db(db)
        create_db(db)
