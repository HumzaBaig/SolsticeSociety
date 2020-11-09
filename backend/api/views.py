# views.py

from django.core.mail import send_mail
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from backend.api.serializers import ReservationSerializer
from backend.api.models import Reservation
import locale

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
        
        data = serializer.validated_data
        send_mail(
            'Details Regarding Your Reservation of Solstice Society',
            f"""{data['name']},
            Here are the details of your reservation.
            Time: {data['datetime']}
            Duration: {data['duration']}
            Phone: {phone_format(data['phone'])}
            Total: ${format_currency(data['amount_paid'])}
            Payment Method: {data['payment_method']}

            Thank you!
            """,
            'revitiidevelopment@gmail.com',
            [serializer.validated_data['email']],
            fail_silently=False
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

def format_currency(n):
    locale.setlocale(locale.LC_ALL, '')
    return locale.currency(n, grouping=True)

def phone_format(n): 
        return format(int(n[:-1]), ",").replace(",", "-") + n[-1] 
