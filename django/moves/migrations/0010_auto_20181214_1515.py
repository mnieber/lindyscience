# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-12-14 15:15
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('moves', '0009_auto_20181214_1504'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='movelistitem',
            name='move',
        ),
        migrations.RemoveField(
            model_name='movelistitem',
            name='move_list',
        ),
        migrations.AddField(
            model_name='movelist',
            name='moves',
            field=models.ManyToManyField(to='moves.Move'),
        ),
        migrations.DeleteModel(
            name='MoveListItem',
        ),
    ]
