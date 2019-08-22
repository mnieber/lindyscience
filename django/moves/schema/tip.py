import graphene
from graphene_django.types import DjangoObjectType

from app.utils import assert_authorized
from moves import models


class TipType(DjangoObjectType):
    class Meta:
        model = models.Tip


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


class TipQuery:
    pass


class TipMutations:
    save_tip = SaveTip.Field()
    delete_tip = DeleteTip.Field()
