from rest_framework import serializers
from .models import Categoria, Suceso, ImagenSuceso, Fuente


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'slug', 'color', 'icono_emoji']


class ImagenSucesoSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = ImagenSuceso
        fields = ['id', 'imagen_url', 'descripcion', 'orden']

    def get_imagen_url(self, obj):
        request = self.context.get('request')
        if obj.imagen and hasattr(obj.imagen, 'url'):
            if request:
                return request.build_absolute_uri(obj.imagen.url)
            return obj.imagen.url
        return None


class FuenteSerializer(serializers.ModelSerializer):
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)

    class Meta:
        model = Fuente
        fields = ['id', 'titulo', 'url', 'tipo', 'tipo_display']


class SucesoListSerializer(serializers.ModelSerializer):
    """
    Serializer ligero para la carga masiva de marcadores del mapa.
    Solo incluye los campos necesarios para renderizar el popup.

    Eficiencia: el ViewSet anota el queryset con valoracion_media_ann y
    total_votos_ann para evitar N+1 queries.
    """
    categoria = CategoriaSerializer(read_only=True)
    valoracion_media = serializers.SerializerMethodField()
    total_votos = serializers.SerializerMethodField()
    imagen_principal_url = serializers.SerializerMethodField()

    class Meta:
        model = Suceso
        fields = [
            'id', 'titulo', 'slug', 'categoria',
            'descripcion_corta',
            'latitud', 'longitud',
            'localidad', 'provincia',
            'nivel_misterio', 'relevancia',
            'imagen_principal_url',
            'valoracion_media', 'total_votos',
        ]

    def get_valoracion_media(self, obj):
        # Usa la anotación del queryset si está disponible (evita N+1)
        val = getattr(obj, 'valoracion_media_ann', None)
        if val is not None:
            return round(float(val), 1)
        return obj.valoracion_media()

    def get_total_votos(self, obj):
        val = getattr(obj, 'total_votos_ann', None)
        if val is not None:
            return val
        return obj.total_votos()

    def get_imagen_principal_url(self, obj):
        request = self.context.get('request')
        if obj.imagen_principal and hasattr(obj.imagen_principal, 'url'):
            if request:
                return request.build_absolute_uri(obj.imagen_principal.url)
            return obj.imagen_principal.url
        return None


class SucesoDetailSerializer(serializers.ModelSerializer):
    """
    Serializer completo para la ficha de detalle de un suceso.
    Incluye imágenes anidadas, fuentes tipadas y valoración.
    """
    categoria = CategoriaSerializer(read_only=True)
    imagenes = ImagenSucesoSerializer(many=True, read_only=True)
    fuentes = FuenteSerializer(many=True, read_only=True)
    valoracion_media = serializers.SerializerMethodField()
    total_votos = serializers.SerializerMethodField()
    imagen_principal_url = serializers.SerializerMethodField()
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)

    class Meta:
        model = Suceso
        fields = [
            'id', 'titulo', 'slug', 'categoria',
            'descripcion_corta', 'descripcion_larga',
            'latitud', 'longitud',
            'localidad', 'provincia', 'comunidad_autonoma',
            'fecha_suceso',
            'nivel_misterio', 'relevancia',
            'imagen_principal_url', 'imagenes',
            'audio_url', 'video_url',
            'fuentes',
            'meta_title', 'meta_description',
            'estado', 'estado_display',
            'valoracion_media', 'total_votos',
            'created_at', 'updated_at',
        ]

    def get_valoracion_media(self, obj):
        val = getattr(obj, 'valoracion_media_ann', None)
        if val is not None:
            return round(float(val), 1)
        return obj.valoracion_media()

    def get_total_votos(self, obj):
        val = getattr(obj, 'total_votos_ann', None)
        if val is not None:
            return val
        return obj.total_votos()

    def get_imagen_principal_url(self, obj):
        request = self.context.get('request')
        if obj.imagen_principal and hasattr(obj.imagen_principal, 'url'):
            if request:
                return request.build_absolute_uri(obj.imagen_principal.url)
            return obj.imagen_principal.url
        return None
