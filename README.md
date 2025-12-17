# The Laggy Blog

Bienvenido a **The Laggy Blog**, una aplicación web diseñada intencionalmente para exhibir un rendimiento extremadamente pobre. Este proyecto sirve como un "escenario del crimen" para talleres de depuración y optimización de rendimiento web.

## 🎯 Objetivo

El objetivo de este proyecto es proporcionar un entorno controlado donde los desarrolladores puedan experimentar, identificar y solucionar problemas comunes de rendimiento en el desarrollo web.

## ⚠️ Características (Problemas de Rendimiento)

Esta aplicación implementa deliberadamente varias prácticas anti-patrón:

### 1. Bloqueo del Hilo Principal (Main Thread Blocking)
- **Archivo:** `js/blocking.js`
- **Comportamiento:** Un script en el `<head>` bloquea la renderización inicial durante 2 segundos con un bucle `while` sincrónico.

### 2. Manipulación Excesiva del DOM
- **Archivo:** `js/main.js` (`createPost`)
- **Comportamiento:** Cada "post" del blog está envuelto en 30 niveles de `<div>` anidados innecesarios, creando un árbol DOM masivo y complejo.

### 3. Layout Thrashing (Reflujo Forzado)
- **Archivo:** `js/main.js` (Evento `scroll`)
- **Comportamiento:** El manejador de scroll fuerza recálculos de estilo síncronos al alternar lecturas (`getBoundingClientRect`, `offsetHeight`) y escrituras (`style.transform`, `style.opacity`) de propiedades del DOM dentro de un bucle.

### 4. Fugas de Memoria (Memory Leaks)
- **Archivo:** `js/main.js` (`setInterval` y `mousemove`)
- **Comportamiento:** 
    - Se crean arrays masivos de "basura" en cada movimiento del mouse.
    - Un intervalo crea nodos DOM desconectados que nunca se limpian, llenando la memoria con el tiempo.

### 5. Renderizado Costoso
- **Archivo:** `css/styles.css` y `js/main.js`
- **Comportamiento:** Uso de propiedades CSS costosas de animar como `box-shadow` y transformaciones 3D complejas en eventos de alta frecuencia.

## 🚀 Cómo Ejecutar

1. Clona este repositorio o navega a la carpeta del proyecto.
2. Abre el archivo `index.html` directamente en tu navegador web moderno de preferencia (Chrome, Firefox, Edge, Safari).
3. Abre las **Herramientas de Desarrollador** (F12 o Cmd+Option+I).

## 🤖 Herramienta de Auditoría con IA (Opcional)

Este proyecto incluye un servidor MCP (Model Context Protocol) que permite auditar la página usando **Google Lighthouse** directamente desde agentes de IA como Gemini CLI.

### Configuración Rápida para Gemini CLI

1. Asegúrate de tener instalado las dependencias del servidor:
   ```bash
   cd lighthouse-mcp-server
   npm install
   cd ..
   ```

2. Registra el servidor MCP en Gemini:
   
   **Opción A (Automática):**
   ```bash
   gemini mcp add lighthouse-auditor node $(pwd)/lighthouse-mcp-server/index.js
   ```

   **Opción B (Windows/Manual):**
   Reemplaza `$(pwd)` por la ruta absoluta completa a la carpeta del proyecto.

3. **¡Pruébalo!**
   Corre tu servidor (`npm run dev`) y luego pregunta a Gemini:
   > "Audita http://localhost:5173"

## 🛠 Ejercicios Sugeridos

1. **Auditoría Lighthouse:** Ejecuta un reporte de Lighthouse para ver la puntuación de rendimiento inicial.
2. **Performance Profiling:** Usa la pestaña **Performance** para grabar la carga de la página y el desplazamiento. Identifica los bloques rojos ("long tasks") y el "Layout Shift".
3. **Análisis de Memoria:** Usa la pestaña **Memory** para tomar snapshots (instantáneas) y observar cómo crece el uso de memoria (heap profile) con el tiempo.
4. **Optimización:** Intenta refactorizar el código para:
    - Eliminar el script de bloqueo.
    - Reducir la complejidad del DOM.
    - Usar `requestAnimationFrame` para animaciones y scroll.
    - Corregir el layout thrashing agrupando lecturas y escrituras.
    - Detener la fuga de memoria.

## 📄 Estructura del Proyecto

```
.
├── index.html      # Punto de entrada principal
├── css/
│   └── styles.css  # Estilos (incluyendo algunos pesados)
├── js/
│   ├── blocking.js # Script que congela la carga inicial
│   └── main.js     # Lógica principal con todos los problemas de rendimiento
└── assets/         # Imágenes
```

¡Buena suerte limpiando este desastre! 🧹💨
