from django.contrib import admin
from .models import Movie, UserMovie

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title','year','genre','site_rating','is_featured')
    list_filter = ('year','genre','is_featured')
    search_fields = ('title','original_title','director')
    ordering = ('-year',)

@admin.register(UserMovie)
class UserMovieAdmin(admin.ModelAdmin):
    list_display = ('user','movie','status','favorite','user_rating','updated_at')
    list_filter = ('status','favorite')
    search_fields = ('user__username','movie__title')
