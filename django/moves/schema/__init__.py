from django.contrib.auth import get_user_model
import graphene
from graphene_django.types import DjangoObjectType

from .tip import TipQuery, TipMutations
from .move_private_data import MovePrivateDataQuery, MovePrivateDataMutations
from .move_list import MoveListQuery, MoveListMutations
from .move import MoveQuery, MoveMutations


class UserModelType(DjangoObjectType):
    class Meta:
        model = get_user_model()


class UserTagsType(graphene.ObjectType):
    move_tags = graphene.List(of_type=graphene.String)
    move_list_tags = graphene.List(of_type=graphene.String)


class Query(MovePrivateDataQuery, MoveListQuery, MoveQuery, TipQuery,
            graphene.ObjectType):
    user_tags = graphene.Field(UserTagsType)

    def resolve_user_tags(self, info, **kwargs):
        result = UserTagsType()
        return result


class Mutations(MovePrivateDataMutations, MoveListMutations, MoveMutations,
                TipMutations):
    pass
