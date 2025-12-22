# this is nothing, just testing to see if backend can send email. NOT IN THE FINAL PRODUCT
from django.core.mail import send_mail
from django.http import HttpResponse
from django.conf import settings

def test_email(request):
    send_mail(
        "Email Test from Medicall App",
        "This is a test email. If you received this, Gmail SMTP works.",
        settings.DEFAULT_FROM_EMAIL,
        ["acharyamanav7@gmail.com"],
        fail_silently=False,
    )
    return HttpResponse("Email sent successfully")
