from pathlib import Path
import os
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'local-dev-key-change-in-production')
DEBUG = os.getenv('DJANGO_DEBUG', '1') == '1'

def env_list(name, default=''):
    return [x.strip() for x in os.getenv(name, default).split(',') if x.strip()]

ALLOWED_HOSTS = env_list('DJANGO_ALLOWED_HOSTS', '127.0.0.1,localhost')

INSTALLED_APPS = [
    'django.contrib.admin', 'django.contrib.auth', 'django.contrib.contenttypes',
    'django.contrib.sessions', 'django.contrib.messages', 'django.contrib.staticfiles',
    'corsheaders', 'rest_framework', 'rest_framework.authtoken', 'movies',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'kinotrack.urls'
TEMPLATES = [{
    'BACKEND':'django.template.backends.django.DjangoTemplates', 'DIRS':[], 'APP_DIRS':True,
    'OPTIONS':{'context_processors':[
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages',
    ]}
}]
WSGI_APPLICATION = 'kinotrack.wsgi.application'

DATABASE_URL = os.getenv('DATABASE_URL', '').strip()
if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
    DATABASES = {'default': {'ENGINE':'django.db.backends.sqlite3', 'NAME':BASE_DIR/'db.sqlite3'}}

AUTH_PASSWORD_VALIDATORS = []
LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'Europe/Moscow'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
STORAGES = {
    'default': {'BACKEND':'django.core.files.storage.FileSystemStorage'},
    'staticfiles': {'BACKEND':'whitenoise.storage.CompressedManifestStaticFilesStorage'},
}
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOWED_ORIGINS = env_list(
    'CORS_ALLOWED_ORIGINS',
    'http://127.0.0.1:5173,http://localhost:5173'
)
CSRF_TRUSTED_ORIGINS = env_list('CSRF_TRUSTED_ORIGINS', '')

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES':['rest_framework.authentication.TokenAuthentication'],
    'DEFAULT_PERMISSION_CLASSES':['rest_framework.permissions.AllowAny'],
}

if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    USE_X_FORWARDED_HOST = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
