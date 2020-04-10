import sys
from django.conf import settings
from django.core.management.base import BaseCommand
from ._utils import drop_db, create_db, query_yes_no


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('--force', action='store_true')

    def handle(self, force, *args, **options):
        db = settings.DATABASES['default']['NAME']

        if not force and not query_yes_no(
                "About to drop the current database: %s. Continue?" % db):
            sys.exit(1)

        print(settings.DATABASES['default']['PASSWORD'])
        drop_db(db)
        create_db(db)
