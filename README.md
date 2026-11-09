# 🌿 EcoAlerta — Plataforma de Alerta Temprana & Gestión de Incidentes Ambientales

[![React](https://img.shields.io/badge/React-19.3-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff?logo=vite&logoColor=white)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)

**EcoAlerta** es una solución tecnológica integral de respuesta inmediata y monitoreo georreferenciado orientada a la detección, reporte ciudadano y gestión institucional de emergencias ambientales en Colombia (derrames de hidrocarburos, deforestación, contaminación de fuentes hídricas y vertimientos de residuos tóxicos).

---

## 📌 Características Principales

### 🗺️ 1. Monitoreo Georreferenciado y Mapeo Interactivo
- Visualización cartográfica en tiempo real sobre capas de Leaflet / OpenStreetMap.
- Cálculo visual de radios de afectación (zonas de exclusión HAZMAT) diferenciados por severidad (*crítica*, *alta*, *moderada*).
- Selector de coordenadas GPS directamente sobre el mapa para denuncias ciudadanas.
- Filtro interactivo por tipología de evento ambiental y severidad.

### 🛡️ 2. Centro de Control para Autoridades Ambientales
- Tablero analítico con métricas KPI en tiempo real:
  - Focos críticos activos en contención.
  - Incidentes de derrames de hidrocarburos vs. tala de bosques.
  - Radio total de territorio afectado calculado en kilómetros.
- Bitácora pericial de actualizaciones y cambios de estado (*Reportado*, *Triagado*, *Inspección en Campo*, *Contención Activa*, *Remediado y Cerrado*).
- Asignación protocolaria a entidades competentes:
  - **ANLA** (Autoridad Nacional de Licencias Ambientales)
  - **DIMAR** (Dirección General Marítima y Puertos)
  - **CAR** (Corporaciones Autónomas Regionales)
  - **PNN** (Parques Nacionales Naturales)
  - **UNGRD / HAZMAT** (Gestión del Riesgo de Desastres)

### 📢 3. Sistema de Reporte Ciudadano Seguro
- Flujo guiado para ingreso de evidencia fotográfica, coordenadas GPS precisas y descripción de campo.
- Opción de denuncia anónima protegida o contacto voluntario de líderes comunales.
- Generación de folio único rastreable (ej. `AMB-2026-X892`).
- Asignación automática de autoridad competente según el tipo de incidente.

### 📊 4. Motor de Exportación y Auditoría
- **Ficha Técnica Individual (.txt)**: Expediente pericial con coordenadas en grados decimales y formato DMS (grados, minutos y segundos) para trámites oficiales.
- **Exportación CSV (Excel)**: Formato estructurado con cabecera BOM UTF-8 para visualización adecuada de tildes y caracteres especiales.
- **Exportación Dataset JSON**: Datos íntegros listos para integración en sistemas SIG/GIS institucionales.

### 🔊 5. Alertas Acústicas Sintetizadas (Web Audio API)
- Síntesis de sonido nativo sin dependencias de archivos de audio externos.
- Sirena de alarma de evacuación/emergencia ambiental.
- Campanada agradable de confirmación de transmisión satelital.
- Control global de silencio (*mute*) persistente en almacenamiento local.

---

## 🏗️ Arquitectura del Proyecto

El código está estructurado bajo principios de arquitectura modular, separación de responsabilidades y tipado estricto con TypeScript:

```text
AlertaDerrame/
├── public/                 # Recursos públicos e íconos
├── src/
│   ├── assets/             # Vectores e imágenes estáticas
│   ├── components/         # Componentes de presentación desacoplados
│   │   ├── Authority/      # Tablero analítico para entidades ambientales
│   │   ├── IncidentDetail/ # Modal de ficha técnica, bitácora y fotografías
│   │   ├── Map/            # Mapa GIS Leaflet y capas de radios de impacto
│   │   ├── Navigation/     # Barra de navegación, accesos rápidos y toggle de audio
│   │   ├── Protocols/      # Directorio de autoridades y protocolos de emergencia
│   │   └── ReportModal/    # Formulario asistido para reporte ciudadano
│   ├── constants/          # Constantes del sistema, departamentos y pesos de severidad
│   ├── data/               # Muestra inicial de datos y metadatos de autoridades
│   ├── hooks/              # Custom React Hooks
│   │   ├── useDebounce.ts       # Optimización de búsquedas y filtros
│   │   ├── useGeolocation.ts    # Captura reactiva de GPS del dispositivo
│   │   ├── useIncidents.ts      # Manejo centralizado del estado y mutaciones
│   │   └── useSoundAlerts.ts    # Control de audio y alarmas sintetizadas
│   ├── services/           # Capa de abstracción de datos y persistencia
│   │   └── incidentService.ts   # CRUD, filtros combinados y cálculo de estadísticas
│   ├── types/              # Definiciones de tipos, interfaces y enums de dominio
│   ├── utils/              # Funciones utilitarias puras y reutilizables
│   │   ├── audio.ts        # Sintetizador con osciladores Web Audio API
│   │   ├── export.ts       # Generador de CSV, JSON y fichas técnicas imprimibles
│   │   ├── formatters.ts   # Fechas relativas ("hace 2 horas"), radios y folios
│   │   ├── geo.ts          # Distancias Haversine, DMS y validación de coordenadas
│   │   ├── storage.ts      # Envoltorio de persistencia local
│   │   └── validators.ts   # Validación exhaustiva de formularios de reporte
│   ├── App.tsx             # Componente raíz integrado con hooks reactivos
│   ├── main.tsx            # Punto de entrada de la aplicación
│   └── index.css           # Estilos base con Tailwind CSS
├── package.json            # Metadatos del proyecto y dependencias
├── tsconfig.json           # Configuración de TypeScript
└── vite.config.ts          # Configuración del bundler Vite con React y Tailwind
```

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- **Node.js**: versión 18 o superior recomendada.
- **npm** o gestor de paquetes de su preferencia.

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/AlertaDerrame.git
cd AlertaDerrame
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el servidor de desarrollo
```bash
npm run dev
```
La aplicación quedará disponible en su navegador en `http://localhost:5173/`.

### 4. Compilación para Producción
```bash
npm run build
```
Genera los artefactos optimizados en la carpeta `dist/`.

### 5. Análisis Estático de Código
```bash
npm run lint
```

---

## 📋 Marco Normativo de Referencia (Colombia)

- **Decreto 321 de 1999**: Adopción del Plan Nacional de Contingencia contra derrames de hidrocarburos, derivados y sustancias nocivas.
- **Ley 1523 de 2012**: Política Nacional de Gestión del Riesgo de Desastres y Sistema Nacional de Gestión del Riesgo.
- **Ley 99 de 1993**: Creación del Sistema Nacional Ambiental (SINA) y el Ministerio de Ambiente.

---

## 👨‍💻 Autor y Contribuciones

Desarrollado y mantenido en la rama **`oskar`** con mejoras de arquitectura, modularización por servicios/hooks, optimización de renderizado y capacidades de exportación de auditoría pericial.
