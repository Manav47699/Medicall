#######################for signup#####################
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import SignupSerializer

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Profile

@csrf_exempt
def signup_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)

    username = request.POST.get("username")
    password = request.POST.get("password")
    bio = request.POST.get("bio", "")
    profile_pic = request.FILES.get("profile_pic")

    if not username or not password:
        return JsonResponse({"error": "Username and password are required"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username already exists"}, status=400)

    # create user
    user = User.objects.create(username=username, password=make_password(password))
    # create profile
    Profile.objects.create(user=user, bio=bio, profile_pic=profile_pic)

    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "profile_pic": f"{profile_pic.url}" if profile_pic else None,
        "message": "User created successfully"
    })

######################################################



###############for login#################
from .serializers import LoginSerializer

from django.contrib.auth import authenticate

@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)

    username = request.POST.get("username")
    password = request.POST.get("password")

    if not username or not password:
        return JsonResponse({"error": "Username and password are required"}, status=400)

    user = authenticate(username=username, password=password)
    if not user:
        return JsonResponse({"error": "Invalid credentials"}, status=400)

    profile = Profile.objects.get(user=user)
    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "profile_pic": profile.profile_pic.url if profile.profile_pic else None,
        "message": "Login successful"
    })

#####################################################

###########for user count in the home page############
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["GET"])
def user_count(request):
    count = User.objects.count()
    return Response({"count": count})


###################################################