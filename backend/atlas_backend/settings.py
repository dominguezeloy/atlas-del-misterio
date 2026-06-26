"""
Django Settings — Atlas del Misterio
=====================================
Configuración para el entorno de desarrollo (MVP con SQLite).

Para producción:
  - Cambia DEBUG = False
  - Configura ALLOWED_HOSTS con tu dominio real
  - Genera un SECRET_KEY aleatorio y seguro
  - Descomenta el bloque PostgreSQL
  - Configura almacenamiento de medias (ej. AWS S3 con django-storages)
"""
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# ── Seguridad ─────────────────────────────────────────────────────────────────
# ⚠️  Genera uno aleatorio para producción: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
SECRET_KEY = 'django-insecure-atlas-misterio-mvp-cambia-esto-en-produccion-xyz789'

# ⚠️  Desactiva en producción
DEBUG = True

# ⚠️  Restringe a tu dominio en producción, ej: ['atlasdelmisterio.es', 'www.atlasdelmisterio.es']
ALLOWED_HOSTS = ['*']

# ── Aplicaciones ──────────────────────────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Terceros
    'rest_framework',
    'corsheaders',
    'django_filters',
    # Proyecto
    'sucesos',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Debe estar ANTES de CommonMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'atlas_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'atlas_backend.wsgi.application'

# ── Base de datos ─────────────────────────────────────────────────────────────
# MVP: SQLite. Para migrar a PostgreSQL, comenta el bloque SQLite
# y descomenta el bloque PostgreSQL.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# FUTURE: PostgreSQL
# Para instalar: pip install psycopg2-binary
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         # Para búsquedas geoespaciales, instala PostGIS y usa:
#         # 'ENGINE': 'django.contrib.gis.db.backends.postgis',
#         'NAME': os.environ.get('DB_NAME', 'atlas_misterio'),
#         'USER': os.environ.get('DB_USER', 'postgres'),
#         'PASSWORD': os.environ.get('DB_PASSWORD', ''),
#         'HOST': os.environ.get('DB_HOST', 'localhost'),
#         'PORT': os.environ.get('DB_PORT', '5432'),
#         'CONN_MAX_AGE': 60,
#     }
# }

# ── Validadores de contraseña ─────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# FUTURE: Autenticación completa con JWT
# pip install djangorestframework-simplejwt
# Añade 'rest_framework_simplejwt' a INSTALLED_APPS y configura:
# REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'] = [
#     'rest_framework_simplejwt.authentication.JWTAuthentication',
# ]

# ── Internacionalización ──────────────────────────────────────────────────────
LANGUAGE_CODE = 'es-es'
TIME_ZONE = 'Europe/Madrid'
USE_I18N = True
USE_TZ = True

# ── Archivos estáticos ────────────────────────────────────────────────────────
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# ── Archivos de media ─────────────────────────────────────────────────────────
# Imágenes, audios y otros archivos subidos por el administrador.
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# FUTURE: Para producción con AWS S3:
# pip install django-storages boto3
# DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
# AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_BUCKET_NAME')
# AWS_S3_REGION_NAME = os.environ.get('AWS_REGION', 'eu-west-1')
# AWS_S3_CUSTOM_DOMAIN = f"{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com"

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ── CORS ──────────────────────────────────────────────────────────────────────
# Permite peticiones desde el frontend React en desarrollo.
# En producción, restringe a tu dominio real.
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',   # Vite dev server por defecto
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
]
CORS_ALLOW_CREDENTIALS = True

# ── Django REST Framework ─────────────────────────────────────────────────────
REST_FRAMEWORK = {
    # La paginación se desactiva a nivel de ViewSet para el mapa (necesita todos los puntos).
    # Para otros endpoints futuros, puedes añadir paginación aquí.
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    # FUTURE: JWT authentication
    # 'DEFAULT_AUTHENTICATION_CLASSES': [
    #     'rest_framework_simplejwt.authentication.JWTAuthentication',
    # ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}
