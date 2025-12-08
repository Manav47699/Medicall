from rest_framework.decorators import api_view
from rest_framework.response import Response
from posts.models import Post_model
from posts.serializers import PostSerializer

@api_view(['GET'])
def Post_view(request):
    posts = Post_model.objects.filter(scope='global').order_by('-created_at')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)
    