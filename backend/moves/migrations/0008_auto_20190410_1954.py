# Generated by Django 2.1.7 on 2019-04-10 19:54

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("moves", "0007_move_variations"),
    ]

    operations = [
        migrations.RemoveField(model_name="move", name="variations",),
        migrations.AddField(
            model_name="move",
            name="variationNames",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(max_length=200),
                blank=True,
                default=list,
                size=None,
            ),
        ),
    ]
