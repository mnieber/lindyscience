from django.contrib.auth import get_user_model
from django.db import transaction
import graphene
import time
from graphene_django.types import DjangoObjectType
from moves import models
from app.utils import assert_authorized

# Moves schema


class UserModelType(DjangoObjectType):
    class Meta:
        model = get_user_model()


class VideoLinkType(DjangoObjectType):
    class Meta:
        model = models.VideoLink


class TipType(DjangoObjectType):
    class Meta:
        model = models.Tip


class MovePrivateDataType(DjangoObjectType):
    class Meta:
        model = models.MovePrivateData


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

    difficulty = graphene.String()
    tags = graphene.List(of_type=graphene.String)

    def resolve_tags(self, info, **kwargs):
        return self.tags.get_tag_list()

    def resolve_difficulty(self, info, **kwargs):
        return self.difficulty.value

    def resolve_private_datas(self, info, **kwargs):
        return self.private_datas.filter(owner_id=info.context.user.id)


class CreateMoveList(graphene.Mutation):
    class Arguments:
        create = graphene.Boolean()
        name = graphene.String()
        slug = graphene.String()

    ok = graphene.Boolean()
    move_list = graphene.Field(MoveListType)

    def mutate(self, info, create, **inputs):
        move_list = models.MoveList(**inputs)
        move_list.save()
        return CreateMoveList(move_list=move_list, ok=True)


class SaveMoveListOrdering(graphene.Mutation):
    class Arguments:
        move_list_id = graphene.String()
        move_ids = graphene.List(of_type=graphene.String)

    ok = graphene.Boolean()

    def mutate(self, info, move_list_id, move_ids, **inputs):
        assert_authorized(False, models.MoveList, move_list_id,
                          info.context.user.id)

        def try_it():
            with transaction.atomic():
                for move_id in move_ids:
                    models.MoveList2Move.objects.get_or_create(
                        move_id=move_id,
                        move_list_id=move_list_id,
                        defaults={'order': move_ids.index(str(move_id))})

        max_tries = 5
        for tryIdx in range(max_tries):
            try:
                try_it()
                return SaveMoveListOrdering(ok=True)
            except Exception as e:
                if tryIdx == max_tries - 1:
                    raise e
                else:
                    time.sleep(1)


class SaveMove(graphene.Mutation):
    class Arguments:
        create = graphene.Boolean()
        pk = graphene.String()
        name = graphene.String()
        slug = graphene.String()
        description = graphene.String()
        difficulty = graphene.String()
        tags = graphene.List(of_type=graphene.String)

    ok = graphene.Boolean()
    move = graphene.Field(MoveType)

    def mutate(self, info, create, pk, **inputs):
        assert_authorized(create, models.Move, pk, info.context.user.id)

        inputs['tags'] = ",".join(inputs['tags'])
        inputs['owner_id'] = info.context.user.id

        move, created = models.Move.objects.update_or_create(inputs, pk=pk)
        return SaveMove(move=move, ok=True)


class SaveTip(graphene.Mutation):
    class Arguments:
        create = graphene.Boolean()
        pk = graphene.String()
        move_id = graphene.String()
        text = graphene.String()

    ok = graphene.Boolean()
    tip = graphene.Field(TipType)

    def mutate(self, info, create, pk, **inputs):
        assert_authorized(create, models.Tip, pk, info.context.user.id)
        inputs['owner_id'] = info.context.user.id
        tip, created = models.Tip.objects.update_or_create(inputs, pk=pk)
        return SaveTip(tip=tip, ok=True)


class SaveVideoLink(graphene.Mutation):
    class Arguments:
        create = graphene.Boolean()
        pk = graphene.String()
        move_id = graphene.String()
        url = graphene.String()
        title = graphene.String()

    ok = graphene.Boolean()
    videolink = graphene.Field(VideoLinkType)

    def mutate(self, info, create, pk, **inputs):
        assert_authorized(create, models.VideoLink, pk, info.context.user.id)
        inputs['owner_id'] = info.context.user.id
        videolink, created = models.VideoLink.objects.update_or_create(
            inputs, pk=pk)
        return SaveVideoLink(videolink=videolink, ok=True)


class SaveMovePrivateData(graphene.Mutation):
    class Arguments:
        create = graphene.Boolean()
        pk = graphene.String()
        move_id = graphene.String()
        notes = graphene.String()

    ok = graphene.Boolean()
    movePrivateData = graphene.Field(MovePrivateDataType)

    def mutate(self, info, create, pk, **inputs):
        assert_authorized(create, models.MovePrivateData, pk,
                          info.context.user.id)
        inputs['owner_id'] = info.context.user.id
        movePrivateData, created = models.MovePrivateData.objects.update_or_create(
            inputs, pk=pk)
        return SaveMovePrivateData(movePrivateData=movePrivateData, ok=True)


class Query(object):
    all_move_lists = graphene.List(MoveListType)
    move_list = graphene.Field(MoveListType, id=graphene.String())

    def resolve_all_move_lists(self, info, **kwargs):
        return models.MoveList.objects.all()

    def resolve_move_list(self, info, id):
        return models.MoveList.objects.get(pk=id)
