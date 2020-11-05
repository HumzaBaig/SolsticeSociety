Registration(Model)  
  
name = CharField(max_length=50) // Shaheer Mirza  
email = EmailField() // shaheermirzacs@gmail.com  
datetime = DateTimeField(format='%m-%d-%Y %H:%M) // 10-25-2006 14:30  
duration = DurationField(format='%H:%M:%S) // 01:30:00 - 1 hour 30 min  
phone = CharField(max_length=10) // 8326230049 - No international  
amount_paid = DecimalField(max_digits=7, decimal_places=2) // 99999.99  
payment_method = CharField(max_length=15) // 'Visa' or 'MasterCard'. I can validate this if needed, but if they're paying through some other method that's better  