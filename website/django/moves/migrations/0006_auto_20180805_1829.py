# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-08-05 18:29
from __future__ import unicode_literals

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('moves', '0005_move uuid field'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Tagulous_Move_tags',
        ),
        migrations.RemoveField(
            model_name='move',
            name='tags',
        ),
        migrations.AlterField(
            model_name='move',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]
