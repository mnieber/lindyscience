from __future__ import absolute_import, unicode_literals

from .base import *  # noqa

ALLOWED_HOSTS = ["*"]

DEBUG = True

INSTALLED_APPS += ["anonymizer"]

SECRET_KEY = "9%wgjg3!rxkz%-pesd!dc=b3bkh7^m498a!$13&gpw4$&-64cm"

DATABASES["default"]["NAME"] = "wagtail_staging"

# if we are in a docker, use the pg instane and LocMemCache
if os.environ.get("PG_PORT_5432_TCP_ADDR"):
    DATABASES["default"]["HOST"] = os.environ["PG_PORT_5432_TCP_ADDR"]
    DATABASES["default"]["PORT"] = os.environ["PG_PORT_5432_TCP_PORT"]

    CACHES["default"] = {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
    }

try:
    from .local import *  # noqa
except ImportError:
    pass
