import accounts.schema
import graphene
import moves.schema
import votes.schema

# Schema app


class Query(
    accounts.schema.Query, moves.schema.Query, votes.schema.Query, graphene.ObjectType
):
    pass


class Mutations(moves.schema.Mutations, accounts.schema.Mutations, graphene.ObjectType):
    cast_vote = votes.schema.CastVote.Field()
    update_profile = accounts.schema.UpdateProfile.Field()
    save_move_list_ordering = accounts.schema.SaveMoveListOrdering.Field()


schema = graphene.Schema(query=Query, mutation=Mutations)
