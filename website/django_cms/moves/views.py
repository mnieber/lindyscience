from django.views import View
from django.shortcuts import render
from .models import Move


class MovesView(View):
    def get(self, request):
        context = {}
        context['moves'] = Move.objects.all()

        return render(request, 'moves/moves.html', context=context)


class MoveView(View):
    # TODO use regex in url
    # TODO look up the correct url in the template
    def get(self, request, move_name='Basic'):
        context = {}
        context['move'] = Move.objects.get(name=move_name)

        return render(request, 'moves/move.html', context=context)
