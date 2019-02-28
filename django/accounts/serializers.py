from rest_framework import serializers
import djoser.serializers
# import djoser
from accounts.models import User


class UserCreateSerializer(djoser.serializers.UserCreateSerializer):
    def validate_accepts_terms(self, value):
        if not value:
            raise serializers.ValidationError("required_to_accept_terms")
        return value

    class Meta:  # noqa
        model = User
        fields = (
            'password',
            'email',
            'accepts_terms',
        )


class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:  # noqa
        model = User
        fields = (
            'email',
            'username',
        )


# class LogInSerializer(serializers.Serializer):  # noqa
#     email = serializers.CharField()
#     password = serializers.CharField()

# class PasswordRecoverSerializer(serializers.Serializer):  # noqa
#     def validate_email(self, value):
#         if not value:
#             raise serializers.ValidationError(THIS_FIELD_IS_REQUIRED)

#         if not User.objects.filter(is_active=True, email=value).exists():
#             raise serializers.ValidationError(NO_ACCOUNT_WITH_THIS_EMAIL)

#         return value

#     email = serializers.CharField()

# class PasswordResetSerializer(serializers.Serializer):  # noqa
#     new_password = serializers.CharField()
