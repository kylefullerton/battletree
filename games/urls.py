"""
URL configuration for games project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
from django.urls import path
from games import views
from rest_framework.urlpatterns import format_suffix_patterns
from django.views.generic.base import TemplateView

urlpatterns = [
    path('pokemon/', views.pokemon_list),
    path('pokemon/<int:id>', views.pokemon_detail),
    path('pokemon/<str:game>', views.pokemon_game_list),
    path('trainer/', views.trainer_list),
    path('trainer/<int:id>', views.trainer_detail),
    path('trainer/<str:game>', views.trainer_game_list),
    path('', TemplateView.as_view(template_name='index.html'))
]

urlpatterns = format_suffix_patterns(urlpatterns)