from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models

from app.models import Entity


class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, accepts_terms=False):
        if not email:
            raise ValueError("Users must have an email address.")
        if not username:
            raise ValueError("Users must have a username.")
        if not accepts_terms:
            raise ValueError("Users must accept the terms.")
        user = self.model(email=self.normalize_email(email), username=username)
        user.accepts_terms = accepts_terms
        user.set_password(password)
        user.save()  # using=self._db
        return user

    def create_superuser(self, email, username, password=None):
        user = self.create_user(email, username, password=password, accepts_terms=True)
        user.is_superuser = True
        user.is_staff = True
        user.save()  # using=self._db
        return user


class User(AbstractBaseUser, PermissionsMixin):
    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=255, unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField("active", default=True)
    date_joined = models.DateTimeField("date joined", auto_now_add=True)
    accepts_terms = models.BooleanField()
    terms_accepted = models.CharField(max_length=10, default="1.0.0")


class ProfileToMoveList(models.Model):
    profile = models.ForeignKey("Profile", on_delete=models.CASCADE)
    move_list = models.ForeignKey("moves.MoveList", on_delete=models.CASCADE)
    order = models.FloatField()

    def __str__(self):  # noqa
        return "%s follows move list %s" % (
            self.profile.owner.username,
            self.move_list.name,
        )

    class Meta:
        ordering = ["order"]


class Profile(Entity):
    recent_move_url = models.CharField(max_length=255, null=True, blank=True)
    move_lists = models.ManyToManyField("moves.MoveList", through=ProfileToMoveList)

    def __str__(self):  # noqa
        return "Profile of %s" % self.owner.username
