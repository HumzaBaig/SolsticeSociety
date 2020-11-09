# models.py

from django.db import models, IntegrityError
from django.contrib.auth.models import User

class Reservation(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)
    email = models.EmailField()
    datetime = models.DateTimeField()
    duration = models.DurationField()
    phone = models.CharField(max_length=10)
    amount_paid = models.DecimalField(max_digits=7, decimal_places=2, default=0.00)
    payment_method = models.CharField(max_length=15, default='')
