from django.forms import ModelForm
from . import models


class ArticleForm(ModelForm):
    class Meta:
        model = models.Move
        fields = ['name', 'difficulty', 'tags']
