# views.py

from django.core.mail import send_mail
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from backend.api.serializers import ReservationSerializer
from backend.api.models import Reservation
from datetime import datetime
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
        
        date = data['datetime'].strftime('%m/%d/%Y at %I:%M %p')
        duration = strfdelta(data['duration'], '{hours} hours {minutes} minutes')
        final_time = add_time(data['datetime'], data['duration']).strftime('%m/%d/%Y at %I:%M %p')

        dev_email = ['shaheermirzacs@gmail.com']
        production_email = [
            'contact@ssbookings.com',
            'solviranitracks@gmail.com',
            'Vdpb11@gmail.com'
        ]

        # Email for Clients
        send_mail(
            'Details Regarding Your Reservation of Solstice Society',
            f"""
{data['name']},

Here are the details of your reservation:
            
Time: {date}
Duration: {duration} ({final_time})
Phone: {phone_format(data['phone'])}
Payment Method: {data['payment_method']}
Total: {format_currency(data['amount_paid'])}

Thank you!
            """,
            'revitiidevelopment@gmail.com',
            [serializer.validated_data['email']],
            fail_silently=False
        )
        
        # Email for Solstice Society
        send_mail(
            '[Solstice Society] New Reservation',
            f"""
Name: {data['name']}
Time: {date}
Duration: {duration} ({final_time})
Phone: {phone_format(data['phone'])}
Payment Method: {data['payment_method']}
Total: {format_currency(data['amount_paid'])}
            """,
            'revitiidevelopment@gmail.com',
            dev_email,
            fail_silently=False
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

def add_time(d, delta):
    return d + delta

def strfdelta(tdelta, fmt):
    d = {"days": tdelta.days}
    d["hours"], rem = divmod(tdelta.seconds, 3600)
    d["minutes"], d["seconds"] = divmod(rem, 60)
    return fmt.format(**d)

def format_currency(n):
    locale.setlocale(locale.LC_ALL, '')
    return locale.currency(n, grouping=True)

def phone_format(n): 
        return format(int(n[:-1]), ",").replace(",", "-") + n[-1] 
