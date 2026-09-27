from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import connection
from movies.models import Movie, UserMovie

class Command(BaseCommand):
    help = 'Заполняет каталог только если база фильмов пуста.'

    def handle(self, *args, **options):
        self.stdout.write(f'Database backend: {connection.vendor}')
        self.stdout.write(f'Persistent data: users={get_user_model().objects.count()}, library_entries={UserMovie.objects.count()}')
        count = Movie.objects.count()
        if count:
            self.stdout.write(self.style.SUCCESS(f'Catalog OK: {count} movies. Seed skipped.'))
            return
        self.stdout.write('Movie catalog is empty. Seeding...')
        call_command('seed_movies')
