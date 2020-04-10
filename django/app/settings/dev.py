from __future__ import absolute_import, unicode_literals
from .base import *  # noqa

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

FORCE_SERVE_STATIC = True

ALLOWED_HOSTS = ['*']

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'yl(y9&y&3g)0a&9i7@ehmdg)f_)ny207lb*r12=9^w52z=d-x)'

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

EMAIL_MAARTEN = 'mnieber@gmail.com'
EMAIL_REPLY_ADDRESS = EMAIL_MAARTEN

try:
    from .local import *  # noqa
except ImportError:
    pass

DATABASES['default']['HOST'] = 'db'

CACHES['default'] = {
    'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
}
