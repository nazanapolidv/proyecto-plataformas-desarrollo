# API del Sistema Médico

Esta API REST proporciona endpoints para gestionar usuarios, especializaciones, citas y historial médico.

## 🚀 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
```

La API estará disponible en `http://localhost:3001`

## 📚 Endpoints Disponibles

### **Usuarios** (`/api/usuarios`)

- `GET /api/usuarios` - Obtener todos los usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `POST /api/usuarios` - Crear nuevo usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario
- `POST /api/usuarios/login` - Autenticar usuario

### **Especializaciones** (`/api/especializaciones`)

- `GET /api/especializaciones` - Obtener todas las especializaciones
- `GET /api/especializaciones/:id` - Obtener especialización por ID
- `POST /api/especializaciones` - Crear nueva especialización
- `PUT /api/especializaciones/:id` - Actualizar especialización
- `DELETE /api/especializaciones/:id` - Eliminar especialización

### **Citas** (`/api/citas`)

- `GET /api/citas` - Obtener todas las citas
- `GET /api/citas/:id` - Obtener cita por ID
- `GET /api/citas/paciente/:paciente` - Obtener citas por paciente
- `POST /api/citas` - Crear nueva cita
- `PUT /api/citas/:id` - Actualizar cita
- `DELETE /api/citas/:id` - Eliminar cita
- `PATCH /api/citas/:id/cancelar` - Cancelar cita

### **Historial** (`/api/historial`)

- `GET /api/historial` - Obtener todo el historial
- `GET /api/historial/:id` - Obtener entrada por ID
- `GET /api/historial/paciente/:paciente` - Obtener historial por paciente
- `POST /api/historial` - Crear nueva entrada
- `PUT /api/historial/:id` - Actualizar entrada
- `DELETE /api/historial/:id` - Eliminar entrada

## 🔧 Estructura del Proyecto

```
api/
├── server.js           # Servidor principal
├── package.json        # Dependencias
├── data/              # Archivos JSON de datos
│   ├── usuarios.json
│   ├── especializaciones.json
│   ├── citas.json
│   └── historial.json
└── routes/            # Rutas de la API
    ├── usuarios.js
    ├── especializaciones.js
    ├── citas.js
    └── historial.js
```

## 📝 Ejemplos de Uso

### Login
```bash
curl -X POST http://localhost:3001/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email": "paciente@mail.com", "password": "1234"}'
```

### Crear Especialización
```bash
curl -X POST http://localhost:3001/api/especializaciones \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Traumatología", "descripcion": "Especialidad..."}'
```

### Crear Cita
```bash
curl -X POST http://localhost:3001/api/citas \
  -H "Content-Type: application/json" \
  -d '{"fecha": "2024-01-15", "hora": "10:00", "paciente": "Juan Pérez", "medico": "Dr. García", "especialidad": "Cardiología"}'
```

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **CORS** - Middleware para habilitar CORS
- **Body-parser** - Middleware para parsear JSON
- **File System** - Para persistencia de datos en JSON

## 📊 Códigos de Respuesta

- `200` - Éxito
- `201` - Creado exitosamente
- `400` - Error en la petición
- `404` - Recurso no encontrado
- `500` - Error interno del servidor
