from __future__ import absolute_import, unicode_literals

from .base import *

ALLOWED_HOSTS = ['*']

DEBUG = False

SECRET_KEY = 't-%xw!3rebnsa4+SBUWeid9s7+6&jd5*8#t(b5ux&ix%solg@+'

try:
    from .local import *
except ImportError:
    pass
