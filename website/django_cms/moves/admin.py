from django.contrib import admin
from moves.models import MovesPage
from cms.admin.placeholderadmin import PlaceholderAdminMixin


class MovesPageAdmin(PlaceholderAdminMixin, admin.ModelAdmin):
    exclude = ['user']


admin.site.register(MovesPage, MovesPageAdmin)
