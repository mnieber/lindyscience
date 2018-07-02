from django.views import View
from django.shortcuts import render
from .models import Move
from .serializers import MoveVideoLinkSerializer
import json


class MovesView(View):
    def get(self, request):
        context = {}
        context['moves'] = Move.objects.all()

        return render(request, 'moves/moves.html', context=context)


class MoveView(View):
    def get(self, request, move_name):
        move = Move.objects.get(name=move_name)
        context = {}
        context['move'] = move
        context['videolinks_json'] = json.dumps(
            MoveVideoLinkSerializer(move.video_links.all(), many=True).data)

        return render(request, 'moves/move.html', context=context)


class MoveDescriptionView(View):
    def get(self, request, move_name):
        move = Move.objects.get(name=move_name)
        context = dict(placeholder=move.description)
        return render(request, 'moves/placeholder.html', context=context)
