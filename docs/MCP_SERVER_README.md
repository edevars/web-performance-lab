# Servidor MCP Lighthouse

Este directorio contiene un servidor MCP (Model Context Protocol) que proporciona una herramienta para ejecutar auditorías de Google Lighthouse en páginas web.

## Prerrequisitos

- Node.js (v18 o superior)
- Google Chrome instalado en el sistema (controlado a través de `chrome-launcher`)
- Gemini CLI (opcional, para interactuar desde la terminal)

## Instalación

1. Navega al directorio `lighthouse-mcp-server`:
   ```bash
   cd lighthouse-mcp-server
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

## Configuración con Gemini CLI

La forma más sencilla de configurar el servidor es utilizando el comando `gemini mcp add`.

Ejecuta el siguiente comando en tu terminal:

```bash
gemini mcp add lighthouse-auditor node /Users/codevars/Development/workshops/crime-scene/lighthouse-mcp-server/index.js
```

Esto registrará el servidor automáticamente. Puedes verificar que está funcionado con:

```bash
gemini mcp list
```

Alternativamente, si necesitas configuración manual (JSON), puedes editar tu archivo de configuración de proyecto `.gemini/settings.json` o el archivo que utilice tu cliente específico.

## Uso con Gemini CLI

Si ya tienes instalado y configurado el Gemini CLI para usar servidores MCP, puedes interactuar directamente con la herramienta.

1. **Asegúrate de que el servidor esté registrado** en la configuración que usa Gemini CLI.
2. **Inicia Gemini CLI**:
   ```bash
   gemini
   ```
3. **Solicita una auditoría**:
   Simplemente pide en lenguaje natural que audite tu sitio local.

   > "Audita el sitio http://localhost:5173 para comprobar el rendimiento."

   El CLI utilizará la herramienta `run_lighthouse_audit`, lanzará Chrome en segundo plano y te devolverá los puntajes y la ubicación del reporte detallado.

## Ejemplo de Flujo de Trabajo

1. **Inicia tu servidor web local:**
   
   En la raíz del proyecto `crime-scene`, ejecuta:
   ```bash
   npm run dev
   ```
   Esto iniciará Vite, típicamente en `http://localhost:5173`.

2. **Ejecuta la Auditoría:**
   
   Desde tu cliente MCP (Gemini, Claude, etc.):
   > "Ejecuta un análisis de Lighthouse en http://localhost:5173 enfocándote en SEO y Accesibilidad."

   La herramienta generará un reporte JSON en el directorio `lighthouse-mcp-server` y te mostrará un resumen de los puntajes.

## Pruebas Manuales

Para verificar que el servidor funciona correctamente sin un cliente MCP completo, puedes ejecutar el script directamente. Esto no iniciará una auditoría, pero confirmará que no hay errores de sintaxis o módulos faltantes.

```bash
cd lighthouse-mcp-server
node index.js
```
*El proceso esperará entrada en stdin (protocolo JSON-RPC). Si no se cierra inmediatamente con un error, está configurado correctamente.*
