from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('movies', '0002_movie_actors'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usermovie',
            name='status',
            field=models.CharField(
                choices=[
                    ('planned', 'Хочу посмотреть'),
                    ('watching', 'Смотрю'),
                    ('watched', 'Просмотрено'),
                    ('postponed', 'Отложено'),
                    ('dropped', 'Брошено'),
                ],
                default='planned',
                max_length=12,
            ),
        ),
    ]
