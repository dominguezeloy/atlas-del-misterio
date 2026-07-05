# Atlas del Misterio

## Requisitos

- Python instalado
- Node.js instalado
- npm instalado

---

# Arrancar el Backend (Django)

Abrir una terminal y situarse en la carpeta:

```bash
cd backend
```

Si existe un entorno virtual, activarlo.

Windows:

```bash
venv\Scripts\activate
```

o

```bash
.venv\Scripts\activate
```

Instalar dependencias (solo la primera vez):

```bash
pip install -r requirements.txt
```

Aplicar migraciones (si fueran necesarias):

```bash
python manage.py migrate
```

Iniciar el servidor:

```bash
python manage.py runserver   //este es el que hay que lanzar porque ya está todo instalado.
```

El backend quedará disponible en:

http://127.0.0.1:8000/

---

# Arrancar el Frontend

Abrir una segunda terminal.

Ir a la carpeta:

```bash
cd frontend
```

Instalar dependencias (solo la primera vez):

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Normalmente el frontend estará disponible en:

http://localhost:5173

(La URL exacta aparecerá en la consola.)

---

# Orden recomendado

1. Arrancar el backend.
2. Arrancar el frontend.
3. Abrir el navegador en la dirección indicada por Vite.

---

# Detener los servidores

En cada terminal pulsar:

```
Ctrl + C
```

---

# Crear un administrador de Django (solo una vez)

```bash
python manage.py createsuperuser
```

---

# Acceso al panel de administración

http://127.0.0.1:8000/admin
