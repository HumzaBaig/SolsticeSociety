# models.py

from django.db import models, IntegrityError
from django.contrib.auth.models import User

class Reservation(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField()
    start = models.DateTimeField()
    end = models.DateTimeField()
    phone = models.CharField(max_length=10)
    amount_paid = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
