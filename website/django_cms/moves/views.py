from . import models
from django import forms
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import redirect
from django.shortcuts import render
from django.views import View
from django_cms_tools.models import TempPlaceholder
from django_cms_tools.utils import copy_plugins, set_default_text_plugin


def _private_data(move_id, owner_id):
    return models.MovePrivateData.objects.get_or_create(
        move_id=move_id, owner_id=owner_id)[0]


def _temp_description(move_id, owner_id):
    placeholder = TempPlaceholder.objects.get_or_create(
        content_type=ContentType.objects.get_for_model(models.Move),
        object_id=move_id,
        owner_id=owner_id)[0].placeholder
    set_default_text_plugin(placeholder)
    return placeholder


def _temp_private_notes(private_data_id, owner_id):
    placeholder = TempPlaceholder.objects.get_or_create(
        content_type=ContentType.objects.get_for_model(models.MovePrivateData),
        object_id=private_data_id,
        owner_id=owner_id)[0].placeholder
    set_default_text_plugin(placeholder)
    return placeholder


class MoveForm(forms.ModelForm):
    class Meta:
        fields = ['name', 'difficulty', 'tags']
        model = models.Move


class MoveDescriptionView(View):
    def get(self, request, move_name):
        move = models.Move.objects.get(name=move_name)
        context = dict(placeholder=move.description)
        return render(request, 'moves/placeholder.html', context=context)


class MovePrivateNotesView(View):
    def get(self, request, move_id):
        private_data = _private_data(move_id, request.user.id)
        context = dict(placeholder=private_data.notes)
        return render(request, 'moves/placeholder.html', context=context)


class EditMoveView(View):
    """
    Copy the description and private notes to TempPlaceholder
    instances and redirect to 'editing_move'.
    """

    def get(self, request, move_name=None):
        owner_id = self.request.user.id
        move = models.Move.objects.get(
            name=move_name) if move_name else models.Move()

        temp_description = _temp_description(move.id or -1, owner_id)
        if move.id:
            copy_plugins(move.description, temp_description)

        private_data = _private_data(
            move.id, owner_id) if move_name else models.MovePrivateData()
        temp_private_notes = _temp_private_notes(private_data.id or -1,
                                                 owner_id)
        if private_data.id:
            copy_plugins(private_data.notes, temp_private_notes)

        return redirect('editing_move',
                        move_name) if move_name else redirect('creating_move')


class EditingMoveView(View):
    """
    Show a form to edit the move and the corresponding TempPlaceholder
    instances for its description and private notes.
    """

    def _render(self, move, form):
        owner_id = self.request.user.id
        private_data = _private_data(
            move.id, owner_id) if move.id else models.MovePrivateData()
        context = dict(
            move=move,
            is_my_move=not move.id or move.owner.id == owner_id,
            description=_temp_description(move.id or -1, owner_id),
            private_notes=_temp_private_notes(private_data.id or -1, owner_id),
            form=form)
        return render(self.request, 'moves/edit_move.html', context=context)

    def get(self, request, move_name=None):
        if move_name:
            move = models.Move.objects.get(name=move_name)
            return self._render(move, MoveForm(instance=move))
        else:
            return self._render(models.Move(), MoveForm())

    def post(self, request, move_name=None):
        owner_id = request.user.id
        move = models.Move.objects.get(name=move_name) if move_name else None
        form = MoveForm(request.POST, instance=move)

        if form.is_valid():
            if not move or move.owner.id == request.user.id:
                move = form.save(commit=False)
                move.owner = request.user
                move.save()
                form.save_m2m()

                copy_plugins(
                    _temp_description(move.id, owner_id), move.description)

                private_data = _private_data(move.id, owner_id)
                copy_plugins(
                    _temp_private_notes(private_data.id, owner_id),
                    private_data.notes)
            return redirect('edit_move', move.name)

        return self._render(move, form)
