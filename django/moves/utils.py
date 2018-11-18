from django.core.exceptions import ValidationError
from urllib.parse import urlparse, parse_qs


def validate_video_url(url):
    parsed_url = urlparse(url)
    if parsed_url.netloc in ('youtube', 'youtu.be'):
        query = parse_qs(parsed_url.query)
        if 't' not in query:
            raise ValidationError({
                'url':
                'Youtube urls should have a t=<timestamp> parameter'
            })
