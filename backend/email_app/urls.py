from django.urls import path
from .views import test_email

urlpatterns = [
    path("test-email/", test_email),
]
