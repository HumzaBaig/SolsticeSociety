# models.py

from django.db import models, IntegrityError
from django.contrib.auth.models import User

class Reservation(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField()
    datetime = models.DateTimeField()
    duration = models.DurationField()
    phone = models.CharField(max_length=10)
