# views.py

from django.core.mail import send_mail
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from backend.api.serializers import ReservationSerializer
from backend.api.models import Reservation

import os

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        send_mail(
            'New Reservation for Solstice Society',
            f"{serializer.validated_data['name']} has made a reservation at {serializer.validated_data['datetime']}",
            'shaheermirzacs@gmail.com',
            ['ectomoplys@gmail.com'],
            fail_silently=False
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )
