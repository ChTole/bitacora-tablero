# Changelog

Todos los cambios relevantes de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa [versionado semántico](https://semver.org/lang/es/).

## [0.1.0] - 2026-11-24

Primera versión publicada en <https://bitacora-tablero.netlify.app>.

### Agregado

- Página de inicio con las simulaciones que tienen datos, sus sesiones y la fecha de la última.
- Tablero del Taller de Ensamblado:
  - KPIs generales y resultado de las sesiones;
  - evolución en el tiempo;
  - comparación por mueble;
  - rango de duración;
  - impacto de la ayuda;
  - motivos de error y mapa de calor de uniones.
- Filtros por mueble, dispositivo y rango de fechas.
- Listado de sesiones cerradas con búsqueda por alias, y detalle de cada sesión con su recorrido.
- Aviso de arranque en frío mientras la API de Render se despierta.
- Gráficos con ECharts cargados de forma diferida, con una paleta validada para daltonismo y formato numérico es-AR.
- `robots.txt`, `sitemap.xml`, `llms.txt` y el manifiesto ARD en `/.well-known/ard.json`.
- Entorno de desarrollo con Docker y despliegue en Netlify.

### Accesibilidad

- Textos secundarios con colores sólidos y un contraste de 4,5:1 o más.

[0.1.0]: https://github.com/ChTole/bitacora-tablero/releases/tag/v0.1.0