##############for signup#############



from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class SignupSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    profile_pic = serializers.ImageField(required=False)

    def create(self, validated_data):
        bio = validated_data.pop("bio", "")
        profile_pic = validated_data.pop("profile_pic", None)

        # 1. create user
        user = User.objects.create_user(**validated_data)

        # 2. create profile manually
        Profile.objects.create(
            user=user,
            bio=bio,
            profile_pic=profile_pic
        )

        return user
##################################################





####################for login#############
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
#######################################################