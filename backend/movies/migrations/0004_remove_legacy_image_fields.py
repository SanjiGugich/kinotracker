from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("movies", "0003_usermovie_statuses"),
    ]

    operations = [
        migrations.RemoveField(model_name="movie", name="poster"),
        migrations.RemoveField(model_name="movie", name="still_image"),
        migrations.RemoveField(model_name="movie", name="is_featured"),
    ]
