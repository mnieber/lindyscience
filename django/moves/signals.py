from django.dispatch import receiver
from djoser.signals import user_activated
from moves import models
from accounts.models import Profile, ProfileToMoveList


@receiver(user_activated)
def create_profile_on_activation(sender, user, request, **kwargs):
    trash = models.MoveList(
        role='trash',
        name='Trash',
        slug='trash',
        is_private=True,
        description='',
        owner=user)
    trash.save()

    drafts = models.MoveList(
        role='drafts',
        name='Drafts',
        slug='drafts',
        is_private=True,
        description='',
        owner=user)
    drafts.save()

    moves = models.MoveList(
        role='',
        name='Moves',
        slug='moves',
        is_private=False,
        description='',
        owner=user)
    moves.save()

    profile = Profile(
        owner=user,
        recent_move_url='lists/%s/%s' % (user.username, moves.name))
    profile.save()

    for (idx, move_list) in enumerate([trash, drafts, moves]):
        p2m = ProfileToMoveList(
            profile=profile, move_list=move_list, order=idx + 1)
        p2m.save()
