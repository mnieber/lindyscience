import graphene
from accounts import models
from app.utils import try_n_times
from django.db import transaction
from graphene_django.types import DjangoObjectType
from graphql_auth import mutations, schema
from graphql_auth.settings import graphql_auth_settings

# Schema app


class ProfileType(DjangoObjectType):
    class Meta:
        model = models.Profile

    move_list_ids = graphene.List(of_type=graphene.ID)

    def resolve_move_list_ids(self, info, **kwargs):
        return [x.id for x in self.move_lists.all()]


class SaveMoveListOrdering(graphene.Mutation):
    class Arguments:
        move_list_ids = graphene.List(of_type=graphene.String)

    ok = graphene.Boolean()

    def mutate(self, info, move_list_ids, **inputs):
        profile = models.Profile.objects.get(owner_id=info.context.user.id)

        def try_it():
            with transaction.atomic():
                for move_list_id in move_list_ids:
                    models.ProfileToMoveList.objects.update_or_create(
                        move_list_id=move_list_id,
                        profile_id=profile.id,
                        defaults={"order": move_list_ids.index(str(move_list_id))},
                    )
                to_be_removed = models.ProfileToMoveList.objects.filter(
                    profile_id=profile.id
                ).exclude(move_list_id__in=move_list_ids)
                to_be_removed.delete()
            return SaveMoveListOrdering(ok=True)

        return try_n_times(try_it, n=5)


class UpdateProfile(graphene.Mutation):
    class Arguments:
        recent_move_url = graphene.String()

    ok = graphene.Boolean()

    def mutate(self, info, recent_move_url):
        if info.context.user.is_anonymous:
            return UpdateProfile(ok=False)

        profile = models.Profile.objects.get(owner_id=info.context.user.id)
        profile.recent_move_url = recent_move_url
        try:
            profile.save()
        except:  # noqa
            return UpdateProfile(ok=False)

        return UpdateProfile(ok=True)


class UserType(DjangoObjectType):
    class Meta:
        model = models.User
        exclude = graphql_auth_settings.USER_NODE_EXCLUDE_FIELDS

    groups = graphene.List(graphene.String)
    archived = graphene.Boolean()
    verified = graphene.Boolean()
    secondary_email = graphene.String()

    def resolve_archived(self, info):
        return self.status.archived

    def resolve_verified(self, info):
        return self.status.verified

    def resolve_secondary_email(self, info):
        return self.status.secondary_email

    def resolve_groups(self, info):
        return self.groups.all()


class MeQuery(schema.MeQuery):
    me = graphene.Field(UserType)


class ObtainJSONWebToken(mutations.ObtainJSONWebToken):
    user = graphene.Field(UserType)


class AuthMutation(graphene.ObjectType):
    register = mutations.Register.Field()
    verify_account = mutations.VerifyAccount.Field()
    resend_activation_email = mutations.ResendActivationEmail.Field()
    send_password_reset_email = mutations.SendPasswordResetEmail.Field()
    password_reset = mutations.PasswordReset.Field()
    password_change = mutations.PasswordChange.Field()
    update_account = mutations.UpdateAccount.Field()
    archive_account = mutations.ArchiveAccount.Field()
    delete_account = mutations.DeleteAccount.Field()
    send_secondary_email_activation = mutations.SendSecondaryEmailActivation.Field()
    verify_secondary_email = mutations.VerifySecondaryEmail.Field()
    swap_emails = mutations.SwapEmails.Field()
    remove_secondary_email = mutations.RemoveSecondaryEmail.Field()

    # django-graphql-jwt inheritances
    token_auth = ObtainJSONWebToken.Field()
    verify_token = mutations.VerifyToken.Field()
    refresh_token = mutations.RefreshToken.Field()
    revoke_token = mutations.RevokeToken.Field()


class Mutations(AuthMutation, graphene.ObjectType):
    pass


class Query(graphene.ObjectType):
    user_profile = graphene.Field(ProfileType)
    users = graphene.List(UserType)
    user = graphene.Field(UserType, id=graphene.String())

    def resolve_users(self, info, **kwargs):
        return models.User.objects.all()

    def resolve_user(self, info, id):
        return models.User.objects.get(id=id)

    def resolve_user_profile(self, info):
        result = models.Profile.objects.filter(owner_id=info.context.user.id).first()
        return result
