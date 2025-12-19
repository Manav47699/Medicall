####################### signup #####################
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Profile

@csrf_exempt
def signup_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)

    # Get data from POST
    username = request.POST.get("username")
    password = request.POST.get("password")
    email = request.POST.get("email", "")
    phone_number = request.POST.get("phone_number", "")
    age = request.POST.get("age")
    gender = request.POST.get("gender", "")
    share_location_for_blood = request.POST.get("share_location_for_blood", "false").lower() == "true"
    latitude = request.POST.get("latitude")
    longitude = request.POST.get("longitude")

    # Validations
    if not username or not password:
        return JsonResponse({"error": "Username and password are required"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username already exists"}, status=400)

    # 1. create user
    user = User.objects.create(username=username, email=email, password=make_password(password))

    # 2. create profile
    Profile.objects.create(
        user=user,
        phone_number=phone_number,
        age=int(age) if age else None,
        gender=gender,
        share_location_for_blood=share_location_for_blood,
        latitude=float(latitude) if latitude else None,
        longitude=float(longitude) if longitude else None
    )

    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "message": "User created successfully"
    })

#####################################################

####################### login #######################
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
        "phone_number": profile.phone_number,
        "age": profile.age,
        "gender": profile.gender,
        "share_location_for_blood": profile.share_location_for_blood,
        "latitude": profile.latitude,
        "longitude": profile.longitude,
        "message": "Login successful"
    })
#####################################################

####################### user count #################
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["GET"])
def user_count(request):
    count = User.objects.count()
    return Response({"count": count})
