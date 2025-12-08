from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Post_model, Comment, Upvote
from .serializers import PostSerializer, CommentSerializer, UpvoteSerializer
from django.contrib.auth.models import User
from groups.models import Group
# ---------------- Get All Posts ----------------
@api_view(['GET', 'POST'])
def Post_view(request):
    if request.method == 'GET':
        posts = Post_model.objects.all().order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        user_id = request.POST.get('user')
        description = request.POST.get('description')
        scope = request.POST.get('scope', 'local')
        group_id = request.POST.get('group')
        photo = request.FILES.get('photo')

        if not user_id or not description:
            return Response({"error": "User and description are required"}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        group = None
        if group_id:
            try:
                group = Group.objects.get(id=group_id)
            except Group.DoesNotExist:
                return Response({"error": "Group not found"}, status=404)

        post = Post_model.objects.create(
            user=user,
            description=description,
            scope=scope,
            group=group,
            photo=photo
        )
        serializer = PostSerializer(post)
        return Response(serializer.data, status=201)


# ---------------- Create a Comment ----------------
@api_view(["POST"])
def create_comment(request):
    user_id = request.data.get("user_id")
    post_id = request.data.get("post_id")
    text = request.data.get("text")

    if not all([user_id, post_id, text]):
        return Response({"error": "user_id, post_id, and text are required"}, status=400)

    try:
        user = User.objects.get(id=user_id)
        post = Post_model.objects.get(id=post_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except Post_model.DoesNotExist:
        return Response({"error": "Post not found"}, status=404)

    comment = Comment.objects.create(user=user, post=post, text=text)
    serializer = CommentSerializer(comment)
    return Response(serializer.data, status=201)


# ---------------- Upvote a Post ----------------
@api_view(["POST"])
def upvote_post(request):
    user_id = request.data.get("user_id")
    post_id = request.data.get("post_id")

    if not all([user_id, post_id]):
        return Response({"error": "user_id and post_id are required"}, status=400)

    try:
        user = User.objects.get(id=user_id)
        post = Post_model.objects.get(id=post_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except Post_model.DoesNotExist:
        return Response({"error": "Post not found"}, status=404)

    # Prevent double upvote
    upvote, created = Upvote.objects.get_or_create(user=user, post=post)
    if created:
        return Response({"message": "Upvoted!"})
    else:
        return Response({"message": "Already upvoted"}, status=400)


# ---------------- Get Comments for a Single Post ----------------
@api_view(["GET"])
def post_comments(request, post_id):
    try:
        post = Post_model.objects.get(id=post_id)
    except Post_model.DoesNotExist:
        return Response({"error": "Post not found"}, status=404)

    comments = post.comments.all().order_by("-created_at")
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)


# ---------------- Get Posts for a Specific Group ----------------
@api_view(["GET"])
def group_posts(request, group_id):
    from groups.models import Group

    try:
        group = Group.objects.get(id=group_id)
    except Group.DoesNotExist:
        return Response({"error": "Group not found"}, status=404)

    posts = Post_model.objects.filter(group=group).order_by("-created_at")
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)
