from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
#from api.views import UserCreate, UserDetailView, google_login_callback, validate_google_token
#from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

#     # User registration
#     path('api/user/register/', UserCreate.as_view(), name="user_create"),

#     # JWT token endpoints
#     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('api/token/refresh/', TokenRefreshView.as_view(), name="token_refresh"),

#     # DRF browsable API login
#     path('api-auth/', include('rest_framework.urls')),

#     # Google OAuth
#     path('accounts/', include('allauth.urls')),
#     path('callback/', google_login_callback, name='callback'),

#     # User details
#     path('api/auth/user/', UserDetailView.as_view(), name='user_detail'),

#     # Optional: Validate Google token
#     path('api/google/validate_token/', validate_google_token, name='validate_token'),
    path('api/', include('signup.urls')),
    #path('accounts/', include('allauth.urls')),
    path('posts/', include('posts.urls')),
    path('global_posts/', include('global_posts.urls')),
    path('groups/', include('groups.urls')),
    path('doctors/', include('doctors.urls')),
    path('accounts/', include('accounts.urls')),
    #path("appointments/", include("appointments.urls")),
    







] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
