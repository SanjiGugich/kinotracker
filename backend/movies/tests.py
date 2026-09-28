from django.test import TestCase
from rest_framework.test import APIClient

from .models import Movie, UserMovie


class AccountPersistenceTests(TestCase):
    def setUp(self):
        self.movie = Movie.objects.create(
            title="Test Movie",
            year=2026,
            description="x",
            genre="Drama",
            duration=100,
            site_rating=8.0,
        )

    def register_client(self):
        client = APIClient()
        response = client.post(
            "/api/auth/register/",
            {
                "username": "tester",
                "first_name": "Test",
                "email": "test@example.com",
                "password": "secret12",
                "password_confirm": "secret12",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        client.credentials(HTTP_AUTHORIZATION=f"Token {response.data['token']}")
        return client

    def test_register_and_persist_library_entry(self):
        client = self.register_client()
        response = client.post(
            "/api/library/",
            {
                "movie_id": self.movie.id,
                "status": "postponed",
                "favorite": True,
                "user_rating": 9,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        entry = UserMovie.objects.get()
        self.assertEqual(entry.status, UserMovie.Status.POSTPONED)
        self.assertTrue(entry.favorite)
        self.assertEqual(entry.user_rating, 9)

        response = client.get("/api/library/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["movie"]["title"], "Test Movie")

    def test_unknown_movie_returns_404(self):
        client = self.register_client()
        response = client.post(
            "/api/library/",
            {"movie_id": 999999, "status": "planned"},
            format="json",
        )
        self.assertEqual(response.status_code, 404)
