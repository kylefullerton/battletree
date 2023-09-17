from django.http import JsonResponse
from .models import Pokemon
from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET', 'POST'])
def pokemon_list(request, format=None):
    if request.method == 'GET':
        pokemon = Pokemon.objects.all()
        serializer = PokemonSerializer(pokemon, many=True)
        return Response(get_response_dict(serializer, "displayName"))
    
    isList = isinstance(request.data, list)
    pokemonSerializer = PokemonSerializer(data = request.data, many=isList)
    if pokemonSerializer.is_valid():
        pokemonSerializer.save()
        return Response(pokemonSerializer.data, status=status.HTTP_201_CREATED)
    print(pokemonSerializer.errors)
    return Response("Bad Request", status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
def pokemon_game_list(request, game, format=None):
    pokemon = Pokemon.objects.filter(gameName=game.capitalize())
    serializer = PokemonSerializer(pokemon, many=True)
    return Response(get_response_dict(serializer, "displayName"))

@api_view(['GET', 'POST'])
def trainer_list(request, format=None):
    if request.method == 'GET':
        trainer = Trainer.objects.all()
        serializer = ReadTrainerSerializer(trainer, many=True)
        return Response(get_response_dict(serializer, "name"))
    
    isList = isinstance(request.data, list)
    trainerSerializer = TrainerSerializer(data = request.data, many=isList)
    if trainerSerializer.is_valid():
        trainerSerializer.save()
        return Response(trainerSerializer.data, status=status.HTTP_201_CREATED)
    print(trainerSerializer.errors)
    return Response("Bad Request", status=status.HTTP_400_BAD_REQUEST)

        
@api_view(['GET'])
def trainer_game_list(request, game, format=None):
    pokemon = Trainer.objects.filter(gameName=game.capitalize())
    serializer = TrainerSerializer(pokemon, many=True)
    return Response(get_response_dict(serializer, "name"))

#Need to lookup how patch should be handled for other attributes besides pokemon
@api_view(['PATCH', 'DELETE'])
def trainer_detail(request, id, format=None):
    try:
        trainer = Trainer.objects.get(pk=id)
    except Trainer.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
    if request.method == "PATCH":
        # trainer.imageName = request.data["imageName"]
        trainerSerializer = TrainerSerializer(trainer)

        for pokemonId in request.data["pokemon"]:
            pokemonObject = Pokemon.objects.get(pk=pokemonId)
            trainer.pokemon.add(pokemonObject)
        
        return Response(trainerSerializer.data)
    else:
        trainer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['PUT','DELETE'])
def pokemon_detail(request, id, format=None):
    try:
        pokemon = Pokemon.objects.get(pk=id)
    except Pokemon.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = Pokemon(pokemon)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = PokemonSerializer(pokemon, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        pokemon.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
def add_objects(serializer):
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print(serializer.errors)
    return Response("Bad Request", status=status.HTTP_400_BAD_REQUEST)

def get_response_dict(serializer, key):
    responseDict = {}
    for object in serializer.data:
        if object[key].lower() not in responseDict:
            responseDict[object[key].lower()] = [object]
        else:
            responseDict[object[key].lower()].append(object)
    return responseDict