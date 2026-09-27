from django.core.management.base import BaseCommand
from movies.models import Movie

class Command(BaseCommand):
    help='Проверка каталога фильмов'
    def handle(self,*args,**kwargs):
        count=Movie.objects.count()
        self.stdout.write(f'Фильмов в базе: {count}')
        for m in Movie.objects.all()[:5]:
            self.stdout.write(f'{m.title} ({m.year})')
