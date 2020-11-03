# views.py

from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets, permissions
from solsticesociety.api.serializers import ReservationSerializer
from solsticesociety.api.models import Reservation

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
