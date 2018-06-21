# from django.conf import settings
from django.core.management.base import BaseCommand # , CommandError
from django.core.management import call_command
from django.db import transaction
# import glob
# import os


class Command(BaseCommand):
    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        with transaction.atomic():
            call_command('anonymize_db')
            call_command('dumpdata', format='yaml')
            transaction.rollback()
