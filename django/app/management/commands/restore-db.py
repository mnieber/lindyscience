from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from plumbum.cmd import psql
import glob
import os
import sys
from ._utils import drop_db, create_db, query_yes_no, git_repo


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('--print-pw', action='store_true')
        parser.add_argument('--list', action='store_true', dest='list_dumps')
        parser.add_argument('--force', action='store_true')
        parser.add_argument('--filename', dest='dump_filename')

    def _import_dump_file(self, db, dump_filename):
        import_dump = psql["-U", settings.DATABASES['default']['USER'], "-h",
                           settings.DATABASES['default']['HOST'], "-p",
                           settings.DATABASES['default']['PORT'],
                           db] < dump_filename
        import_dump()

    def _get_git_sha(self, dump_filename):
        return os.path.splitext(dump_filename)[0].split('__')[-1]

    def _check_git_sha(self, repo, git_sha):
        try:
            return repo.is_ancestor(git_sha, repo.head)
        except:
            return False

    def handle(self, print_pw, list_dumps, dump_filename, force, *args,
               **options):
        if list_dumps:
            for x in glob.glob(os.path.join(settings.DUMP_DB_DIR, '*')):
                print(x)
            return

        if not dump_filename:
            raise CommandError("No dump filename specified")

        db = settings.DATABASES['default']['NAME']
        print("Restoring into %s, please be careful" % db)

        repo = git_repo()
        if repo:
            git_sha = self._get_git_sha(dump_filename)
            if not self._check_git_sha(repo, git_sha):
                raise CommandError((
                    "The dump file was created for a revision that is not in the "
                ) + ("history of your current branch: %s." % git_sha))

        if print_pw:
            print(settings.DATABASES['default']['PASSWORD'])
        if not force and not query_yes_no(
                "About to drop the current database: %s. Continue?" % db):
            sys.exit(1)

        drop_db(db)
        create_db(db)
        self._import_dump_file(db, dump_filename)
        call_command('showmigrations')
