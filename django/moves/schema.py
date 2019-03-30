from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Q
import graphene
from graphene_django.types import DjangoObjectType
import graphene_django_optimizer as gql_optimizer
from moves import models
from app.utils import assert_authorized, try_n_times

# Moves schema


class UserModelType(DjangoObjectType):
    class Meta:
        model = get_user_model()


class UserTagsType(graphene.ObjectType):
    move_tags = graphene.List(of_type=graphene.String)
    move_list_tags = graphene.List(of_type=graphene.String)


class VideoLinkType(DjangoObjectType):
    class Meta:
        model = models.VideoLink


class TipType(DjangoObjectType):
    class Meta:
        model = models.Tip


class MovePrivateDataType(DjangoObjectType):
    class Meta:
        model = models.MovePrivateData

    tags = graphene.List(of_type=graphene.String)

    def resolve_tags(self, info, **kwargs):
        return self.tags.get_tag_list()


class MoveListType(DjangoObjectType):
    class Meta:
        model = models.MoveList

    tags = graphene.List(of_type=graphene.String)

    def resolve_tags(self, info, **kwargs):
        return self.tags.get_tag_list()

    def resolve_moves(self, info, **kwargs):
        return [x.move for x in self.movelist2move_set.all()]


class MoveType(DjangoObjectType):
    class Meta:
        model = models.Move

    tags = graphene.List(of_type=graphene.String)

    def resolve_tags(self, info, **kwargs):
        return self.tags.get_tag_list()


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
        inputs['owner_id'] = info.context.user.id

        moveList, created = models.MoveList.objects.update_or_create(
            inputs, pk=pk)
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
                        defaults={'order': move_ids.index(str(move_id))})
                to_be_removed = models.MoveList2Move.objects \
                    .filter(move_list_id=move_list_id) \
                    .exclude(move_id__in=move_ids)
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
                        pk=move_id, owner=info.context.user).update(
                            source_move_list_id=source_move_list_id)
            return UpdateSourceMoveListId(ok=True)

        assert_authorized(models.MoveList, source_move_list_id,
                          info.context.user.id)
        return try_n_times(try_it, n=5)


class SaveMove(graphene.Mutation):
    class Arguments:
        pk = graphene.String()
        name = graphene.String()
        slug = graphene.String()
        description = graphene.String()
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


class SaveTip(graphene.Mutation):
    class Arguments:
        pk = graphene.String()
        move_id = graphene.String()
        text = graphene.String()

    ok = graphene.Boolean()
    tip = graphene.Field(TipType)

    def mutate(self, info, pk, **inputs):
        assert_authorized(models.Tip, pk, info.context.user.id)
        inputs['owner_id'] = info.context.user.id
        tip, created = models.Tip.objects.update_or_create(inputs, pk=pk)
        return SaveTip(tip=tip, ok=True)


class DeleteTip(graphene.Mutation):
    class Arguments:
        pk = graphene.String()

    ok = graphene.Boolean()

    def mutate(self, info, pk, **inputs):
        user_id = info.context.user.id
        tip = models.Tip.objects.get(pk=pk)
        if tip.owner_id != user_id and tip.move.owner_id != user_id:
            raise Exception("Not authorized to update object with id %s" % pk)

        tip.delete()
        return DeleteTip(ok=True)


class SaveVideoLink(graphene.Mutation):
    class Arguments:
        pk = graphene.String()
        move_id = graphene.String()
        url = graphene.String()
        title = graphene.String()

    ok = graphene.Boolean()
    videolink = graphene.Field(VideoLinkType)

    def mutate(self, info, pk, **inputs):
        assert_authorized(models.VideoLink, pk, info.context.user.id)
        inputs['owner_id'] = info.context.user.id
        videolink, created = models.VideoLink.objects.update_or_create(
            inputs, pk=pk)
        return SaveVideoLink(videolink=videolink, ok=True)


class DeleteVideoLink(graphene.Mutation):
    class Arguments:
        pk = graphene.String()

    ok = graphene.Boolean()

    def mutate(self, info, pk, **inputs):
        user_id = info.context.user.id
        videolink = models.VideoLink.objects.get(pk=pk)
        if videolink.owner_id != user_id and videolink.move.owner_id != user_id:
            raise Exception("Not authorized to update object with id %s" % pk)

        videolink.delete()
        return DeleteVideoLink(ok=True)


class SaveMovePrivateData(graphene.Mutation):
    class Arguments:
        pk = graphene.String()
        move_id = graphene.String()
        notes = graphene.String()
        tags = graphene.List(of_type=graphene.String)

    ok = graphene.Boolean()
    movePrivateData = graphene.Field(MovePrivateDataType)

    def mutate(self, info, pk, **inputs):
        assert_authorized(models.MovePrivateData, pk, info.context.user.id)
        inputs['owner_id'] = info.context.user.id
        movePrivateData, created = models.MovePrivateData.objects.update_or_create(
            inputs, pk=pk)
        return SaveMovePrivateData(movePrivateData=movePrivateData, ok=True)


class Query(object):
    find_move_lists = graphene.List(
        MoveListType, owner_username=graphene.String())
    find_moves = graphene.List(
        MoveType,
        owner_username=graphene.String(),
        keywords=graphene.List(graphene.String),
        tags=graphene.List(graphene.String),
    )
    move_list = graphene.Field(MoveListType, id=graphene.String())
    move_private_datas = graphene.List(MovePrivateDataType)
    user_tags = graphene.Field(UserTagsType)

    def resolve_find_move_lists(self, info, owner_username, **kwargs):
        return models.MoveList.objects.filter(
            Q(owner__username=owner_username) & (Q(is_private=False)
                                                 | Q(owner=info.context.user)))

    def resolve_find_moves(self, info, owner_username, keywords, tags,
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

    def resolve_move_list(self, info, id):
        return models.MoveList.objects.get(
            Q(pk=id) & (Q(is_private=False)
                        | Q(owner=info.context.user)))

    def resolve_move_private_datas(self, info, **kwargs):
        return models.MovePrivateData.objects.filter(
            owner_id=info.context.user.id)

    def resolve_user_tags(self, info, **kwargs):
        result = UserTagsType()
        return result
