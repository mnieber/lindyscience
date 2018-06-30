from django.views import View
from django.shortcuts import render
from .models import MovesPage


class MovesView(View):
    def get(self, request):
        context = {}
        context['page'] = MovesPage.objects.all()[0]

        return render(request, 'moves/moves.html', context=context)
