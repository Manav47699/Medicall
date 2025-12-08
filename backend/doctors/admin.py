from django.contrib import admin
from .models import Doctor_model, DoctorCertificate, Appointment

# Register your models here.

admin.site.register(Doctor_model)
admin.site.register(DoctorCertificate)
admin.site.register(Appointment)