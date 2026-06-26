from django.db.models import Avg, Count
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response

from .models import Categoria, Suceso, UsuarioVisitante, Valoracion, Favorito
from .serializers import (
    CategoriaSerializer,
    SucesoListSerializer,
    SucesoDetailSerializer,
)


class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    """Listado de todas las categorías. Solo lectura."""
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    pagination_class = None  # Siempre devuelve todas las categorías


class SucesoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet principal de sucesos.

    Endpoints generados por el router:
      GET /api/sucesos/            → lista de marcadores (SucesoListSerializer)
      GET /api/sucesos/{slug}/     → ficha completa (SucesoDetailSerializer)
      GET /api/sucesos/{slug}/valoracion/ → stats de valoración

    Filtros disponibles:
      ?categoria=slug              → filtra por slug de categoría
      ?provincia=nombre            → filtra por provincia (contiene)
      ?comunidad=nombre            → filtra por comunidad autónoma (contiene)
      ?search=texto                → búsqueda en título, descripción, localidad
      ?ordering=relevancia         → ordena por campo

    Solo devuelve sucesos en estado PUBLICADO.
    """
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titulo', 'descripcion_corta', 'localidad', 'provincia']
    ordering_fields = ['relevancia', 'created_at', 'titulo', 'nivel_misterio']
    ordering = ['-relevancia', '-created_at']
    pagination_class = None  # El mapa necesita todos los puntos de una vez.
                             # FUTURE: Añadir paginación de cursor cuando haya 1000+ sucesos.

    def get_queryset(self):
        """
        Queryset base: solo PUBLICADOS, con anotaciones de valoración para
        evitar N+1 queries al serializar la lista del mapa.
        """
        qs = (
            Suceso.objects
            .filter(estado='PUBLICADO')
            .select_related('categoria')
            .prefetch_related('imagenes', 'fuentes')
            .annotate(
                valoracion_media_ann=Avg('valoraciones__puntuacion'),
                total_votos_ann=Count('valoraciones', distinct=True),
            )
        )

        # Filtro por slug de categoría
        categoria_slug = self.request.query_params.get('categoria')
        if categoria_slug:
            qs = qs.filter(categoria__slug=categoria_slug)

        # Filtro por provincia (búsqueda parcial, case-insensitive)
        provincia = self.request.query_params.get('provincia')
        if provincia:
            qs = qs.filter(provincia__icontains=provincia)

        # Filtro por comunidad autónoma
        comunidad = self.request.query_params.get('comunidad')
        if comunidad:
            qs = qs.filter(comunidad_autonoma__icontains=comunidad)

        return qs

    def get_serializer_class(self):
        if self.action == 'list':
            return SucesoListSerializer
        return SucesoDetailSerializer

    @action(detail=True, methods=['get'], url_path='valoracion')
    def valoracion(self, request, slug=None):
        """
        GET /api/sucesos/{slug}/valoracion/
        Devuelve la valoración media y el número de votos del suceso.
        """
        suceso = self.get_object()
        stats = suceso.valoraciones.aggregate(
            media=Avg('puntuacion'),
            total=Count('id')
        )
        return Response({
            'suceso_id': suceso.id,
            'suceso_slug': suceso.slug,
            'valoracion_media': round(stats['media'] or 0, 1),
            'total_votos': stats['total'],
        })


@api_view(['POST'])
def login_simple(request):
    """
    POST /api/login-simple/
    Identificación sin contraseña para el MVP.

    Body: { "nick": "string", "email": "string" }
    - Si el email ya existe: reutiliza el usuario (y actualiza el nick si cambió).
    - Si no existe: crea un nuevo UsuarioVisitante.

    Devuelve: { id, nick, email, nuevo }

    FUTURE: Para autenticación completa con contraseñas y JWT:
    1. pip install djangorestframework-simplejwt
    2. Reemplaza UsuarioVisitante por django.contrib.auth.User
    3. Usa simplejwt.views.TokenObtainPairView
    4. El frontend guarda el token JWT en localStorage
    5. El interceptor de Axios inyecta: Authorization: Bearer <token>
    """
    nick = request.data.get('nick', '').strip()
    email = request.data.get('email', '').strip().lower()

    if not nick or not email:
        return Response(
            {'error': 'Los campos nick y email son obligatorios.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(nick) > 50:
        return Response(
            {'error': 'El nick no puede superar los 50 caracteres.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        validate_email(email)
    except ValidationError:
        return Response(
            {'error': 'El formato del email no es válido.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    usuario, creado = UsuarioVisitante.objects.get_or_create(
        email=email,
        defaults={'nick': nick}
    )

    # Si ya existía con un nick diferente, lo actualizamos
    if not creado and usuario.nick != nick:
        usuario.nick = nick
        usuario.save(update_fields=['nick'])

    return Response({
        'id': usuario.id,
        'nick': usuario.nick,
        'email': usuario.email,
        'nuevo': creado,
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def votar(request):
    """
    POST /api/votar/
    Crea o actualiza una valoración de usuario sobre un suceso.

    Body: { "usuario_id": int, "suceso_id": int, "puntuacion": int (1-5) }
    Devuelve la nueva valoración media y el total de votos del suceso.
    """
    usuario_id = request.data.get('usuario_id')
    suceso_id = request.data.get('suceso_id')
    puntuacion = request.data.get('puntuacion')

    if not all([usuario_id, suceso_id, puntuacion is not None]):
        return Response(
            {'error': 'Faltan campos obligatorios: usuario_id, suceso_id, puntuacion.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        puntuacion = int(puntuacion)
        if not (1 <= puntuacion <= 5):
            raise ValueError
    except (ValueError, TypeError):
        return Response(
            {'error': 'La puntuación debe ser un número entero entre 1 y 5.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        usuario = UsuarioVisitante.objects.get(id=usuario_id)
    except UsuarioVisitante.DoesNotExist:
        return Response(
            {'error': 'Usuario no encontrado.'},
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        suceso = Suceso.objects.get(id=suceso_id, estado='PUBLICADO')
    except Suceso.DoesNotExist:
        return Response(
            {'error': 'Suceso no encontrado.'},
            status=status.HTTP_404_NOT_FOUND
        )

    valoracion, creada = Valoracion.objects.update_or_create(
        usuario=usuario,
        suceso=suceso,
        defaults={'puntuacion': puntuacion}
    )

    # Recalcular stats tras el voto
    stats = suceso.valoraciones.aggregate(
        media=Avg('puntuacion'),
        total=Count('id')
    )

    return Response({
        'valoracion_id': valoracion.id,
        'puntuacion': puntuacion,
        'nueva': creada,
        'valoracion_media': round(stats['media'] or 0, 1),
        'total_votos': stats['total'],
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def favorito_toggle(request):
    """
    POST /api/favorito/
    Añade o elimina un favorito (toggle).

    Body: { "usuario_id": int, "suceso_id": int }
    Devuelve: { suceso_id, es_favorito: bool }
    """
    usuario_id = request.data.get('usuario_id')
    suceso_id = request.data.get('suceso_id')

    if not all([usuario_id, suceso_id]):
        return Response(
            {'error': 'Faltan campos: usuario_id, suceso_id.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        usuario = UsuarioVisitante.objects.get(id=usuario_id)
    except UsuarioVisitante.DoesNotExist:
        return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    try:
        suceso = Suceso.objects.get(id=suceso_id, estado='PUBLICADO')
    except Suceso.DoesNotExist:
        return Response({'error': 'Suceso no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    favorito_existente = Favorito.objects.filter(usuario=usuario, suceso=suceso).first()

    if favorito_existente:
        favorito_existente.delete()
        es_favorito = False
    else:
        Favorito.objects.create(usuario=usuario, suceso=suceso)
        es_favorito = True

    return Response({
        'suceso_id': suceso.id,
        'es_favorito': es_favorito,
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def mis_favoritos(request):
    """
    GET /api/favoritos/?usuario_id=<id>
    Devuelve la lista de IDs de sucesos favoritos del usuario.
    """
    usuario_id = request.query_params.get('usuario_id')

    if not usuario_id:
        return Response(
            {'error': 'Falta el parámetro obligatorio: usuario_id.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        usuario = UsuarioVisitante.objects.get(id=usuario_id)
    except UsuarioVisitante.DoesNotExist:
        return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    suceso_ids = list(
        Favorito.objects.filter(usuario=usuario).values_list('suceso_id', flat=True)
    )

    return Response({'favoritos': suceso_ids})
