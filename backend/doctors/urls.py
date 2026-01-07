# from django.urls import path
# from . import views

# urlpatterns = [
#     path('', views.doctors_list_view, name='doctors_list'),  # List all doctors (you need to create this)
#     path('<int:doctor_id>/', views.doctor_detail_view, name='doctor_detail'),
#     path('<int:doctor_id>/checkout/<int:appointment_id>/', views.create_checkout_session, name='create_checkout_session'),
#     path('success/', views.payment_success, name='payment_success'),
# ]

from django.urls import path
from . import views

urlpatterns = [
    # Doctors
    path("api/doctors/", views.doctors_list_view, name="doctors-list"),

    # Appointments
    path(
        "api/doctors/<int:doctor_id>/appointment/",
        views.create_appointment,
        name="create-appointment"
    ),

    # Stripe
    path(
        "api/stripe/create-checkout-session/",
        views.create_checkout_session,
        name="create-checkout-session"
    ),

    path(
        "api/stripe/webhook/",
        views.stripe_webhook,
        name="stripe-webhook"
    ),
]
