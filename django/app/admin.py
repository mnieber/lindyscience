from django.contrib import admin
from app import models


class ProfileToMoveListInline(admin.TabularInline):
    model = models.ProfileToMoveList
    extra = 1


class ProfileAdmin(admin.ModelAdmin):
    inlines = (ProfileToMoveListInline, )


admin.site.register(models.Profile, ProfileAdmin)
