# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2019-02-11 06:26
from __future__ import unicode_literals

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id',
                 models.AutoField(
                     auto_created=True,
                     primary_key=True,
                     serialize=False,
                     verbose_name='ID')),
                ('password',
                 models.CharField(max_length=128, verbose_name='password')),
                ('last_login',
                 models.DateTimeField(
                     blank=True, null=True, verbose_name='last login')),
                ('is_superuser',
                 models.BooleanField(
                     default=False,
                     help_text=
                     'Designates that this user has all permissions without explicitly assigning them.',
                     verbose_name='superuser status')),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_active',
                 models.BooleanField(default=True, verbose_name='active')),
                ('date_joined',
                 models.DateTimeField(
                     auto_now_add=True, verbose_name='date joined')),
                ('accepts_terms', models.BooleanField()),
                ('terms_accepted',
                 models.CharField(default='1.0.0', max_length=10)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id',
                 models.UUIDField(
                     default=uuid.uuid4,
                     editable=False,
                     primary_key=True,
                     serialize=False)),
                ('created', models.DateField(auto_now_add=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ProfileToMoveList',
            fields=[
                ('id',
                 models.AutoField(
                     auto_created=True,
                     primary_key=True,
                     serialize=False,
                     verbose_name='ID')),
                ('order', models.FloatField()),
            ],
            options={
                'ordering': ['order'],
            },
        ),
    ]
