from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Movie, UserMovie

class MovieSerializer(serializers.ModelSerializer):
    poster_url = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = [
            'id','title','original_title','year','description','genre','country','director',
            'actors','duration','poster_url','trailer_url','site_rating','is_featured'
        ]

    def _asset_url(self, obj, kind):
        path = f'/api/movies/{obj.pk}/{kind}-svg/'
        request = self.context.get('request')
        return request.build_absolute_uri(path) if request else path

    def get_poster_url(self, obj):
        return self._asset_url(obj, 'poster')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=False, allow_blank=True, max_length=150)

    class Meta:
        model = User
        fields = ['username','first_name','email','password','password_confirm']

    def validate_email(self, value):
        value = value.strip().lower()
        if value and User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('Пользователь с таким email уже зарегистрирован.')
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError({'password_confirm':'Пароли не совпадают.'})
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','first_name','email','date_joined']
        read_only_fields = ['id','date_joined']

class UserMovieSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    movie_id = serializers.PrimaryKeyRelatedField(queryset=Movie.objects.all(), source='movie', write_only=True)

    class Meta:
        model = UserMovie
        fields = ['id','movie','movie_id','status','favorite','user_rating','updated_at']
        read_only_fields = ['id','updated_at']
