import graphene
from graphene_django.types import DjangoObjectType
import graphene_django_optimizer as gql_optimizer
from django.db.models import Q

from app.utils import assert_authorized
from moves import models


class MoveType(DjangoObjectType):
    class Meta:
        model = models.Move

    tags = graphene.List(of_type=graphene.String)

    def resolve_tags(self, info, **kwargs):
        return self.tags.get_tag_list()


class SaveMove(graphene.Mutation):
    class Arguments:
        pk = graphene.String()
        name = graphene.String()
        slug = graphene.String()
        description = graphene.String()
        link = graphene.String()
        start_time_ms = graphene.Int()
        end_time_ms = graphene.Int()
        source_move_list_id = graphene.String()
        tags = graphene.List(of_type=graphene.String)

    ok = graphene.Boolean()
    move = graphene.Field(MoveType)

    def mutate(self, info, pk, **inputs):
        assert_authorized(models.Move, pk, info.context.user.id)

        inputs['tags'] = ",".join(inputs['tags'])
        inputs['owner_id'] = info.context.user.id

        move, created = models.Move.objects.update_or_create(inputs, pk=pk)
        return SaveMove(move=move, ok=True)


class MoveQuery(object):
    find_moves = graphene.List(
        MoveType,
        owner_username=graphene.String(),
        keywords=graphene.List(graphene.String),
        tags=graphene.List(graphene.String),
    )

    def resolve_find_moves(self, info, keywords, tags, owner_username="",
                           **kwargs):
        result = models.Move.objects.select_related('source_move_list',
                                                    'source_move_list__owner')
        result = result.filter(
            Q(source_move_list__is_private=False) | Q(owner=info.context.user))
        if owner_username:
            result = result.filter(
                source_move_list__owner__username=owner_username)
        for keyword in keywords:
            result = result.filter(name__icontains=keyword)
        for tag in tags:
            result = result.filter(tags=tag)

        return gql_optimizer.query(result, info)


class MoveMutations:
    save_move = SaveMove.Field()
