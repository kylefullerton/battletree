from django.http import JsonResponse
from .models import Pokemon
from .serializers import PokemonSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET', 'POST'])
def pokemon_list(request, format=None):
    if request.method == 'GET':
        pokemon = Pokemon.objects.all()
        serializer = PokemonSerializer(pokemon, many=True)
        return Response(serializer.data)
    
    if isinstance(request.data, list):
        serializer = PokemonSerializer(data = request.data, many=True)
    else:
        serializer = PokemonSerializer(data = request.data)
        
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
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