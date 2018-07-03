from django.views import View
from django.shortcuts import render
from . import models


class MoveDescriptionView(View):
    def get(self, request, move_name):
        move = models.Move.objects.get(name=move_name)
        context = dict(placeholder=move.description)
        return render(request, 'moves/placeholder.html', context=context)
