import stripe
from django.shortcuts import render, redirect, get_object_or_404
from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail
from .models import Doctor_model, Appointment
from .forms import AppointmentForm

# Stripe API key
stripe.api_key = settings.STRIPE_SECRET_KEY


# List all doctors
def doctors_list_view(request):
    doctors = Doctor_model.objects.all()
    return render(request, 'doctors/list.html', {'doctors': doctors})


# Doctor detail + appointment form
def doctor_detail_view(request, doctor_id):
    doctor = get_object_or_404(Doctor_model, id=doctor_id)

    if request.method == 'POST':
        form = AppointmentForm(request.POST)
        if form.is_valid():
            appointment = form.save(commit=False)
            appointment.doctor = doctor
            if request.user.is_authenticated:
                appointment.user = request.user
            appointment.save()

            # Redirect to Stripe checkout
            return redirect(
                'create_checkout_session', 
                doctor_id=doctor.id, 
                appointment_id=appointment.id
            )
    else:
        form = AppointmentForm()

    return render(request, 'doctors/detail.html', {'doctor': doctor, 'form': form})


# Stripe checkout session
def create_checkout_session(request, doctor_id, appointment_id):
    appointment = get_object_or_404(Appointment, id=appointment_id)

    checkout_session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'product_data': {
                    'name': f'Appointment with {appointment.doctor.doctor_name}',
                },
                'unit_amount': 5000,  # $50.00 in cents
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url=request.build_absolute_uri('/doctors/success/') + f'?appointment_id={appointment.id}',
        cancel_url=request.build_absolute_uri(f'/doctors/{doctor_id}/'),
    )

    appointment.stripe_session_id = checkout_session.id
    appointment.save()

    return redirect(checkout_session.url)


# Payment success view
def payment_success(request):
    appointment_id = request.GET.get('appointment_id')
    appointment = get_object_or_404(Appointment, id=appointment_id)

    # Mark as paid
    appointment.status = 'paid'
    appointment.paid_at = timezone.now()
    appointment.save()

    # Send email to doctor
    subject = f"New Appointment with {appointment.patient_name}"
    message = f"""
Appointment Details:

Patient Name: {appointment.patient_name}
Sex: {appointment.sex}
Reason: {appointment.reason}
Visit Time: {appointment.visit_time}
"""
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [appointment.doctor.doctor_email],
        fail_silently=False
    )

    return render(request, 'doctors/success.html', {'appointment': appointment})
