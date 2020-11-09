# serializers.py

from rest_framework import serializers
from .models import Reservation

class ReservationSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)
    datetime = serializers.DateTimeField(
        format='%m-%d-%Y %H:%M',
        input_formats=['%m-%d-%Y %H:%M']
    )

    class Meta:
        model = Reservation
        fields = '__all__' 

