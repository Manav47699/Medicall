import stripe
import json

from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from django.core.mail import send_mail

from .models import Doctor_model, Appointment
from .forms import AppointmentForm

# Stripe API key
stripe.api_key = settings.STRIPE_SECRET_KEY


# List all doctors
def doctors_list_view(request):
    doctors = Doctor_model.objects.all()

    data = []
    for doctor in doctors:
        data.append({
            "id": doctor.id,
            "name": doctor.doctor_name,
            "email": doctor.doctor_email,
            "qualifications": doctor.qualifications,
        })

    return JsonResponse(data, safe=False)


#creating appointments
@csrf_exempt
def create_appointment(request, doctor_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)

    doctor = get_object_or_404(Doctor_model, id=doctor_id)

    data = json.loads(request.body)

    appointment = Appointment.objects.create(
        doctor=doctor,
        user=request.user if request.user.is_authenticated else None,
        patient_name=data.get("patient_name"),
        patient_age=data.get("patient_age"),
        sex=data.get("sex"),
        reason=data.get("reason"),
        visit_time=data.get("visit_time"),
        status="pending",
    )

    return JsonResponse({
        "appointment_id": appointment.id,
        "message": "Appointment created"
    })


#creating a safe stripe checkout session
@csrf_exempt
def create_checkout_session(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)

    data = json.loads(request.body)
    appointment_id = data.get("appointment_id")

    appointment = get_object_or_404(Appointment, id=appointment_id)

    checkout_session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        mode="payment",

        line_items=[{
            "price_data": {
                "currency": "usd",
                "product_data": {
                    "name": f"Appointment with {appointment.doctor.doctor_name}",
                },
                "unit_amount": 5000,
            },
            "quantity": 1,
        }],

        metadata={
            "appointment_id": str(appointment.id)
        },

        success_url="http://localhost:3000/payment-success",
        cancel_url="http://localhost:3000/payment-cancel",
    )

    appointment.stripe_session_id = checkout_session.id
    appointment.save()

    return JsonResponse({
        "checkout_url": checkout_session.url
    })


#STRIPE webhook
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")

    try:
        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        appointment_id = session["metadata"].get("appointment_id")

        if appointment_id:
            try:
                appointment = Appointment.objects.get(id=appointment_id)

                if appointment.status != "paid":
                    appointment.status = "paid"
                    appointment.paid_at = timezone.now()
                    appointment.save()

                    subject = f"New Appointment: {appointment.patient_name}"
                    message = f"""
New Appointment Confirmed (Payment Successful)

Patient Name: {appointment.patient_name}
Age: {appointment.patient_age}
Sex: {appointment.sex}
Reason: {appointment.reason}
Visit Time: {appointment.visit_time}

Stripe Session ID: {session['id']}
"""

                    send_mail(
                        subject,
                        message,
                        settings.DEFAULT_FROM_EMAIL,
                        [appointment.doctor.doctor_email],
                        fail_silently=False
                    )

            except Appointment.DoesNotExist:
                pass

    return HttpResponse(status=200)
