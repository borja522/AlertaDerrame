# Documento de Pruebas y Resultados de Calidad (QA)
**Proyecto:** AlertaDerrame (EcoAlerta)  
**Rol:** Ingeniero de QA (Quality Assurance)  
**Fecha de elaboración:** 8 de noviembre de 2026  
**Versión del documento:** 1.0.0  

---

## 1. Objetivo de las Pruebas

El objetivo de esta auditoría y batería de pruebas es evaluar la calidad técnica, consistencia de datos y experiencia de usuario del flujo principal de la aplicación: el **Formulario de Reporte de Incidentes Ambientales (`ReportIncidentModal.tsx`)**. 

A través de pruebas estáticas y diseño de casos de prueba funcionales (positivos y negativos), se busca:
- Validar el comportamiento ante campos obligatorios, vacíos y formatos incorrectos.
- Identificar fallos de validación en la navegación entre pasos del wizard.
- Documentar hallazgos técnicos para que el equipo de desarrollo pueda subsanarlos antes de pasar a fases de despliegue o producción.

---

## 2. Metodología y Estado de Ejecución

Para mantener la rigurosidad e integridad profesional en QA, los resultados de este documento se clasifican en:

- **[COMPROBADO VÍA ANÁLISIS ESTÁTICO / HERRAMIENTAS]:** Verificado directamente mediante lectura de código fuente y ejecución de herramientas de compilación y linter (`tsc`, `oxlint`).
- **[PENDIENTE DE PRUEBA MANUAL EN NAVEGADOR]:** Casos de prueba diseñados cuya confirmación interactiva requiere desplegar el entorno local (`npm run dev`) y simular la interacción directa del usuario.

---

## 3. Matriz de Casos de Prueba: Formulario de Reporte de Incidentes

A continuación se detalla la suite de pruebas enfocada en el ciclo de vida del reporte, validación de obligatoriedad, manejo de datos incorrectos y flujo de pasos.

| ID | Módulo / Componente | Escenario de Prueba | Entrada / Acción del Usuario | Resultado Esperado | Resultado Obtenido | Estado de Comprobación |
|---|---|---|---|---|---|---|
| **CP-FR-01** | `ReportIncidentModal` | Reporte completo con datos válidos (Camino Feliz) | Completar pasos 1 al 4 con datos válidos y pulsar *Despachar Alerta Oficial*. | Se crea el nuevo incidente, se genera un folio oficial (`AMB-2026-XXXX`), se agrega a la lista/mapa y se notifica con un toast. | La lógica en `handleSubmit` estructura el objeto y llama a `onSubmitIncident`. | **Comprobado vía análisis de código** |
| **CP-FR-02** | `ReportIncidentModal` | Envío anónimo | Marcar el checkbox *Enviar como Reporte Ciudadano Anónimo* en el paso 4. | Se deben ocultar los campos de nombre y teléfono; el reporte debe registrarse con nombre genérico protegido. | La vista condiciona la renderización (`!isAnonymous`) y asigna `"Ciudadano Anónimo"` al objeto. | **Comprobado vía análisis de código** |
| **CP-FR-03** | `ReportIncidentModal` | Captura de coordenadas GPS | Hacer clic en *Mi GPS Actual* en el paso 3. | Debe solicitar permisos de geolocalización al navegador y actualizar los campos `lat` y `lng`. | Llama a `navigator.geolocation.getCurrentPosition`. Requiere navegador con permisos activos para prueba funcional. | **Pendiente de prueba manual en navegador** |
| **CP-FR-04** | `ReportIncidentModal` | Validación de campo Título vacío (Paso 1) | Dejar el campo *Título Breve* vacío y presionar el botón *Continuar a Evidencia Fotográfica*. | El sistema debe impedir avanzar al Paso 2 y mostrar un mensaje de validación o resaltar el campo requerido. | **Falla:** El botón es `type="button"` con `onClick={() => setStep(2)}`, por lo que avanza sin validar el atributo `required`. En el submit final genera un título genérico automático por fallback. | **Comprobado vía análisis de código (Hallazgo QA-002)** |
| **CP-FR-05** | `ReportIncidentModal` | Validación de campo Descripción vacía (Paso 1) | Dejar el campo *Descripción Detallada* vacío y pulsar *Continuar a Evidencia Fotográfica*. | El sistema debe exigir una descripción antes de permitir pasar a la carga de fotos. | **Falla:** Permite continuar al siguiente paso sin advertencia. Al enviar el reporte, asigna una descripción genérica predeterminada. | **Comprobado vía análisis de código (Hallazgo QA-002)** |
| **CP-FR-06** | `ReportIncidentModal` | Formato incorrecto de teléfono de contacto | Ingresar cadenas alfabéticas o símbolos no numéricos (ej. `"telefono_invalido"`) en el campo *Teléfono de Contacto*. | El campo debe restringir o advertir que el formato no es un número telefónico válido (`type="tel"` con patrón de validación). | **Falla:** El campo está definido como `type="text"` sin regex ni máscara de entrada; acepta cualquier cadena alfanumérica. | **Comprobado vía análisis de código (Hallazgo QA-004)** |
| **CP-FR-07** | `ReportIncidentModal` | Reinicio de formulario al cerrar y reabrir (QA-001) | Llenar campos en Paso 1, cerrar el modal mediante el botón "X" o cancelar, y volver a hacer clic en *Reportar Incidente*. | Todos los campos deben aparecer limpios/con sus valores por defecto, listos para un nuevo reporte. | Implementado mediante `React.useEffect` dependiente de `isOpen`. | **Pendiente de prueba manual en navegador** |
| **CP-FR-08** | `ReportIncidentModal` | Consistencia de promesa de metadatos en fotos | Subir una imagen desde el almacenamiento local y verificar si se leen o inyectan metadatos EXIF/GPS. | Si el sistema indica que anexa metadatos para fines periciales, estos deben capturarse y guardarse en el modelo. | **Inconsistencia:** `FileReader.readAsDataURL()` únicamente extrae Base64. No hay extracción ni enriquecimiento de metadatos EXIF. | **Comprobado vía análisis de código (Hallazgo QA-022)** |

