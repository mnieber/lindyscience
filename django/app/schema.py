import graphene
from graphene_django.types import DjangoObjectType
import moves.schema
import votes.schema
from app import models

# Schema app


class ProfileType(DjangoObjectType):
    class Meta:
        model = models.Profile

    move_list_ids = graphene.List(of_type=graphene.ID)

    def resolve_move_list_ids(self, info, **kwargs):
        return [x.id for x in self.move_lists.all()]


class Query(moves.schema.Query, votes.schema.Query, graphene.ObjectType):
    user_profile = graphene.Field(ProfileType)

    def resolve_user_profile(self, info):
        result = models.Profile.objects.filter(
            owner_id=info.context.user.id).first()
        return result


class Mutations(graphene.ObjectType):
    create_move_list = moves.schema.CreateMoveList.Field()
    save_move = moves.schema.SaveMove.Field()
    save_tip = moves.schema.SaveTip.Field()
    save_video_link = moves.schema.SaveVideoLink.Field()
    save_video_link = moves.schema.SaveVideoLink.Field()
    save_move_private_data = moves.schema.SaveMovePrivateData.Field()
    save_move_list_ordering = moves.schema.SaveMoveListOrdering.Field()
    cast_vote = votes.schema.CastVote.Field()


schema = graphene.Schema(query=Query, mutation=Mutations)
