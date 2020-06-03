import graphene
from django.contrib.contenttypes.models import ContentType
from django.db.models import Sum
from graphene_django.types import DjangoObjectType

from votes import models


class VoteType(DjangoObjectType):
    class Meta:
        model = models.Vote

    value = graphene.Field(graphene.Int)


class CastVote(graphene.Mutation):
    class Arguments:
        app_label = graphene.String()
        model = graphene.String()
        object_id = graphene.String()
        value = graphene.Int()

    ok = graphene.Boolean()
    vote = graphene.Field(VoteType)

    def mutate(self, info, app_label, model, **inputs):
        object_id = inputs["object_id"]
        content_type = ContentType.objects.get_by_natural_key(
            app_label.lower(), model.lower()
        )

        inputs["owner"] = info.context.user
        inputs["content_type"] = content_type

        vote = models.Vote.objects.filter(
            owner=inputs["owner"].id,
            content_type=inputs["content_type"].id,
            object_id=object_id,
        ).first() or models.Vote(**inputs)

        vote.value = inputs["value"]
        vote.save()

        vote_count = models.Vote.objects.filter(object_id=object_id).aggregate(
            Sum("value")
        )
        content_type.model_class().objects.filter(pk=object_id).update(
            vote_count=vote_count["value__sum"]
        )

        return CastVote(vote=vote, ok=True)


class Query(object):
    user_votes = graphene.List(VoteType)

    def resolve_user_votes(self, info, **kwargs):
        return models.Vote.objects.filter(owner_id=info.context.user.id)
