from django.contrib import admin
from django.utils.html import format_html
from .models import Categoria, Suceso, ImagenSuceso, Fuente, UsuarioVisitante, Valoracion, Favorito


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['icono_emoji', 'nombre', 'slug', 'muestra_color', 'total_sucesos']
    search_fields = ['nombre', 'slug']
    prepopulated_fields = {'slug': ('nombre',)}

    def muestra_color(self, obj):
        return format_html(
            '<div style="width:28px;height:28px;background:{};border-radius:6px;'
            'border:1px solid #ccc;display:inline-block;vertical-align:middle;"></div>'
            '&nbsp;<code>{}</code>',
            obj.color, obj.color
        )
    muestra_color.short_description = 'Color'

    def total_sucesos(self, obj):
        count = obj.sucesos.count()
        return format_html('<strong>{}</strong>', count)
    total_sucesos.short_description = 'Sucesos'


class ImagenSucesoInline(admin.TabularInline):
    model = ImagenSuceso
    extra = 1
    fields = ['imagen', 'descripcion', 'orden']
    ordering = ['orden']


class FuenteInline(admin.TabularInline):
    model = Fuente
    extra = 1
    fields = ['titulo', 'url', 'tipo']


@admin.register(Suceso)
class SucesoAdmin(admin.ModelAdmin):
    list_display = [
        'titulo', 'categoria', 'estado_badge', 'provincia',
        'nivel_misterio_display', 'relevancia', 'votos_display', 'created_at'
    ]
    list_filter = [
        'estado', 'categoria', 'nivel_misterio',
        'provincia', 'comunidad_autonoma'
    ]
    search_fields = ['titulo', 'slug', 'localidad', 'provincia', 'descripcion_corta']
    prepopulated_fields = {'slug': ('titulo',)}
    readonly_fields = ['created_at', 'updated_at', 'stats_display']
    inlines = [ImagenSucesoInline, FuenteInline]
    list_editable = ['relevancia']
    date_hierarchy = 'created_at'
    ordering = ['-relevancia', '-created_at']
    list_per_page = 30

    fieldsets = (
        ('Identificación', {
            'fields': ('titulo', 'slug', 'categoria', 'estado')
        }),
        ('Contenido', {
            'fields': ('descripcion_corta', 'descripcion_larga')
        }),
        ('Ubicación', {
            'fields': (
                ('latitud', 'longitud'),
                ('localidad', 'provincia', 'comunidad_autonoma'),
            )
        }),
        ('Temporal', {
            'fields': ('fecha_suceso',)
        }),
        ('Media', {
            'fields': ('imagen_principal', 'audio_url', 'video_url')
        }),
        ('Editorial', {
            'fields': (('nivel_misterio', 'relevancia'),)
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',),
            'description': 'Se auto-rellena con el título y descripción corta si se dejan vacíos.'
        }),
        ('Estadísticas', {
            'fields': ('stats_display', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def estado_badge(self, obj):
        colores = {
            'BORRADOR': '#6B7280',
            'REVISION': '#F59E0B',
            'PUBLICADO': '#10B981',
            'ARCHIVADO': '#DC2626',
        }
        color = colores.get(obj.estado, '#6B7280')
        return format_html(
            '<span style="background:{};color:white;padding:2px 8px;'
            'border-radius:12px;font-size:11px;font-weight:bold;">{}</span>',
            color, obj.get_estado_display()
        )
    estado_badge.short_description = 'Estado'
    estado_badge.admin_order_field = 'estado'

    def nivel_misterio_display(self, obj):
        return '★' * obj.nivel_misterio + '☆' * (5 - obj.nivel_misterio)
    nivel_misterio_display.short_description = 'Misterio'

    def votos_display(self, obj):
        total = obj.total_votos()
        if total == 0:
            return '–'
        media = obj.valoracion_media()
        return format_html('{} ★ <small style="color:#999">({} votos)</small>', media, total)
    votos_display.short_description = 'Valoración'

    def stats_display(self, obj):
        media = obj.valoracion_media()
        total = obj.total_votos()
        return format_html(
            '<strong>{} ★</strong> ({} votos)',
            media, total
        )
    stats_display.short_description = 'Valoración media'


@admin.register(UsuarioVisitante)
class UsuarioVisitanteAdmin(admin.ModelAdmin):
    list_display = ['nick', 'email', 'total_valoraciones', 'total_favoritos', 'created_at']
    search_fields = ['nick', 'email']
    readonly_fields = ['created_at']
    list_per_page = 50

    def total_valoraciones(self, obj):
        return obj.valoraciones.count()
    total_valoraciones.short_description = 'Valoraciones'

    def total_favoritos(self, obj):
        return obj.favoritos.count()
    total_favoritos.short_description = 'Favoritos'


@admin.register(Valoracion)
class ValoracionAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'suceso', 'puntuacion_display', 'fecha']
    list_filter = ['puntuacion']
    search_fields = ['usuario__nick', 'usuario__email', 'suceso__titulo']
    readonly_fields = ['fecha']

    def puntuacion_display(self, obj):
        return '★' * obj.puntuacion + '☆' * (5 - obj.puntuacion)
    puntuacion_display.short_description = 'Puntuación'
    puntuacion_display.admin_order_field = 'puntuacion'


@admin.register(Favorito)
class FavoritoAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'suceso', 'fecha']
    search_fields = ['usuario__nick', 'suceso__titulo']
    readonly_fields = ['fecha']


# Personalización del sitio de administración
admin.site.site_header = '🗺️ Atlas del Misterio — Administración'
admin.site.site_title = 'Atlas del Misterio'
admin.site.index_title = 'Panel de Control'
