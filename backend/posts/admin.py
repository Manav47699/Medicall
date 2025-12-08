from django.contrib import admin
from .models import Post_model, Comment, Upvote

# Register your models here.

admin.site.register(Post_model)
admin.site.register(Comment)
admin.site.register(Upvote)

