from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from plumbum.cmd import pg_dump
import os
import time
from ._utils import git_repo


class Command(BaseCommand):
    def add_arguments(self, parser):
        pass

    def _branch_or_server_name(self):
        if not git_repo():
            return settings.DUMP_DB_SERVERNAME
        return git_repo().active_branch.name.replace('/', '_X_')

    def _git_sha(self):
        repo = git_repo()
        if not repo:
            return settings.DUMP_DB_GIT_SHA

        if repo.is_dirty():
            raise CommandError("Repository is dirty")
        return repo.head.commit.hexsha

    def handle(self, *args, **options):
        db = settings.DATABASES['default']['NAME']

        basename = '%s__%s__%s__%s.sql' % (
            self._branch_or_server_name(),
            db,
            time.time(),
            self._git_sha(),
        )

        if not os.path.exists(settings.DUMP_DB_DIR):
            os.makedirs(settings.DUMP_DB_DIR)

        print(settings.DATABASES['default']['PASSWORD'])
        dump_filename = os.path.join(settings.DUMP_DB_DIR, basename)
        pg_dump("-U", settings.DATABASES['default']['USER'], "-h",
                settings.DATABASES['default']['HOST'], "-p",
                settings.DATABASES['default']['PORT'], "-f", dump_filename, db)

        print(dump_filename)
