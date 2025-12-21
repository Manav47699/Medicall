####################### imports #######################
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response

from geopy.geocoders import Nominatim

from .models import Profile
######################################################


####################### signup #######################
@csrf_exempt
def signup_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)

    # ---- get data ----
    username = request.POST.get("username")
    password = request.POST.get("password")
    email = request.POST.get("email", "")

    phone_number = request.POST.get("phone_number", "")
    age = request.POST.get("age")
    gender = request.POST.get("gender", "")
    city = request.POST.get("city", "")

    share_location_for_blood = (
        request.POST.get("share_location_for_blood", "false").lower() == "true"
    )

    # ---- validations ----
    if not username or not password:
        return JsonResponse(
            {"error": "Username and password are required"},
            status=400
        )

    if User.objects.filter(username=username).exists():
        return JsonResponse(
            {"error": "Username already exists"},
            status=400
        )

    # ---- create user ----
    user = User.objects.create(
        username=username,
        email=email,
        password=make_password(password)
    )

    latitude = None
    longitude = None

    # ---- city -> geopy ----
    if share_location_for_blood and city:
        try:
            geolocator = Nominatim(user_agent="medicall_app")
            location = geolocator.geocode(f"{city}, Nepal")

            if location:
                latitude = float(location.latitude)
                longitude = float(location.longitude)
        except Exception as e:
            print("Geocoding error:", e)

    # ---- create profile ----
    Profile.objects.create(
        user=user,
        phone_number=phone_number,
        age=int(age) if age else None,
        gender=gender,
        city=city,
        share_location_for_blood=share_location_for_blood,
        latitude=latitude,
        longitude=longitude
    )

    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "city": city,
        "latitude": latitude,
        "longitude": longitude,
        "message": "User created successfully"
    })
######################################################


####################### login #######################
@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)

    username = request.POST.get("username")
    password = request.POST.get("password")

    if not username or not password:
        return JsonResponse(
            {"error": "Username and password are required"},
            status=400
        )

    user = authenticate(username=username, password=password)
    if not user:
        return JsonResponse(
            {"error": "Invalid credentials"},
            status=400
        )

    profile = Profile.objects.get(user=user)

    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "phone_number": profile.phone_number,
        "age": profile.age,
        "gender": profile.gender,
        "city": profile.city,
        "share_location_for_blood": profile.share_location_for_blood,
        "latitude": profile.latitude,
        "longitude": profile.longitude,
        "message": "Login successful"
    })
######################################################


####################### user count ###################
@api_view(["GET"])
def user_count(request):
    return Response({
        "count": User.objects.count()
    })
######################################################


####################### blood donors #################
@api_view(["GET"])
def blood_donors(request):
    donors = Profile.objects.filter(
        share_location_for_blood=True,
        latitude__isnull=False,
        longitude__isnull=False
    )

    data = []
    for donor in donors:
        data.append({
            "id": donor.user.id,
            "username": donor.user.username,
            "city": donor.city,
            "latitude": donor.latitude,
            "longitude": donor.longitude,
            "age": donor.age,
            "gender": donor.gender,
            "phone": donor.phone_number
        })

    return Response(data)
######################################################

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "latitude": getattr(user, "latitude", None),  # if you store it in your model
        "longitude": getattr(user, "longitude", None),
        "city": getattr(user, "city", None),
        "blood_group": getattr(user, "blood_group", None),
    }
    return Response(data)