---

## 4. Pruebas Automatizadas y de Herramientas Ejecutadas

Como parte del aseguramiento de calidad del código, se corrieron las herramientas disponibles en el proyecto:

1. **Compilación y verificación de tipos (TypeScript):**
   - **Comando:** `npx tsc --noEmit`
   - **Resultado:** `Exit Code: 0` (Sin errores de tipado en los modelos ni en la interacción de componentes).
2. **Linter Estático (OXLint):**
   - **Comando:** `npx oxlint`
   - **Resultado:** 0 errores críticos de compilación, 45 advertencias (la gran mayoría correspondiente a iconos importados sin uso en diferentes vistas, y variables de funciones auxiliares declaradas pero no referenciadas en el JSX).

---

## 5. Observaciones del Área de QA

1. **Falsa sensación de validación en formularios de pasos múltiples (Wizards):**  
   Los atributos estándar de HTML5 como `required` dentro de formularios React divididos en pasos no tienen efecto al interactuar con botones auxiliares `type="button"`. Los usuarios pueden saltar pasos sin ingresar la información mínima necesaria para las autoridades.
2. **Persistencia y desacoplamiento de estado:**  
   Al mantener componentes modales montados en la raíz de la aplicación, el manejo de estados debe considerar explícitamente el ciclo de vida del modal (`isOpen`) para evitar fuga de información entre sesiones o reportes consecutivos.
3. **Claridad y veracidad en los mensajes al usuario:**  
   Los textos informativos (como la supuesta captura de metadatos GPS en fotos) deben reflejar con exactitud la capacidad técnica implementada, evitando falsas expectativas forenses o legales en reportes comunitarios.

---

## 6. Recomendaciones para el Equipo de Desarrollo

1. **Implementar validación preventiva en navegación entre pasos:**
   - Crear una función de guardia en el Paso 1:
     ```typescript
     const canProceedStep1 = title.trim().length > 0 && description.trim().length > 0;
     ```
   - Deshabilitar el botón *Continuar* o mostrar mensajes de error visibles si no se cumple el criterio mínimo.
2. **Mejorar la validación del campo telefónico:**
   - Cambiar `type="text"` por `type="tel"` y añadir validación de formato mediante expresión regular básica para números de contacto nacional o internacional.
3. **Ajuste del texto informativo en la sección de fotos:**
   - Ajustar el párrafo del Paso 2 para indicar que se adjunta la imagen fotográfica en el expediente del reporte, retirando la mención de metadatos periciales mientras no se integre una librería de procesamiento EXIF.
4. **Incorporación de pruebas unitarias y de integración:**
   - Configurar un framework como Vitest + React Testing Library para automatizar los casos de prueba de formularios (`CP-FR-01` a `CP-FR-07`) e integrarlos en el flujo de integración continua (CI).

---
*Documento elaborado y entregado como aporte al control de calidad del repositorio AlertaDerrame.*

