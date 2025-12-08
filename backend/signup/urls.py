from django.urls import path
from . import views

urlpatterns = [
#this is for fetching all the data
    path('signup/', views.signup, name='signup'),
]