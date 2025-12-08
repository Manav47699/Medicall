from django.urls import path
from . import views

urlpatterns = [
    path('', views.doctors_list_view, name='doctors_list'),  # List all doctors (you need to create this)
    path('<int:doctor_id>/', views.doctor_detail_view, name='doctor_detail'),
    path('<int:doctor_id>/checkout/<int:appointment_id>/', views.create_checkout_session, name='create_checkout_session'),
    path('success/', views.payment_success, name='payment_success'),
]
