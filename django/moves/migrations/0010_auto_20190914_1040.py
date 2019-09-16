# Generated by Django 2.1.7 on 2019-09-14 10:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('moves', '0009_auto_20190410_1955'),
    ]

    operations = [
        migrations.AddField(
            model_name='move',
            name='url',
            field=models.URLField(default='https://youtu.be/cxHLVdhkJ6k'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='movelist',
            name='role',
            field=models.CharField(blank=True, choices=[('', 'default'), ('drafts', 'drafts'), ('trash', 'trash')], default='', max_length=200),
        ),
    ]
