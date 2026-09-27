from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("movies", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="movie",
            name="actors",
            field=models.TextField(blank=True, help_text="Актёрский состав"),
        ),
    ]
