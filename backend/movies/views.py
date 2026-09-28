from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Avg, Q
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Movie, UserMovie
from .serializers import (
    MovieSerializer,
    RegisterSerializer,
    UserMovieSerializer,
    UserSerializer,
)


class HealthView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "ok", "movies": Movie.objects.count()})


class MovieViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Movie.objects.all()
        search = self.request.query_params.get("search")
        genre = self.request.query_params.get("genre")
        year = self.request.query_params.get("year")

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(original_title__icontains=search)
                | Q(director__icontains=search)
                | Q(actors__icontains=search)
                | Q(genre__icontains=search)
            )
        if genre:
            queryset = queryset.filter(genre__icontains=genre)
        if year:
            queryset = queryset.filter(year=year)

        return queryset

    @action(detail=False, methods=["get"])
    def recommended(self, request):
        movies = Movie.objects.order_by("?")[:3]
        return Response(self.get_serializer(movies, many=True).data)

    @action(detail=False, methods=["get"])
    def popular(self, request):
        movies = Movie.objects.order_by("-site_rating", "-year")[:12]
        return Response(self.get_serializer(movies, many=True).data)

    @action(detail=False, methods=["get"])
    def genres(self, request):
        genres = sorted(
            {
                genre.strip()
                for value in Movie.objects.values_list("genre", flat=True)
                for genre in value.split("/")
                if genre.strip()
            }
        )
        return Response(genres)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {"token": token.key, "user": UserSerializer(user).data},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        login = request.data.get("username", "").strip()
        password = request.data.get("password", "")
        username = login

        if "@" in login:
            found = User.objects.filter(email__iexact=login).only("username").first()
            if found:
                username = found.username

        user = authenticate(username=username, password=password)
        if not user:
            return Response(
                {"detail": "Неверный логин/email или пароль"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user": UserSerializer(user).data})


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
            "total": library.count(),
            "planned": library.filter(status=UserMovie.Status.PLANNED).count(),
            "watching": library.filter(status=UserMovie.Status.WATCHING).count(),
            "watched": library.filter(status=UserMovie.Status.WATCHED).count(),
            "postponed": library.filter(status=UserMovie.Status.POSTPONED).count(),
            "dropped": library.filter(status=UserMovie.Status.DROPPED).count(),
            "favorites": library.filter(favorite=True).count(),
            "average_rating": library.filter(user_rating__isnull=False).aggregate(
                value=Avg("user_rating")
            )["value"],
        }
        return {"user": UserSerializer(user).data, "stats": stats}

    def get(self, request):
        return Response(self._payload(request.user))

    def patch(self, request):
        user = request.user
        username = request.data.get("username", user.username).strip()
        email = request.data.get("email", user.email).strip().lower()
        first_name = request.data.get("first_name", user.first_name).strip()

        if (
            username != user.username
            and User.objects.filter(username__iexact=username).exclude(pk=user.pk).exists()
        ):
            return Response({"detail": "Этот логин уже занят."}, status=400)

        if email and User.objects.filter(email__iexact=email).exclude(pk=user.pk).exists():
            return Response({"detail": "Этот email уже используется."}, status=400)

        user.username = username
        user.email = email
        user.first_name = first_name
        user.save(update_fields=["username", "email", "first_name"])
        return Response(self._payload(user))


class LibraryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        entries = UserMovie.objects.filter(user=request.user).select_related("movie")
        return Response(
            UserMovieSerializer(entries, many=True, context={"request": request}).data
        )

    def post(self, request):
        movie_id = request.data.get("movie_id")
        if not movie_id:
            return Response(
                {"detail": "movie_id обязателен"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        movie = Movie.objects.filter(pk=movie_id).first()
        if movie is None:
            return Response(
                {"detail": "Фильм не найден."},
                status=status.HTTP_404_NOT_FOUND,
            )

        entry, _ = UserMovie.objects.get_or_create(user=request.user, movie=movie)
        serializer = UserMovieSerializer(
            entry,
            data=request.data,
            partial=True,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user, movie=movie)
        return Response(serializer.data)


class LibraryItemView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, movie_id):
        UserMovie.objects.filter(user=request.user, movie_id=movie_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
