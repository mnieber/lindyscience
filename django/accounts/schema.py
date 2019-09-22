import graphene
from django.db import transaction
from graphene_django.types import DjangoObjectType
from accounts import models
from app.utils import try_n_times

# Schema app


class ProfileType(DjangoObjectType):
    class Meta:
        model = models.Profile

    move_list_ids = graphene.List(of_type=graphene.ID)

    def resolve_move_list_ids(self, info, **kwargs):
        return [x.id for x in self.move_lists.all()]


class SaveMoveListOrdering(graphene.Mutation):
    class Arguments:
        move_list_ids = graphene.List(of_type=graphene.String)

    ok = graphene.Boolean()

    def mutate(self, info, move_list_ids, **inputs):
        profile = models.Profile.objects.get(owner_id=info.context.user.id)

        def try_it():
            with transaction.atomic():
                for move_list_id in move_list_ids:
                    models.ProfileToMoveList.objects.update_or_create(
                        move_list_id=move_list_id,
                        profile_id=profile.id,
                        defaults={'order': move_list_ids.index(str(move_list_id))})
                to_be_removed = models.ProfileToMoveList.objects \
                    .filter(profile_id=profile.id) \
                    .exclude(move_list_id__in=move_list_ids)
                to_be_removed.delete()
            return SaveMoveListOrdering(ok=True)

        return try_n_times(try_it, n=5)


class UpdateProfile(graphene.Mutation):
    class Arguments:
        recent_move_url = graphene.String()

    ok = graphene.Boolean()

    def mutate(self, info, recent_move_url):
        if info.context.user.is_anonymous:
            return UpdateProfile(ok=False)

        profile = models.Profile.objects.get(owner_id=info.context.user.id)
        profile.recent_move_url = recent_move_url
        try:
            profile.save()
        except:
            return UpdateProfile(ok=False)

        return UpdateProfile(ok=True)


class Query(graphene.ObjectType):
    user_profile = graphene.Field(ProfileType)

    def resolve_user_profile(self, info):
        result = models.Profile.objects.filter(
            owner_id=info.context.user.id).first()
        return result
