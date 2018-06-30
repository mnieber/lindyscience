from django.contrib import admin
from cms.admin.placeholderadmin import PlaceholderAdminMixin
from moves.models import Move, MoveVideoLink


class MoveVideoLinkInline(admin.StackedInline):
    model = MoveVideoLink
    extra = 1


class MoveAdmin(PlaceholderAdminMixin, admin.ModelAdmin):
    model = Move
    inlines = (MoveVideoLinkInline, )


admin.site.register(Move, MoveAdmin)
