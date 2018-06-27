from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from plumbum.cmd import psql
import glob
import shutil
import os
import re
from ._utils import git_repo, drop_db, create_db


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('--list', action='store_true', dest='list_dumps')
        parser.add_argument('--force', action='store_true')
        parser.add_argument('--filename', dest='dump_filename')

    def _import_dump_file(self, db, dump_filename):
        import_dump = psql["-U", settings.DATABASES['default']['USER'], "-h",
                           settings.DATABASES['default']['HOST'], "-p",
                           settings.DATABASES['default']['PORT'],
                           db] < dump_filename
        import_dump()
        return os.path.splitext(dump_filename)[0].split('__')[-1]

    def _is_migration(self, migration_filename):
        basename = os.path.basename(migration_filename)
        regex = r"^\d{4}_.+.py"
        return list(re.finditer(regex, basename))

    def _reset_migrations(self, sha):
        module_names = set()
        repo = git_repo()
        if not repo:
            return

        if repo.is_dirty():
            raise CommandError("Repository is dirty")

        # noqa
        current_branch = repo.active_branch

        temp_branch = repo.create_head('restore_db_temp_branch', sha)
        temp_branch.checkout()

        # rename migrations to backup migration files
        for app_dir in os.listdir(settings.BASE_DIR):
            migrations_dir = os.path.join(settings.BASE_DIR, app_dir,
                                          "migrations")
            for migration_filename in glob.glob(
                    os.path.join(migrations_dir, "*.py")):
                basename = os.path.basename(migration_filename)
                if self._is_migration(basename):
                    module_names.add(os.path.basename(app_dir))
                    shutil.copy(
                        migration_filename,
                        os.path.join(migrations_dir,
                                     "%s.%s" % (sha, basename)))

        current_branch.checkout()
        repo.delete_head(temp_branch, force=True)

        # replace migrations by backup migration files
        for app_dir in os.listdir(settings.BASE_DIR):
            migrations_dir = os.path.join(settings.BASE_DIR, app_dir,
                                          "migrations")
            for migration_filename in glob.glob(
                    os.path.join(migrations_dir, "*.py")):
                basename = os.path.basename(migration_filename)
                if self._is_migration(basename):
                    os.unlink(migration_filename)

            for migration_filename in glob.glob(
                    os.path.join(migrations_dir, "%s.*.py" % sha)):
                basename = os.path.basename(migration_filename)
                os.rename(
                    migration_filename,
                    os.path.join(migrations_dir, basename[len(sha) + 1:]))

        return module_names

    def handle(self, list_dumps, dump_filename, force, *args, **options):
        if list_dumps:
            for x in glob.glob(os.path.join(settings.DUMP_DB_DIR, '*')):
                print(x)
            return

        if not dump_filename:
            raise CommandError("No dump filename specified")

        db = settings.DATABASES['default']['NAME']
        print("Restoring into %s, please be careful" % db)
        print(settings.DATABASES['default']['PASSWORD'])

        if not settings.ALLOW_DESTRUCTIVE and not force:
            raise CommandError("Destructive operation not allowed")

        drop_db(db)
        create_db(db)
        sha = self._import_dump_file(db, dump_filename)
        module_names = self._reset_migrations(sha)
        call_command('makemigrations', *module_names)
        call_command('migrate')
