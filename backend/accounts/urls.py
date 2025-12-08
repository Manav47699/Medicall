from django.urls import path
from .views import signup_view
from .views import login_view, user_count

urlpatterns = [
    path("signup/", signup_view),
    path("login/", login_view),
    path("count/", user_count ),
]