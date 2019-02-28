import graphene
from graphene_django.types import DjangoObjectType
from accounts import models

# Schema app


class ProfileType(DjangoObjectType):
    class Meta:
        model = models.Profile

    move_list_ids = graphene.List(of_type=graphene.ID)

    def resolve_move_list_ids(self, info, **kwargs):
        return [x.id for x in self.move_lists.all()]


class UpdateProfile(graphene.Mutation):
    class Arguments:
        recent_move_url = graphene.String()

    ok = graphene.Boolean()

    def mutate(self, info, recent_move_url):
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
