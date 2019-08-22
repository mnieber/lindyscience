import graphene
from graphene_django.types import DjangoObjectType

from app.utils import assert_authorized
from moves import models


class MovePrivateDataType(DjangoObjectType):
    class Meta:
        model = models.MovePrivateData

    tags = graphene.List(of_type=graphene.String)

    def resolve_tags(self, info, **kwargs):
        return self.tags.get_tag_list()


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


class MovePrivateDataQuery(object):
    move_private_datas = graphene.List(MovePrivateDataType)

    def resolve_move_private_datas(self, info, **kwargs):
        return models.MovePrivateData.objects.filter(
            owner_id=info.context.user.id)


class MovePrivateDataMutations:
    save_move_private_data = SaveMovePrivateData.Field()
