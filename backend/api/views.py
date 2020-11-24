# views.py

from stripe.api_resources.token import Token
from backend.settings import BASE_URL
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from rest_framework import views
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.urls import reverse
from backend.api.serializers import ReservationSerializer
from backend.api.models import Reservation
from datetime import datetime
import locale
import stripe
import os
from re import sub
from decimal import Decimal
from backend.settings import BASE_URL

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        start = data['start']
        end = data['end']

        if (end < start):
            return Response(
                'Time Conflict: End must be greater than Start',
                status=status.HTTP_409_CONFLICT,
                headers=None
            )
        if (end == start):
            return Response(
                'Time Conflict: Minimum 1 hour required',
                status=status.HTTP_409_CONFLICT,
                headers=None
            )

        starts_in_range = Reservation.objects.filter(start__range=[start, end])
        ends_in_range = Reservation.objects.filter(end__range=[start, end])

        if (len(starts_in_range) > 0):
            return Response(
                'Time Conflict: End Time Conflict',
                status=status.HTTP_409_CONFLICT,
                headers=None
            )
        if (len(ends_in_range) > 0):
            return Response(
                'Time Conflict: Start Time Conflict',
                status=status.HTTP_409_CONFLICT,
                headers=None
            )

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        date = data['start'].strftime('%m/%d/%Y at %I:%M %p')
        duration = strfdelta((end - start))
        final_time = data['end'].strftime('%m/%d/%Y at %I:%M %p')
        total_amount = get_total(data['amount_paid'])
        

        dev_email = ['humza.baig2009@gmail.com', 'ectomoplys@gmail.com']
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
Email: {data['email']}
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
@csrf_exempt
def checkout(request):
    email = request.data['email']
    dates = parse_request_dates(request)
    cost = get_total_cost(dates[0], dates[1])

    try:
        checkout_session = stripe.checkout.Session.create(
            customer_email=email,
            payment_method_types=['card'],
            line_items=cost,
            mode='payment',
            success_url = BASE_URL + '?success=true',
            cancel_url = BASE_URL + '?canceled=true',
        )
        
        return Response({
            'id' : checkout_session.id,
            'start' : dates[0],
            'end' : dates[1],
            'amount_paid' : checkout_session.amount_total,
        })
    except Exception as e:
        return Response(
            str(e),
            status=status.HTTP_403_FORBIDDEN
        )

def add_time(d, delta):
    return d + delta

def strfdelta(tdelta):
    d = {"days": tdelta.days}
    d["hours"], rem = divmod(tdelta.seconds, 3600)

    if (d["days"] > 0):
        return f'{d["days"]} days {d["hours"]} hours'
    else:
        return f'{d["hours"]} hours'

def format_currency(n):
    locale.setlocale(locale.LC_ALL, '')
    return locale.currency(n, grouping=True)

def phone_format(n):
    return format(int(n[:-1]), ",").replace(",", "-") + n[-1]

def get_total(price):
    return Decimal(sub(r'[^\d.]', '', price))

def get_total_cost(start, end):
    total_hours = int((end - start).total_seconds() / 3600)
    print(total_hours)
    if (total_hours <= 4):
        return [{
            'price' : 'price_1Hr1HHIVc7a48Sip1Mhz4JSd',
            'quantity' : 1,
        }]
    else:
        remaining_hours = total_hours - 4
        return [{
            'price' : 'price_1Hr1HHIVc7a48Sip1Mhz4JSd',
            'quantity' : 1,
        },
        {
            'price' : 'price_1Hr1LEIVc7a48SipRmM3j4Sw',
            'quantity' : remaining_hours,
        }]

def parse_request_dates(request):
    r = request.data
    start_s = f"{r['date']['startMonth']}-{r['date']['startDay']}-{r['date']['startYear']} {int(r['start']['startTime'].split(':')[0])}:{int(r['start']['startTime'].split(':')[1])}"
    end_s = f"{r['date']['endMonth']}-{r['date']['endDay']}-{r['date']['endYear']} {int(r['end']['endTime'].split(':')[0])}:{int(r['end']['endTime'].split(':')[1])}"
    format = '%m-%d-%Y %H:%M'
    start = datetime.strptime(start_s, format)
    end = datetime.strptime(end_s, format)

    return (start, end)