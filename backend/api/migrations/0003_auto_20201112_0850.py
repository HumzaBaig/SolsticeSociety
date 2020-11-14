# Generated by Django 3.1.3 on 2020-11-12 08:50

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20201109_0741'),
    ]

    operations = [
        migrations.RenameField(
            model_name='reservation',
            old_name='datetime',
            new_name='start',
        ),
        migrations.RemoveField(
            model_name='reservation',
            name='duration',
        ),
        migrations.AddField(
            model_name='reservation',
            name='end',
            field=models.DateTimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
