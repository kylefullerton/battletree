from django.db import models
    
class Pokemon(models.Model):
    name = models.CharField(max_length=250)
    displayName = models.CharField(max_length=250)
    gameName = models.CharField(max_length=250)
    type1 = models.CharField(max_length=100)
    type2 = models.CharField(max_length=100, blank=True, default="")
    item = models.CharField(max_length=150, blank=True, default="")
    attack1 = models.CharField(max_length=250)
    attack2 = models.CharField(max_length=250, blank=True, default="")
    attack3 = models.CharField(max_length=250, blank=True, default="")
    attack4 = models.CharField(max_length=250, blank=True, default="")
    nature = models.CharField(max_length=100)
    ev1 = models.CharField(max_length=100, blank=True, default="")
    ev2 = models.CharField(max_length=100, blank=True, default="")
    ev3 = models.CharField(max_length=100, blank=True, default="")
    ev4 = models.CharField(max_length=100, blank=True, default="")
    ev5 = models.CharField(max_length=100, blank=True, default="")
    ev6 = models.CharField(max_length=100, blank=True, default="")

    def __str__(self):
        return self.name

class Trainer(models.Model):
    name = models.CharField(max_length=250)
    gameName = models.CharField(max_length=250)
    trainerClass = models.CharField(max_length=250)
    imageName = models.CharField(max_length=250, default="")
    pokemon = models.ManyToManyField(Pokemon)

    def __str__(self):
        return self.trainerClass + " " + self.name