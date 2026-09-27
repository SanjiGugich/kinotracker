from django.conf import settings
from django.db import migrations, models
import django.core.validators
import django.db.models.deletion

class Migration(migrations.Migration):
    initial=True
    dependencies=[migrations.swappable_dependency(settings.AUTH_USER_MODEL)]
    operations=[
        migrations.CreateModel(name='Movie', fields=[
            ('id',models.BigAutoField(auto_created=True,primary_key=True,serialize=False,verbose_name='ID')),
            ('title',models.CharField(max_length=220)),('original_title',models.CharField(blank=True,max_length=220)),
            ('year',models.PositiveSmallIntegerField()),('description',models.TextField()),('genre',models.CharField(max_length=160)),
            ('country',models.CharField(blank=True,max_length=120)),('director',models.CharField(blank=True,max_length=160)),
            ('duration',models.PositiveSmallIntegerField(default=120,help_text='Продолжительность в минутах')),
            ('poster',models.ImageField(upload_to='posters/')),('still_image',models.ImageField(blank=True,upload_to='stills/')),('trailer_url',models.URLField(blank=True)),
            ('site_rating',models.DecimalField(decimal_places=1,max_digits=3,validators=[django.core.validators.MinValueValidator(0),django.core.validators.MaxValueValidator(10)])),
            ('is_featured',models.BooleanField(default=False)),('created_at',models.DateTimeField(auto_now_add=True)),
        ], options={'ordering':['-year','-site_rating','title']}),
        migrations.CreateModel(name='UserMovie', fields=[
            ('id',models.BigAutoField(auto_created=True,primary_key=True,serialize=False,verbose_name='ID')),
            ('status',models.CharField(choices=[('planned','Хочу посмотреть'),('watching','Смотрю'),('watched','Просмотрено')],default='planned',max_length=12)),
            ('favorite',models.BooleanField(default=False)),('user_rating',models.PositiveSmallIntegerField(blank=True,null=True,validators=[django.core.validators.MinValueValidator(1),django.core.validators.MaxValueValidator(10)])),
            ('updated_at',models.DateTimeField(auto_now=True)),
            ('movie',models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,related_name='user_entries',to='movies.movie')),
            ('user',models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,related_name='movie_library',to=settings.AUTH_USER_MODEL)),
        ], options={'ordering':['-updated_at']}),
        migrations.AddConstraint(model_name='usermovie',constraint=models.UniqueConstraint(fields=('user','movie'),name='unique_user_movie')),
    ]
