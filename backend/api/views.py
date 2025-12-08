# backend/users/views.py

from django.shortcuts import redirect
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from .serializer import UserSerializer
from allauth.socialaccount.models import SocialToken, SocialAccount
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

User = get_user_model()

# -------------------------
# User Registration
# -------------------------
class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

# -------------------------
# User Detail / Update
# -------------------------
class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# -------------------------
# Google Login Callback
# -------------------------
@login_required
def google_login_callback(request):
    user = request.user

    social_accounts = SocialAccount.objects.filter(user=user, provider='google')
    if not social_accounts.exists():
        return redirect('http://localhost:3000/signin')

    social_account = social_accounts.first()
    token_obj = SocialToken.objects.filter(account=social_account).first()

    if token_obj:
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        # Redirect to frontend with token
        frontend_url = f'http://localhost:3000/google-callback?access={access_token}&refresh={str(refresh)}'
        return redirect(frontend_url)
    else:
        return redirect('http://localhost:3000/signin')

# -------------------------
# Validate Google Token (optional)
# -------------------------
@csrf_exempt
def validate_google_token(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            google_access_token = data.get('token')
            if not google_access_token:
                return JsonResponse({'detail': 'Access Token is missing'}, status=400)

            # Here you can verify token with Google API if needed
            return JsonResponse({'valid': True})
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON'}, status=400)

    return JsonResponse({'detail': 'Method not allowed'}, status=405)
