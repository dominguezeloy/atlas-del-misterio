"""
Modelos del Atlas del Misterio
================================
7 modelos principales:
  - Categoria          → tipo de suceso paranormal
  - Suceso             → entidad central (lugar + historia)
  - ImagenSuceso       → galería de imágenes por suceso
  - Fuente             → referencias bibliográficas tipadas
  - UsuarioVisitante   → usuario sin contraseña (MVP)
  - Valoracion         → puntuación 1-5 de usuario sobre suceso
  - Favorito           → suceso marcado como favorito por usuario
"""
from django.db import models
from django.utils.text import slugify


class Categoria(models.Model):
    """Categoría temática de un suceso paranormal."""

    nombre = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    color = models.CharField(
        max_length=7,
        help_text='Color hexadecimal para el icono en el mapa, ej: #8B5CF6'
    )
    icono_emoji = models.CharField(
        max_length=10,
        help_text='Emoji representativo mostrado en el marcador del mapa, ej: 👻',
        default='❓'
    )

    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'
        ordering = ['nombre']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.icono_emoji} {self.nombre}'


class Suceso(models.Model):
    """
    Suceso paranormal o misterioso. Entidad central del Atlas del Misterio.

    Notas de escalabilidad:
    - estado: usa el flujo editorial BORRADOR → REVISION → PUBLICADO → ARCHIVADO
    - relevancia: int editorial para portada, destacados y algoritmo de ranking
    - meta_title / meta_description: SEO listo desde el primer suceso
    - Los campos latitud/longitud son DecimalField para precisión.
      Ver comentario FUTURE sobre PostGIS más abajo.
    """

    ESTADO_CHOICES = [
        ('BORRADOR', 'Borrador'),
        ('REVISION', 'En revisión'),
        ('PUBLICADO', 'Publicado'),
        ('ARCHIVADO', 'Archivado'),
    ]

    NIVEL_MISTERIO_CHOICES = [(i, str(i)) for i in range(1, 6)]

    # ── Identificación ────────────────────────────────────────────────────────
    titulo = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.PROTECT,
        related_name='sucesos'
    )

    # ── Contenido ─────────────────────────────────────────────────────────────
    descripcion_corta = models.CharField(
        max_length=500,
        help_text='Resumen para el popup del mapa (máx. 500 caracteres)'
    )
    descripcion_larga = models.TextField(
        help_text='Descripción completa para la ficha del suceso'
    )

    # ── Ubicación ─────────────────────────────────────────────────────────────
    latitud = models.DecimalField(max_digits=9, decimal_places=6)
    longitud = models.DecimalField(max_digits=9, decimal_places=6)
    localidad = models.CharField(max_length=150, blank=True)
    provincia = models.CharField(max_length=100, blank=True)
    comunidad_autonoma = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Comunidad autónoma'
    )

    # FUTURE: Cuando migres a PostGIS, añade:
    # from django.contrib.gis.db import models as gis_models
    # location = gis_models.PointField(null=True, blank=True, srid=4326)
    # Con PointField tendrás:
    #   - Búsqueda de sucesos cercanos a X km (distance lookups)
    #   - Clustering geográfico en backend eficiente
    #   - Índices espaciales (GiST) para consultas rápidas con 10.000+ puntos
    # Y añade 'django.contrib.gis' a INSTALLED_APPS.

    # ── Temporal ──────────────────────────────────────────────────────────────
    fecha_suceso = models.DateField(
        null=True,
        blank=True,
        help_text='Fecha aproximada del suceso. Dejar en blanco si es desconocida.'
    )

    # ── Media ─────────────────────────────────────────────────────────────────
    imagen_principal = models.ImageField(
        upload_to='sucesos/portadas/',
        null=True,
        blank=True,
        help_text='Imagen principal mostrada en el popup y la ficha'
    )
    audio_url = models.URLField(
        blank=True,
        help_text='URL del audio de psicofonía (MP3, OGG). Ej: https://ejemplo.com/audio.mp3'
    )
    video_url = models.URLField(
        blank=True,
        help_text='URL del vídeo (YouTube, Vimeo, etc.)'
    )

    # ── Editorial ─────────────────────────────────────────────────────────────
    nivel_misterio = models.IntegerField(
        choices=NIVEL_MISTERIO_CHOICES,
        default=3,
        help_text='Nivel de misterio editorial del 1 (menor) al 5 (mayor)'
    )
    relevancia = models.IntegerField(
        default=0,
        help_text='Puntuación editorial de relevancia. Úsala para portada y destacados. Mayor = más visible.'
    )

    # ── SEO ───────────────────────────────────────────────────────────────────
    meta_title = models.CharField(
        max_length=70,
        blank=True,
        help_text='Título SEO (máx. 70 chars). Si está vacío se usa el título del suceso.'
    )
    meta_description = models.CharField(
        max_length=160,
        blank=True,
        help_text='Descripción SEO (máx. 160 chars). Si está vacía se usa la descripción corta.'
    )

    # ── Estado editorial ──────────────────────────────────────────────────────
    estado = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default='BORRADOR',
        help_text='Solo los sucesos en estado PUBLICADO aparecen en el mapa y la API pública.'
    )

    # ── Timestamps ────────────────────────────────────────────────────────────
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Suceso'
        verbose_name_plural = 'Sucesos'
        ordering = ['-relevancia', '-created_at']
        indexes = [
            models.Index(fields=['estado']),
            models.Index(fields=['estado', 'categoria']),
            models.Index(fields=['provincia']),
            models.Index(fields=['slug']),
            models.Index(fields=['-relevancia', '-created_at']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.titulo)
        # Auto-rellenar campos SEO si están vacíos
        if not self.meta_title:
            self.meta_title = self.titulo[:70]
        if not self.meta_description:
            self.meta_description = self.descripcion_corta[:160]
        super().save(*args, **kwargs)

    def __str__(self):
        return f'[{self.get_estado_display()}] {self.titulo}'

    def valoracion_media(self):
        """Calcula la valoración media de los votos de usuarios."""
        from django.db.models import Avg
        resultado = self.valoraciones.aggregate(media=Avg('puntuacion'))
        return round(resultado['media'] or 0, 1)

    def total_votos(self):
        """Devuelve el número total de votos."""
        return self.valoraciones.count()


class ImagenSuceso(models.Model):
    """
    Imagen de la galería de un suceso.

    Tabla independiente en vez de JSONField para poder:
    - Ordenar imágenes manualmente
    - Añadir pies de foto
    - Optimizar consultas con prefetch_related
    - Migrar a CDN fácilmente (añadir campo imagen_cdn_url)
    """
    suceso = models.ForeignKey(
        Suceso,
        on_delete=models.CASCADE,
        related_name='imagenes'
    )
    imagen = models.ImageField(
        upload_to='sucesos/galeria/',
        help_text='Imagen de la galería'
    )
    descripcion = models.CharField(
        max_length=300,
        blank=True,
        help_text='Pie de foto / texto alternativo'
    )
    orden = models.IntegerField(
        default=0,
        help_text='Orden de aparición en la galería (menor número = primero)'
    )

    # FUTURE: Para migrar imágenes a CDN (ej. Cloudflare Images, AWS CloudFront):
    # imagen_cdn_url = models.URLField(blank=True)
    # En el serializer usa imagen_cdn_url si está relleno, si no usa imagen.url

    class Meta:
        verbose_name = 'Imagen del suceso'
        verbose_name_plural = 'Imágenes del suceso'
        ordering = ['orden', 'id']

    def __str__(self):
        return f'Imagen [{self.orden}] de "{self.suceso.titulo}"'


class Fuente(models.Model):
    """
    Fuente bibliográfica o documental tipada de un suceso.

    Tipos disponibles: Libro, Revista, Vídeo, Podcast, Web, Documental, Otro.
    Las fuentes tipadas permiten mostrar iconos distintos en la ficha del suceso.
    """

    TIPO_CHOICES = [
        ('LIBRO', 'Libro'),
        ('REVISTA', 'Revista'),
        ('VIDEO', 'Vídeo'),
        ('PODCAST', 'Podcast'),
        ('WEB', 'Web'),
        ('DOCUMENTAL', 'Documental'),
        ('OTRO', 'Otro'),
    ]

    suceso = models.ForeignKey(
        Suceso,
        on_delete=models.CASCADE,
        related_name='fuentes'
    )
    titulo = models.CharField(max_length=300)
    url = models.URLField(
        blank=True,
        help_text='Enlace a la fuente (opcional)'
    )
    tipo = models.CharField(
        max_length=20,
        choices=TIPO_CHOICES,
        default='WEB'
    )

    class Meta:
        verbose_name = 'Fuente'
        verbose_name_plural = 'Fuentes'
        ordering = ['tipo', 'titulo']

    def __str__(self):
        return f'[{self.get_tipo_display()}] {self.titulo}'


class UsuarioVisitante(models.Model):
    """
    Usuario sin contraseña para el MVP.

    Identificación mínima: solo nick + email.
    Se crea automáticamente la primera vez que el usuario vota.

    FUTURE: Para autenticación completa, migra al modelo User de Django
    (django.contrib.auth) con djangorestframework-simplejwt.
    El nick → username, el email sigue siendo email.
    Guarda las valoraciones y favoritos asociados al User.
    """
    nick = models.CharField(max_length=50, help_text='Nombre público del usuario')
    email = models.EmailField(unique=True, help_text='Email único por usuario')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Usuario visitante'
        verbose_name_plural = 'Usuarios visitantes'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.nick} <{self.email}>'


