from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from moves import models
from moves.utils import create_draft_js_content


class Command(BaseCommand):
    def add_arguments(self, parser):
        pass

    def _create_trash_movelist(self, user):
        return models.MoveList(
            name='Trash',
            slug='trash',
            role='trash',
            is_private=True,
            description=create_draft_js_content('Trashed moves'),
            owner=user,
        )

    def handle(self, *args, **options):
        for user in get_user_model().objects.all():
            if not models.MoveList.objects.filter(
                    owner_id=user.id, role='trash').exists():
                trash_list = self._create_trash_movelist(user)
                trash_list.save()
