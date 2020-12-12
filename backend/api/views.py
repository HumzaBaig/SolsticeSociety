# views.py

from rest_framework.filters import SearchFilter
from stripe.api_resources.token import Token
from backend.settings import BASE_URL, PRICE_WEEKDAY, PRICE_WEEKEND, PRICE_HOURLY, PRICE_DEPOSIT
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework import views
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets, permissions, status, filters
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
    search_fields = ['session_id']
    filter_backends = [filters.SearchFilter,]

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
Total: {format_currency(data['amount_paid'])}

Further Instructions:
● We'll provide you with towels, ice, water and all other necessities.
● You have two choices for pickup locations
    1. Free parking at Lummus Park on the river in Downtown Miami.

    OR

    2. $90 pickup at the Epic Hotel and Marina in Downtown Miami
       (valet not included).



Solstice Society strictly follows the following guidelines on c​ancellations​:
● If the cancellation is initiated at least seven days​ before t​he charter,
  you will be eligible to receive a ​full r​efund of your deposit.
● If the cancellation is initiated ​within ​seven days before your charter,
  you will be eligible to receive ​half o​f your deposit back.
● If for any reason, Solstice Society will be unavailable to fulfill our duties
  and make the charter, your f​ull ​deposit will be refunded.
● For inclement weather conditions that lead to your Solstice Society charter
  getting cancelled, you will have the option to choose between getting your
  f​ull ​deposit refunded or rescheduling your charter at a later date.

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
    is_weekend = request.data['is_weekend']
    # cost = get_total_cost(dates[0], dates[1], is_weekend)
    cost = [{
        'price' : PRICE_DEPOSIT,
        'quantity' : 1,
    }]

    try:
        checkout_session = stripe.checkout.Session.create(
            billing_address_collection='required',
            customer_email=email,
            payment_method_types=['card'],
            line_items=cost,
            mode='payment',
            success_url = BASE_URL + '?success=true',
            cancel_url = BASE_URL + '?canceled={CHECKOUT_SESSION_ID}',
        )

        start = dates[0].strftime('%m-%d-%Y %H:%M')
        end = dates[1].strftime('%m-%d-%Y %H:%M')

        return Response({
            'id' : checkout_session.id,
            'start' : start,
            'end' : end,
            'amount_paid' : checkout_session.amount_total,
        },
        status=status.HTTP_200_OK)
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

def get_total_cost(start, end, is_weekend):
    total_hours = int((end - start).total_seconds() / 3600)

    base_price = PRICE_WEEKDAY

    if (is_weekend):
        base_price = PRICE_WEEKEND

    if (total_hours <= 4):
        return [{
            'price' : base_price,
            'quantity' : 1,
        }]
    else:
        remaining_hours = total_hours - 4
        return [{
            'price' : base_price,
            'quantity' : 1,
        },
        {
            'price' : PRICE_HOURLY,
            'quantity' : remaining_hours,
        }]

def parse_request_dates(request):
    r = request.data
    start_s = f"{r['date']['month']}-{r['date']['day']}-{r['date']['year']} {int(r['start']['startTime'].split(':')[0])}:{int(r['start']['startTime'].split(':')[1])}"
    end_s = f"{r['date']['month']}-{r['date']['day']}-{r['date']['year']} {int(r['end']['endTime'].split(':')[0])}:{int(r['end']['endTime'].split(':')[1])}"
    format = '%m-%d-%Y %H:%M'
    start = datetime.strptime(start_s, format)
    end = datetime.strptime(end_s, format)

    return (start, end)
