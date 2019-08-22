from django.contrib.auth import get_user_model
import graphene
from graphene_django.types import DjangoObjectType
from .video_link import VideoLinkType, SaveVideoLink, DeleteVideoLink  # noqa
from .tip import TipType, SaveTip, DeleteTip  # noqa
from .move_private_data import MovePrivateDataType, SaveMovePrivateData  # noqa
from .move_private_data import Query as MovePrivateDataQuery  # noqa
from .move_list import MoveListType, SaveMoveList, SaveMoveOrdering, UpdateSourceMoveListId  # noqa
from .move_list import Query as MoveListQuery  # noqa
from .move import MoveType, SaveMove  # noqa
from .move import Query as MoveQuery  # noqa
# Moves schema


class UserModelType(DjangoObjectType):
    class Meta:
        model = get_user_model()


class UserTagsType(graphene.ObjectType):
    move_tags = graphene.List(of_type=graphene.String)
    move_list_tags = graphene.List(of_type=graphene.String)


class Query(MovePrivateDataQuery, MoveListQuery, MoveQuery, graphene.ObjectType):
    user_tags = graphene.Field(UserTagsType)

    def resolve_user_tags(self, info, **kwargs):
        result = UserTagsType()
        return result
