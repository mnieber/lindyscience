# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-07-19 17:40
from __future__ import unicode_literals

import cms.models.fields
from django.db import migrations, models
import django.db.models.deletion
import enumfields.fields
import moves.models
import tagulous.models.fields
import tagulous.models.models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('cms', '0020_old_tree_cleanup'),
    ]

    operations = [
        migrations.CreateModel(
            name='Move',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, unique=True)),
                ('difficulty', enumfields.fields.EnumField(enum=moves.models.Difficulty, max_length=7)),
                ('description', cms.models.fields.PlaceholderField(editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='description', slotname='description', to='cms.Placeholder')),
            ],
        ),
        migrations.CreateModel(
            name='MoveVideoLink',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('url', models.URLField()),
                ('title', models.CharField(blank=True, max_length=255, null=True)),
                ('move', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='video_links', to='moves.Move')),
            ],
        ),
        migrations.CreateModel(
            name='Tagulous_Move_tags',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('slug', models.SlugField()),
                ('count', models.IntegerField(default=0, help_text='Internal counter of how many times this tag is in use')),
                ('protected', models.BooleanField(default=False, help_text='Will not be deleted when the count reaches 0')),
            ],
            options={
                'abstract': False,
                'ordering': ('name',),
            },
            bases=(tagulous.models.models.BaseTagModel, models.Model),
        ),
        migrations.AlterUniqueTogether(
            name='tagulous_move_tags',
            unique_together=set([('slug',)]),
        ),
        migrations.AddField(
            model_name='move',
            name='tags',
            field=tagulous.models.fields.TagField(_set_tag_meta=True, force_lowercase=True, help_text='Enter a comma-separated tag string', max_count=10, to='moves.Tagulous_Move_tags'),
        ),
    ]
