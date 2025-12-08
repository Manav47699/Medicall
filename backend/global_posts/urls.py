from django.urls import path
from . import views

urlpatterns = [
#this is for fetching all the data
    path('', views.Post_view, name='Post_view'),
]