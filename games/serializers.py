from rest_framework import serializers
from .models import *

class PokemonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pokemon
        fields = ['id', 'name', 'displayName', 'gameName', 'type1', 'type2', 'item', 'attack1', 'attack2', 'attack3', 'attack4',
                   'nature', 'ev1', 'ev2', 'ev3', 'ev4', 'ev5', 'ev6']

class TrainerSerializer(serializers.ModelSerializer):
    pokemon = PokemonSerializer(many=True, required=False)

    class Meta:
        model = Trainer
        fields = ['id', 'name', 'gameName', 'trainerClass', 'imageName', 'pokemon']