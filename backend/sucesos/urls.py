from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categorias', views.CategoriaViewSet, basename='categoria')
router.register(r'sucesos', views.SucesoViewSet, basename='suceso')

urlpatterns = [
    path('', include(router.urls)),
    # Identificación sin contraseña (MVP)
    path('login-simple/', views.login_simple, name='login-simple'),
    # Sistema de votación
    path('votar/', views.votar, name='votar'),
    # Favoritos
    path('favorito/', views.favorito_toggle, name='favorito-toggle'),
    path('favoritos/', views.mis_favoritos, name='mis-favoritos'),
]

# Endpoints generados por el router:
# GET  /api/categorias/
# GET  /api/categorias/{id}/
# GET  /api/sucesos/                         ?categoria=slug &provincia= &search= &ordering=
# GET  /api/sucesos/{slug}/
# GET  /api/sucesos/{slug}/valoracion/
# POST /api/login-simple/
# POST /api/votar/
# POST /api/favorito/
# GET  /api/favoritos/?usuario_id=<id>
