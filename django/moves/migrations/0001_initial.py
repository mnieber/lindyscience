# Generated by Django 2.1.7 on 2019-02-24 10:13

from django.conf import settings
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
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Move',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created', models.DateField(auto_now_add=True)),
                ('name', models.CharField(max_length=200, unique=True)),
                ('slug', models.CharField(max_length=200, unique=True)),
                ('difficulty', enumfields.fields.EnumField(enum=moves.models.Difficulty, max_length=7)),
                ('description', models.TextField()),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='MoveList',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created', models.DateField(auto_now_add=True)),
                ('name', models.CharField(max_length=200, unique=True)),
                ('slug', models.CharField(max_length=200, unique=True)),
                ('is_private', models.BooleanField(default=False)),
                ('is_trash', models.BooleanField(default=False)),
                ('description', models.TextField()),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='MoveList2Move',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.FloatField()),
                ('move', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='moves.Move')),
                ('move_list', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='moves.MoveList')),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='MovePrivateData',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created', models.DateField(auto_now_add=True)),
                ('notes', models.TextField()),
                ('move', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='private_datas', to='moves.Move')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
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
        migrations.CreateModel(
            name='Tagulous_MoveList_tags',
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
        migrations.CreateModel(
            name='Tip',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created', models.DateField(auto_now_add=True)),
                ('text', models.CharField(blank=True, max_length=255, null=True)),
                ('vote_count', models.IntegerField(default=0)),
                ('move', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tips', to='moves.Move')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='VideoLink',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created', models.DateField(auto_now_add=True)),
                ('url', models.URLField()),
                ('title', models.CharField(blank=True, max_length=255, null=True)),
                ('vote_count', models.IntegerField(default=0)),
                ('move', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='video_links', to='moves.Move')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AlterUniqueTogether(
            name='tagulous_movelist_tags',
            unique_together={('slug',)},
        ),
        migrations.AlterUniqueTogether(
            name='tagulous_move_tags',
            unique_together={('slug',)},
        ),
        migrations.AddField(
            model_name='movelist',
            name='moves',
            field=models.ManyToManyField(through='moves.MoveList2Move', to='moves.Move'),
        ),
        migrations.AddField(
            model_name='movelist',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='movelist',
            name='tags',
            field=tagulous.models.fields.TagField(_set_tag_meta=True, blank=True, force_lowercase=True, help_text='Enter a comma-separated tag string', max_count=10, space_delimiter=False, to='moves.Tagulous_MoveList_tags'),
        ),
        migrations.AddField(
            model_name='move',
            name='tags',
            field=tagulous.models.fields.TagField(_set_tag_meta=True, force_lowercase=True, help_text='Enter a comma-separated tag string', max_count=10, space_delimiter=False, to='moves.Tagulous_Move_tags'),
        ),
    ]
