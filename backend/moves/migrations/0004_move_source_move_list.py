# Generated by Django 2.1.7 on 2019-03-31 14:04

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("moves", "0003_auto_20190326_1740"),
    ]

    operations = [
        migrations.AddField(
            model_name="move",
            name="source_move_list",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="sourced_moves",
                to="moves.MoveList",
            ),
        ),
    ]