# Generated by Django 4.2.3 on 2023-09-05 19:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Pokemon',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250)),
                ('displayName', models.CharField(max_length=250)),
                ('gameName', models.CharField(max_length=250)),
                ('type1', models.CharField(max_length=100)),
                ('type2', models.CharField(blank=True, default='', max_length=100)),
                ('item', models.CharField(blank=True, default='', max_length=150)),
                ('attack1', models.CharField(max_length=250)),
                ('attack2', models.CharField(blank=True, default='', max_length=250)),
                ('attack3', models.CharField(blank=True, default='', max_length=250)),
                ('attack4', models.CharField(blank=True, default='', max_length=250)),
                ('nature', models.CharField(max_length=100)),
                ('ev1', models.CharField(blank=True, default='', max_length=100)),
                ('ev2', models.CharField(blank=True, default='', max_length=100)),
                ('ev3', models.CharField(blank=True, default='', max_length=100)),
                ('ev4', models.CharField(blank=True, default='', max_length=100)),
                ('ev5', models.CharField(blank=True, default='', max_length=100)),
                ('ev6', models.CharField(blank=True, default='', max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Trainer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250)),
                ('gameName', models.CharField(max_length=250)),
                ('trainerClass', models.CharField(max_length=250)),
                ('pokemon', models.ManyToManyField(to='games.pokemon')),
            ],
        ),
    ]
