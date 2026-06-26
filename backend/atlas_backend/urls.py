from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('sucesos.urls')),
]

# Sirve archivos de media en desarrollo (imágenes, audios).
# En producción usa un servidor web (Nginx) o un CDN para esto.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
