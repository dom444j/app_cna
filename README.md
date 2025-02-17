# Proyecto CNA Dashboard

## 📌 Descripción
Este proyecto es un sistema de compensación multilevel con tienda de productos, basado en una estructura **binaria y unilevel**. Cuenta con módulos de administración, usuario, reportes, bonificaciones y finanzas.

## 📂 Estructura del Proyecto

```bash
├── README.md
├── LICENSE.md
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── archivo.env
│   ├── server.js
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── redis.js
│   │   │   └── index.js
│   │   ├── models/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   ├── services/
│   │   ├── docs/
│   │   └── tests/
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── public/
│   ├── pages/
│   │   ├── html/  # Contiene vistas estáticas del sistema
│   ├── components/
│   ├── store/
│   ├── styles/
├── scripts/
│   ├── run_e2e_tests.sh
└── configuraciones/
    ├── .github/
    ├── .vscode/
    ├── eslint, prettier, gitignore configs
    ├── webpack.config.js
    ├── package-lock.json
    ├── yarn.lock
```

## 🚀 Instalación y Configuración

### 🔹 **Backend**
```bash
cd backend
npm install
npm run dev
```

### 🔹 **Frontend**
```bash
cd frontend
npm install
npm run dev
```

### 🔹 **Ejecutar con Docker**
```bash
docker-compose up --build
```

## 🛠 Tecnologías Usadas
- **Backend:** Node.js, Express, Sequelize, MySQL, Redis, BullMQ
- **Frontend:** Next.js, React, Redux, TailwindCSS
- **Infraestructura:** Docker, Nginx, PM2

---
© 2024 CNA Dashboard. Todos los derechos reservados.

