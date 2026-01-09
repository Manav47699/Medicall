from django.db import models
from django.contrib.auth.models import User


class Doctor_model(models.Model):
    doctor_name = models.CharField(max_length=50)
    doctor_email = models.EmailField()  # doctor's email for notifications
    photo = models.ImageField(upload_to='doctor_photos/')
    qualifications = models.CharField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.doctor_name


class DoctorCertificate(models.Model):
    doctor = models.ForeignKey(
        Doctor_model,
        on_delete=models.CASCADE,
        related_name='certificates'
    )
    certificate = models.ImageField(upload_to='certificate_photos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Certificate for {self.doctor.doctor_name}"


# ------------------------------------
# APPOINTMENT MODEL
# ------------------------------------
class Appointment(models.Model):
    doctor = models.ForeignKey(
        Doctor_model,
        on_delete=models.CASCADE,
        related_name='appointments'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    # patient info
    patient_name = models.CharField(max_length=100)
    patient_age = models.IntegerField()
    sex = models.CharField(max_length=10)
    reason = models.TextField()
    visit_time = models.DateTimeField()
    number = models.CharField(max_length=20, null=True, blank=True)
    your_email = models.EmailField(null=True, blank=True)


    # payment info
    status = models.CharField(
        max_length=20,
        default='pending'  # pending → paid after Stripe payment
    )
    stripe_session_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )
    paid_at = models.DateTimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Appointment with {self.doctor.doctor_name} - {self.patient_name}"
