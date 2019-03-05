import git
import os
import sys
from plumbum.cmd import dropdb, createdb
from django.conf import settings
from six.moves import input as raw_input


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


def query_yes_no(question, default="yes"):
    """Ask a yes/no question via raw_input() and return their answer.

    "question" is a string that is presented to the user.
    "default" is the presumed answer if the user just hits <Enter>.
        It must be "yes" (the default), "no" or None (meaning
        an answer is required of the user).

    The "answer" return value is True for "yes" or False for "no".
    """
    valid = {"yes": True, "y": True, "ye": True, "no": False, "n": False}
    if default is None:
        prompt = " [y/n] "
    elif default == "yes":
        prompt = " [Y/n] "
    elif default == "no":
        prompt = " [y/N] "
    else:
        raise ValueError("invalid default answer: '%s'" % default)

    while True:
        sys.stdout.write(question + prompt)
        choice = raw_input().lower()
        if default is not None and choice == '':
            return valid[default]
        elif choice in valid:
            return valid[choice]
        else:
            sys.stdout.write("Please respond with 'yes' or 'no' "
                             "(or 'y' or 'n').\n")
