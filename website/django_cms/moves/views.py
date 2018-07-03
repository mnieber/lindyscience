from django.views import View
from django import forms
from django.shortcuts import redirect
from django.shortcuts import render
from . import models


class MoveForm(forms.ModelForm):
    class Meta:
        fields = ['name', 'difficulty', 'tags']
        model = models.Move


class MoveDescriptionView(View):
    def get(self, request, move_name):
        move = models.Move.objects.get(name=move_name)
        context = dict(placeholder=move.description)
        return render(request, 'moves/placeholder.html', context=context)


class EditMoveView(View):
    def _render(self, move, form=None):
        form = form or MoveForm(instance=move)
        context = dict(move=move, form=form)
        return render(self.request, 'moves/edit_move.html', context=context)

    def get(self, request, move_name):
        print(move_name)
        move = models.Move.objects.get(name=move_name)
        return self._render(move)

    def post(self, request, move_name=None):
        move = models.Move.objects.get(name=move_name) if move_name else None
        form = MoveForm(request.POST, instance=move)

        if form.is_valid():
            move = form.save()
            return redirect('edit_move', move.name)

        return self._render(move, form)
