from . import models
from django import forms
from django.shortcuts import redirect
from django.shortcuts import render
from django.views import View


def _private_data(move_id, owner_id):
    return models.MovePrivateData.objects.get_or_create(
        move_id=move_id, owner_id=owner_id)[0]


class MoveForm(forms.ModelForm):
    class Meta:
        fields = ['name', 'difficulty', 'tags']
        model = models.Move


class EditMoveView(View):
    def _render(self, move, form):
        owner_id = self.request.user.id
        private_data = _private_data(
            move.id, owner_id) if move.id else models.MovePrivateData()
        context = dict(
            move=move,
            is_my_move=not move.id or move.owner.id == owner_id,
            private_notes=private_data.notes,
            form=form)
        return render(self.request, 'moves/edit_move.html', context=context)

    def get(self, request, move_name=None):
        if move_name:
            move = models.Move.objects.get(name=move_name)
            return self._render(move, MoveForm(instance=move))
        else:
            return self._render(models.Move(), MoveForm())

    def post(self, request, move_name=None):
        move = models.Move.objects.get(name=move_name) if move_name else None
        form = MoveForm(request.POST, instance=move)

        if form.is_valid():
            if not move or move.owner.id == request.user.id:
                move = form.save(commit=False)
                move.owner = request.user
                move.save()
                form.save_m2m()
            return redirect('edit_move', move.name)

        return self._render(move, form)
