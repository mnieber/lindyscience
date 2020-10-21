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
        inputs["owner_id"] = info.context.user.id
        (tip,) = models.Tip.objects.update_or_create(inputs, pk=pk)
        return SaveTip(tip=tip, ok=True)


class DeleteTips(graphene.Mutation):
    class Arguments:
        pks = graphene.List(of_type=graphene.ID)

    ok = graphene.Boolean()

    def mutate(self, info, pks, **inputs):
        user_id = info.context.user.id
        for pk in pks:
            tip = models.Tip.objects.get(pk=pk)
            if tip.owner_id != user_id and tip.move.owner_id != user_id:
                raise Exception("Not authorized to update object with id %s" % pk)
            tip.delete()

        return DeleteTips(ok=True)


class TipQuery:
    pass


class TipMutations:
    save_tip = SaveTip.Field()
    delete_tips = DeleteTips.Field()
