from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from moves import models


class Command(BaseCommand):
    def add_arguments(self, parser):
        pass

    def _create_trash_movelist(self, user):
        return models.MoveList(
            name='Trash',
            slug='trash',
            is_trash=True,
            is_private=True,
            description=
            'This list contains moves which were moved to the trash',
            owner=user,
        )

    def handle(self, *args, **options):
        for user in get_user_model().objects.all():
            if not models.MoveList.objects.filter(
                    owner_id=user.id, is_trash=True).exists():
                trash_list = self._create_trash_movelist(user)
                trash_list.save()
