import graphene
from django.contrib.auth import get_user_model
from graphene_django.types import DjangoObjectType

from .move import MoveMutations, MoveQuery
from .move_list import MoveListMutations, MoveListQuery
from .move_private_data import MovePrivateDataMutations, MovePrivateDataQuery
from .tip import TipMutations, TipQuery


class UserModelType(DjangoObjectType):
    class Meta:
        model = get_user_model()


class Query(
    MovePrivateDataQuery, MoveListQuery, MoveQuery, TipQuery, graphene.ObjectType
):
    pass


class Mutations(
    MovePrivateDataMutations, MoveListMutations, MoveMutations, TipMutations
):
    pass
