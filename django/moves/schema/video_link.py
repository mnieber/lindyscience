import graphene
from graphene_django.types import DjangoObjectType

from app.utils import assert_authorized
from moves import models


class VideoLinkType(DjangoObjectType):
    class Meta:
        model = models.VideoLink


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
        videolink, created = models.VideoLink.objects.update_or_create(inputs,
                                                                       pk=pk)
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


class VideoLinkQuery:
    pass


class VideoLinkMutations:
    save_video_link = SaveVideoLink.Field()
    delete_video_link = DeleteVideoLink.Field()
