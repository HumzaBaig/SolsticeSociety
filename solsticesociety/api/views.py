# views.py

from rest_framework import viewsets, permissions
from solsticesociety.api.serializers import ReservationSerializer
from solsticesociety.api.models import Reservation

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]
