from django.core.management import call_command
from django.core.management.base import BaseCommand
from movies.models import Movie

class Command(BaseCommand):
    help = 'Заполняет каталог только если база фильмов пуста.'

    def handle(self, *args, **options):
        count = Movie.objects.count()
        if count:
            self.stdout.write(self.style.SUCCESS(f'Catalog OK: {count} movies. Seed skipped.'))
            return
        self.stdout.write('Movie catalog is empty. Seeding...')
        call_command('seed_movies')
