# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-07-22 06:07
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('django_cms_tools', '0002_tempplaceholder_owner'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tempplaceholder',
            name='object_id',
            field=models.IntegerField(),
        ),
    ]
