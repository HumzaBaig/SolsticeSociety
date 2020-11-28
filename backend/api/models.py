# models.py

from django.db import models, IntegrityError
from django.contrib.auth.models import User

class Reservation(models.Model):
    session_id = models.CharField(max_length=100, default='')
    name = models.CharField(max_length=50)
    email = models.EmailField()
    secondary_name = models.CharField(max_length=50, default='')
    start = models.DateTimeField()
    end = models.DateTimeField()
    phone = models.CharField(max_length=10)
    secondary_phone = models.CharField(max_length=10, default='')
    party_size = models.IntegerField(default=1)
    amount_paid = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    is_weekend = models.BooleanField(default=False)