class Valoracion(models.Model):
    """
    Valoración de 1 a 5 estrellas de un UsuarioVisitante sobre un Suceso.

    Restricción: unique_together garantiza que un usuario solo puede
    votar una vez por suceso. El voto se puede actualizar con update_or_create.
    """
    usuario = models.ForeignKey(
        UsuarioVisitante,
        on_delete=models.CASCADE,
        related_name='valoraciones'
    )
    suceso = models.ForeignKey(
        Suceso,
        on_delete=models.CASCADE,
        related_name='valoraciones'
    )
    puntuacion = models.IntegerField(
        choices=[(i, f'{i} estrellas') for i in range(1, 6)],
        help_text='Puntuación del 1 al 5'
    )
    fecha = models.DateTimeField(auto_now=True, help_text='Fecha del último voto o actualización')

    class Meta:
        verbose_name = 'Valoración'
        verbose_name_plural = 'Valoraciones'
        unique_together = ('usuario', 'suceso')
        ordering = ['-fecha']

    def __str__(self):
        return f'{self.usuario.nick} → {self.suceso.titulo}: {self.puntuacion}★'


class Favorito(models.Model):
    """
    Suceso marcado como favorito por un UsuarioVisitante.

    Casos de uso futuros:
    - "Mis lugares favoritos" → lista personalizada
    - "Rutas del misterio" → agrupación geográfica de favoritos
    - "Lugares pendientes" → listas de deseos
    """
    usuario = models.ForeignKey(
        UsuarioVisitante,
        on_delete=models.CASCADE,
        related_name='favoritos'
    )
    suceso = models.ForeignKey(
        Suceso,
        on_delete=models.CASCADE,
        related_name='favoritos'
    )
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Favorito'
        verbose_name_plural = 'Favoritos'
        unique_together = ('usuario', 'suceso')
        ordering = ['-fecha']

    def __str__(self):
        return f'{self.usuario.nick} ♥ {self.suceso.titulo}'


class PrediccionMuerte(models.Model):
    """
    Predicción humorística del destino para la Calculadora del Destino.

    Campo:
    - descripcion: texto único y absurdo (sin violencia real, suicidio, enfermedades)
    - activa: si está disponible para mostrar en el cálculo

    Notas:
    - NO se guardan resultados (cálculos solo en memoria)
    - El endpoint random selecciona una predicción activa al azar
    - Se puede activar/desactivar desde admin para moderar contenido
    """
    descripcion = models.CharField(
        max_length=255,
        unique=True,
        help_text='Predicción humorística del destino. Máx. 255 caracteres.'
    )
    activa = models.BooleanField(
        default=True,
        help_text='Mostrar esta predicción en la Calculadora del Destino'
    )

    class Meta:
        verbose_name = 'Predicción de Muerte'
        verbose_name_plural = 'Predicciones de Muerte'
        ordering = ['-id']

    def __str__(self):
        return self.descripcion
