from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Group
from .serializers import GroupSerializer
from django.contrib.auth.models import User

# ---------------- List All Groups ----------------
@api_view(["GET"])
def list_groups(request):
    groups = Group.objects.all().order_by('-created_at')
    serializer = GroupSerializer(groups, many=True)
    return Response(serializer.data)


# ---------------- Create a New Group ----------------
@api_view(["POST"])
def create_group(request):
    name = request.data.get("name")
    description = request.data.get("description", "")

    if not name:
        return Response({"error": "Group name is required"}, status=400)

    group = Group.objects.create(name=name, description=description)
    serializer = GroupSerializer(group)
    return Response(serializer.data, status=201)


# ---------------- Join a Group ----------------
@api_view(["POST"])
def join_group(request, group_id):
    user_id = request.data.get("user_id")
    try:
        user = User.objects.get(id=user_id)
        group = Group.objects.get(id=group_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except Group.DoesNotExist:
        return Response({"error": "Group not found"}, status=404)

    group.members.add(user)
    return Response({"message": "Joined group!"})
