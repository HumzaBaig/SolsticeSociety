# Generated by Django 3.1.3 on 2020-11-25 03:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_remove_reservation_payment_method'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reservation',
            name='amount_paid',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=15),
        ),
    ]