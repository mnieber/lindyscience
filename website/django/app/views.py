from django.views import View
from django.shortcuts import render


class AppView(View):
    def get(self, request):
        context = {}
        return render(request, 'app/app.html', context=context)
