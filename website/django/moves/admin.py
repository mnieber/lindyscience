from django.contrib import admin
from moves import models


class MoveVideoLinkInline(admin.StackedInline):
    model = models.MoveVideoLink
    extra = 1


class MoveTipInline(admin.StackedInline):
    model = models.MoveTip
    extra = 1


class MoveAdmin(admin.ModelAdmin):
    model = models.Move
    inlines = (
        MoveVideoLinkInline,
        MoveTipInline,
    )


admin.site.register(models.Move, MoveAdmin)
admin.site.register(models.MoveVideoLink)
admin.site.register(models.MoveTip)
