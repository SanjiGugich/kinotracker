from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Avg, Q
from django.http import HttpResponse
from html import escape
import hashlib
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Movie, UserMovie
from .serializers import MovieSerializer, RegisterSerializer, UserMovieSerializer, UserSerializer

class HealthView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return Response({'status':'ok','movies':Movie.objects.count()})

class MovieViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Movie.objects.all()
        q = self.request.query_params.get('search')
        genre = self.request.query_params.get('genre')
        year = self.request.query_params.get('year')
        if q:
            qs = qs.filter(
                Q(title__icontains=q) | Q(original_title__icontains=q) |
                Q(director__icontains=q) | Q(actors__icontains=q) | Q(genre__icontains=q)
            )
        if genre:
            qs = qs.filter(genre__icontains=genre)
        if year:
            qs = qs.filter(year=year)
        return qs

    @action(detail=False, methods=['get'])
    def recommended(self, request):
        qs = Movie.objects.order_by('?')[:3]
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=['get'])
    def latest(self, request):
        qs = Movie.objects.order_by('-year','-site_rating')[:3]
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=['get'])
    def popular(self, request):
        qs = Movie.objects.order_by('-site_rating','-year')[:12]
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=['get'])
    def genres(self, request):
        genres = sorted({g.strip() for raw in Movie.objects.values_list('genre', flat=True) for g in raw.split('/') if g.strip()})
        return Response(genres)

    def _art(self, movie, wide=False):
        digest = hashlib.sha256(movie.title.encode('utf-8')).hexdigest()
        color_a = f'#{digest[0:6]}'
        color_b = f'#{digest[6:12]}'
        title = escape(movie.title)
        original = escape(movie.original_title or '')
        if wide:
            w, h = 1280, 720
            title_y, sub_y, size = 535, 592, 58
        else:
            w, h = 720, 1080
            title_y, sub_y, size = 835, 895, 46
        svg = (
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'
            f'<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="{color_a}"/>'
            f'<stop offset="1" stop-color="{color_b}"/></linearGradient>'
            '<radialGradient id="r"><stop stop-color="#ffffff" stop-opacity=".22"/>'
            '<stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs>'
            '<rect width="100%" height="100%" fill="url(#g)"/><circle cx="78%" cy="25%" r="35%" fill="url(#r)"/>'
            '<g stroke="#fff" stroke-opacity=".14" fill="none" stroke-width="3"><circle cx="50%" cy="42%" r="25%"/>'
            '<circle cx="50%" cy="42%" r="17%"/><path d="M10% 42%H90%M50% 8%V76%M23% 15%L77% 69%M77% 15%L23% 69%"/></g>'
            '<rect x="6%" y="72%" width="88%" height="22%" rx="26" fill="#05070b" fill-opacity=".62"/>'
            f'<text x="9%" y="{title_y}" fill="#fff" font-family="Arial,sans-serif" font-size="{size}" font-weight="700">{title[:34]}</text>'
            f'<text x="9%" y="{sub_y}" fill="#e5e7eb" font-family="Arial,sans-serif" font-size="24">{original[:42]} · {movie.year} · ★ {movie.site_rating}</text>'
            '</svg>'
        )
        return svg

    @action(detail=True, methods=['get'], url_path='poster-svg')
    def poster_svg(self, request, pk=None):
        movie = self.get_object()
        return HttpResponse(self._art(movie, wide=False), content_type='image/svg+xml; charset=utf-8')

    @action(detail=True, methods=['get'], url_path='still-svg')
    def still_svg(self, request, pk=None):
        movie = self.get_object()
        return HttpResponse(self._art(movie, wide=True), content_type='image/svg+xml; charset=utf-8')

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token':token.key,'user':UserSerializer(user).data}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        login = request.data.get('username','').strip()
        password = request.data.get('password','')
        username = login
        if '@' in login:
            found = User.objects.filter(email__iexact=login).only('username').first()
            if found:
                username = found.username
        user = authenticate(username=username, password=password)
        if not user:
            return Response({'detail':'Неверный логин/email или пароль'}, status=status.HTTP_400_BAD_REQUEST)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token':token.key,'user':UserSerializer(user).data})

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        if request.auth:
            request.auth.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class MeView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response(UserSerializer(request.user).data)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def _payload(self, user):
        library = UserMovie.objects.filter(user=user)
        stats = {
            'total': library.count(),
            'planned': library.filter(status=UserMovie.Status.PLANNED).count(),
            'watching': library.filter(status=UserMovie.Status.WATCHING).count(),
            'watched': library.filter(status=UserMovie.Status.WATCHED).count(),
            'postponed': library.filter(status=UserMovie.Status.POSTPONED).count(),
            'dropped': library.filter(status=UserMovie.Status.DROPPED).count(),
            'favorites': library.filter(favorite=True).count(),
            'average_rating': library.filter(user_rating__isnull=False).aggregate(v=Avg('user_rating'))['v'],
        }
        return {'user':UserSerializer(user).data, 'stats':stats}

    def get(self, request):
        return Response(self._payload(request.user))

    def patch(self, request):
        user = request.user
        username = request.data.get('username', user.username).strip()
        email = request.data.get('email', user.email).strip().lower()
        first_name = request.data.get('first_name', user.first_name).strip()
        if username != user.username and User.objects.filter(username__iexact=username).exclude(pk=user.pk).exists():
            return Response({'detail':'Этот логин уже занят.'}, status=400)
        if email and User.objects.filter(email__iexact=email).exclude(pk=user.pk).exists():
            return Response({'detail':'Этот email уже используется.'}, status=400)
        user.username, user.email, user.first_name = username, email, first_name
        user.save(update_fields=['username','email','first_name'])
        return Response(self._payload(user))

class LibraryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = UserMovie.objects.filter(user=request.user).select_related('movie')
        return Response(UserMovieSerializer(qs, many=True, context={'request':request}).data)

    def post(self, request):
        movie_id = request.data.get('movie_id')
        if not movie_id:
            return Response({'detail':'movie_id обязателен'}, status=400)
        entry, _ = UserMovie.objects.get_or_create(user=request.user, movie_id=movie_id)
        serializer = UserMovieSerializer(entry, data=request.data, partial=True, context={'request':request})
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data)

class LibraryItemView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, movie_id):
        UserMovie.objects.filter(user=request.user, movie_id=movie_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
