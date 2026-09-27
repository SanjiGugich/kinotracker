from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from .models import Movie, UserMovie

class AccountPersistenceTests(TestCase):
    def setUp(self):
        self.movie = Movie.objects.create(
            title='Test Movie', year=2026, description='x', genre='Drama', duration=100,
            poster='posters/test.jpg', site_rating=8.0,
        )

    def test_register_login_and_library(self):
        client = APIClient()
        response = client.post('/api/auth/register/', {
            'username':'tester','first_name':'Test','email':'test@example.com',
            'password':'secret12','password_confirm':'secret12'
        }, format='json')
        self.assertEqual(response.status_code, 201)
        token = response.data['token']
        self.assertTrue(User.objects.filter(username='tester').exists())
        client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        response = client.post('/api/library/', {
            'movie_id':self.movie.id,'status':'watched','favorite':True,'user_rating':9
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(UserMovie.objects.get().user_rating, 9)

        second = APIClient()
        second.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        response = second.get('/api/library/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['movie']['title'], 'Test Movie')
