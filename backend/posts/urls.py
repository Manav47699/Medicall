from django.urls import path
from . import views

urlpatterns = [
    # ---------------- Get all posts ----------------
    path('', views.Post_view, name='Post_view'),

    # ---------------- Create a comment ----------------
    path('comment/', views.create_comment, name='create_comment'),

    # ---------------- Upvote a post ----------------
    path('upvote/', views.upvote_post, name='upvote_post'),

    # ---------------- Get comments for a single post ----------------
    path('<int:post_id>/comments/', views.post_comments, name='post_comments'),

    # ---------------- Get posts for a specific group ----------------
    path('group/<int:group_id>/', views.group_posts, name='group_posts'),
]
