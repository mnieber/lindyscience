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


class Query(graphene.ObjectType):
    user_profile = graphene.Field(ProfileType)

    def resolve_user_profile(self, info):
        result = models.Profile.objects.filter(
            owner_id=info.context.user.id).first()
        return result
