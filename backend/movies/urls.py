from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    MovieViewSet, RegisterView, LoginView, LogoutView, MeView, ProfileView,
    LibraryView, LibraryItemView, HealthView,
)

router = DefaultRouter()
router.register('movies', MovieViewSet, basename='movie')

urlpatterns = [
    path('', include(router.urls)),
    path('health/', HealthView.as_view()),
    path('auth/register/', RegisterView.as_view()),
    path('auth/login/', LoginView.as_view()),
    path('auth/logout/', LogoutView.as_view()),
    path('auth/me/', MeView.as_view()),
    path('auth/profile/', ProfileView.as_view()),
    path('library/', LibraryView.as_view()),
    path('library/<int:movie_id>/', LibraryItemView.as_view()),
]
