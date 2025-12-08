from rest_framework import serializers
from .models import Group

class GroupSerializer(serializers.ModelSerializer):
    members = serializers.StringRelatedField(many=True, read_only=True)  # ✅ serialize members as list of usernames

    class Meta:
        model = Group
        fields = "__all__"
