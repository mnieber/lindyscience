from django.contrib import admin
from moves import models
import tagulous.admin


class VideoLinkInline(admin.StackedInline):
    model = models.VideoLink
    extra = 1


class TipInline(admin.StackedInline):
    model = models.Tip
    extra = 1


class MoveAdmin(admin.ModelAdmin):
    model = models.Move
    inlines = (
        VideoLinkInline,
        TipInline,
    )


class MoveList2MoveInline(admin.TabularInline):
    model = models.MoveList2Move
    extra = 1


class MoveListAdmin(admin.ModelAdmin):
    inlines = (MoveList2MoveInline, )


admin.site.register(models.Move, MoveAdmin)
admin.site.register(models.VideoLink)
admin.site.register(models.Tip)
admin.site.register(models.MoveList, MoveListAdmin)
admin.site.register(models.MovePrivateData)

tagulous.admin.register(models.Move.tags.tag_model)
tagulous.admin.register(models.MoveList.tags.tag_model)
