import graphene
from django.db import transaction
from django.db.models import Q
from graphene_django.types import DjangoObjectType

from accounts.models import Profile, ProfileToMoveList
from app.utils import assert_authorized, try_n_times
from moves import models


class MoveListType(DjangoObjectType):
    class Meta:
        model = models.MoveList

    tags = graphene.List(of_type=graphene.String)

    def resolve_tags(self, info, **kwargs):
        return self.tags.get_tag_list()

    def resolve_moves(self, info, **kwargs):
        return [x.move for x in self.movelist2move_set.all()]


class SaveMoveList(graphene.Mutation):
    class Arguments:
        pk = graphene.String()
        name = graphene.String()
        description = graphene.String()
        is_private = graphene.Boolean()
        tags = graphene.List(of_type=graphene.String)
        slug = graphene.String()

    ok = graphene.Boolean()
    move_list = graphene.Field(MoveListType)

    def mutate(self, info, pk, **inputs):
        assert_authorized(models.MoveList, pk, info.context.user.id)
        inputs["owner_id"] = info.context.user.id

        if models.MoveList.objects.filter(
            Q(owner_id=inputs["owner_id"]) & Q(slug=inputs["slug"]) & ~Q(pk=pk)
        ).exists():
            raise Exception("Move List with this slug already exists")
        moveList, created = models.MoveList.objects.update_or_create(inputs, pk=pk)
        return SaveMoveList(move_list=moveList, ok=True)


class SaveMoveOrdering(graphene.Mutation):
    class Arguments:
        move_list_id = graphene.String()
        move_ids = graphene.List(of_type=graphene.String)

    ok = graphene.Boolean()

    def mutate(self, info, move_list_id, move_ids, **inputs):
        def try_it():
            with transaction.atomic():
                for move_id in move_ids:
                    models.MoveList2Move.objects.update_or_create(
                        move_id=move_id,
                        move_list_id=move_list_id,
                        defaults={"order": move_ids.index(str(move_id))},
                    )
                to_be_removed = models.MoveList2Move.objects.filter(
                    move_list_id=move_list_id
                ).exclude(move_id__in=move_ids)
                to_be_removed.delete()
            return SaveMoveOrdering(ok=True)

        assert_authorized(models.MoveList, move_list_id, info.context.user.id)
        return try_n_times(try_it, n=5)


class UpdateSourceMoveListId(graphene.Mutation):
    class Arguments:
        move_ids = graphene.List(graphene.String)
        source_move_list_id = graphene.String()

    ok = graphene.Boolean()

    def mutate(self, info, move_ids, source_move_list_id, **inputs):
        def try_it():
            with transaction.atomic():
                for move_id in move_ids:
                    models.Move.objects.filter(
                        pk=move_id, owner=info.context.user
                    ).update(source_move_list_id=source_move_list_id)
            return UpdateSourceMoveListId(ok=True)

        assert_authorized(models.MoveList, source_move_list_id, info.context.user.id)
        return try_n_times(try_it, n=5)


class MoveListQuery(object):
    find_move_lists = graphene.List(
        MoveListType,
        owner_username=graphene.String(),
        followed_by_username=graphene.String(),
    )
    move_list = graphene.Field(
        MoveListType, owner_username=graphene.String(), slug=graphene.String()
    )

    move_list_tags = graphene.List(of_type=graphene.String)

    def resolve_find_move_lists(
        self, info, owner_username="", followed_by_username="", **kwargs
    ):
        result = models.MoveList.objects.filter(
            Q(is_private=False)
            | (
                Q(owner=info.context.user)
                if not info.context.user.is_anonymous
                else Q()
            )
        )

        if owner_username:
            result = result.filter(Q(owner__username=owner_username))

        if followed_by_username:
            profiles = Profile.objects.filter(owner__username=followed_by_username)
            if profiles.exists():
                hits = ProfileToMoveList.objects.filter(profile=profiles[0])
                result = result.filter(id__in=[x.move_list_id for x in hits])

        return result

    def resolve_move_list(self, info, owner_username, slug):
        head = Q(owner__username=owner_username) & Q(slug=slug)
        tail = (
            Q(is_private=False)
            if info.context.user.is_anonymous
            else Q(is_private=False) | Q(owner=info.context.user)
        )
        return models.MoveList.objects.get(head & tail)

    def resolve_move_list_tags(self, info, **kwargs):
        result = models.MoveList.tags.tag_model.objects.order_by("-count")[:200]
        return [x.name for x in result]


class MoveListMutations:
    save_move_list = SaveMoveList.Field()
    update_source_move_list_id = UpdateSourceMoveListId.Field()
    save_move_ordering = SaveMoveOrdering.Field()
