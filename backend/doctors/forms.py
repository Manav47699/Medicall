from django import forms
from .models import Appointment

class AppointmentForm(forms.ModelForm):
    visit_time = forms.DateTimeField(
        widget=forms.DateTimeInput(attrs={'type': 'datetime-local'})
    )

    class Meta:
        model = Appointment
        fields = ['patient_name', 'patient_age', 'sex', 'reason', 'visit_time']
