from django.apps import AppConfig


class MovesConfig(AppConfig):
    name = 'moves'

    def ready(self):
        import moves.signals  # noqa
