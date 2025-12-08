from django.db import models
from django.contrib.auth.models import User

class Group(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Members
    members = models.ManyToManyField(User, related_name='groups_joined')

    def __str__(self):
        return self.name
