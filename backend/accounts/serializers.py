####################### signup #######################

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class SignupSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    
    # Profile fields
    phone_number = serializers.CharField(required=False, allow_blank=True)
    age = serializers.IntegerField(required=False)
    gender = serializers.CharField(required=False, allow_blank=True)
    share_location_for_blood = serializers.BooleanField(default=False)
    
    # latitude and longitude will come from frontend
    latitude = serializers.FloatField(required=False)
    longitude = serializers.FloatField(required=False)

    def create(self, validated_data):
        # Extract profile fields
        phone_number = validated_data.pop("phone_number", "")
        age = validated_data.pop("age", None)
        gender = validated_data.pop("gender", "")
        share_location_for_blood = validated_data.pop("share_location_for_blood", False)
        latitude = validated_data.pop("latitude", None)
        longitude = validated_data.pop("longitude", None)

        # 1. create user
        user = User.objects.create_user(**validated_data)

        # 2. create profile manually
        Profile.objects.create(
            user=user,
            phone_number=phone_number,
            age=age,
            gender=gender,
            share_location_for_blood=share_location_for_blood,
            latitude=latitude,
            longitude=longitude
        )

        return user

####################### login #######################

from django.contrib.auth import authenticate

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data['username'],
            password=data['password']
        )

        if user is None:
            raise serializers.ValidationError("Invalid username or password")

        data['user'] = user
        return data
