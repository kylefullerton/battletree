# Generated by Django 4.2.3 on 2023-09-06 05:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='trainer',
            name='imageName',
            field=models.CharField(default='', max_length=250),
        ),
    ]