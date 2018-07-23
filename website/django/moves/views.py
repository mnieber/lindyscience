from . import models
from django.shortcuts import render
from django.views import View


def _private_data(move_id, owner_id):
    return models.MovePrivateData.objects.get_or_create(
        move_id=move_id, owner_id=owner_id)[0]


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
