# Generated by Django 4.2.3 on 2023-09-13 21:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0003_rename_imagename_trainer_subclass'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trainer',
            name='subClass',
            field=models.CharField(blank=True, default='', max_length=250),
        ),
    ]
