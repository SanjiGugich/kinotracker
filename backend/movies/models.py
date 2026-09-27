from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

class Movie(models.Model):
    title = models.CharField(max_length=220)
    original_title = models.CharField(max_length=220, blank=True)
    year = models.PositiveSmallIntegerField()
    description = models.TextField()
    genre = models.CharField(max_length=160)
    country = models.CharField(max_length=120, blank=True)
    director = models.CharField(max_length=160, blank=True)
    actors = models.TextField(blank=True, help_text='Актёрский состав')
    duration = models.PositiveSmallIntegerField(help_text='Продолжительность в минутах', default=120)
    poster = models.ImageField(upload_to='posters/')
    still_image = models.ImageField(upload_to='stills/', blank=True)
    trailer_url = models.URLField(blank=True)
    site_rating = models.DecimalField(max_digits=3, decimal_places=1, validators=[MinValueValidator(0), MaxValueValidator(10)])
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-year', '-site_rating', 'title']

    def __str__(self): return f'{self.title} ({self.year})'

class UserMovie(models.Model):
    class Status(models.TextChoices):
        PLANNED='planned','Хочу посмотреть'
        WATCHING='watching','Смотрю'
        WATCHED='watched','Просмотрено'
        POSTPONED='postponed','Отложено'
        DROPPED='dropped','Брошено'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='movie_library')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='user_entries')
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.PLANNED)
    favorite = models.BooleanField(default=False)
    user_rating = models.PositiveSmallIntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(10)])
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['user','movie'], name='unique_user_movie')]
        ordering = ['-updated_at']

    def __str__(self): return f'{self.user} — {self.movie}'
