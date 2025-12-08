from rest_framework import serializers
from .models import Post_model, Comment, Upvote
from django.contrib.auth.models import User

# ---------------- Post Serializer ----------------
class PostSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # display username
    group = serializers.StringRelatedField(read_only=True)  # show group name

    upvotes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Post_model
        fields = "__all__"  # include all fields + new ones

    def get_upvotes_count(self, obj):
        return obj.upvotes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()


# ---------------- Comment Serializer ----------------
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # show username

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'text', 'created_at']
        read_only_fields = ['user', 'post', 'created_at']


# ---------------- Upvote Serializer ----------------
class UpvoteSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Upvote
        fields = ['id', 'user', 'post']
        read_only_fields = ['user', 'post']
