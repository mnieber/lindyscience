# Generated by Django 2.1.7 on 2019-10-11 09:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('moves', '0015_remove_move_variation_names'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movelist',
            name='name',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='movelist',
            name='slug',
            field=models.CharField(max_length=200),
        ),
    ]
