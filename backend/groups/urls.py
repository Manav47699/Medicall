from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_groups, name='list_groups'),
    path('create/', views.create_group, name='create_group'),
    path('<int:group_id>/join/', views.join_group, name='join_group'),
]
