import git
import os
from plumbum.cmd import dropdb, createdb
from django.conf import settings


def git_repo():
    path = os.path.dirname(__file__)
    while path != '/':
        if os.path.exists(os.path.join(path, '.git')):
            return git.Repo(path)
        path = os.path.dirname(path)
    return None


def drop_db(db):
    try:
        dropdb(
            "-U", settings.DATABASES['default']['USER'],
            "-h", settings.DATABASES['default']['HOST'],
            "-p", settings.DATABASES['default']['PORT'],
            db
        )
    except:
        pass


def create_db(db):
    createdb(
        "-U", settings.DATABASES['default']['USER'],
        "-h", settings.DATABASES['default']['HOST'],
        "-p", settings.DATABASES['default']['PORT'],
        db
    )
