from rest_framework import serializers
from .models import Doctor_model, DoctorCertificate


class DoctorCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorCertificate
        fields = ['id', 'certificate', 'uploaded_at']


class DoctorSerializer(serializers.ModelSerializer):
    certificates = DoctorCertificateSerializer(many=True, read_only=True)

    class Meta:
        model = Doctor_model
        fields = ['id', 'doctor_name', 'photo', 'qualifications', 'created_at', 'certificates']
