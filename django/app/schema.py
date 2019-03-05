import graphene
import moves.schema
import votes.schema
import accounts.schema
# Schema app


class Query(accounts.schema.Query, moves.schema.Query, votes.schema.Query,
            graphene.ObjectType):
    pass


class Mutations(graphene.ObjectType):
    save_move_list = moves.schema.SaveMoveList.Field()
    save_move = moves.schema.SaveMove.Field()
    save_tip = moves.schema.SaveTip.Field()
    save_video_link = moves.schema.SaveVideoLink.Field()
    save_video_link = moves.schema.SaveVideoLink.Field()
    save_move_private_data = moves.schema.SaveMovePrivateData.Field()
    save_move_ordering = moves.schema.SaveMoveOrdering.Field()
    cast_vote = votes.schema.CastVote.Field()
    update_profile = accounts.schema.UpdateProfile.Field()


schema = graphene.Schema(query=Query, mutation=Mutations)
