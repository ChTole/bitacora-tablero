# Bitácora · Tablero

Tablero de métricas de aprendizaje de las simulaciones que registran su telemetría con [Bitácora](https://github.com/ChTole/bitacora): tiempos, errores, uniones y uso de la ayuda, a partir de los datos anónimos de cada sesión.

Consume la API de solo lectura de [Bitácora API](https://github.com/ChTole/bitacora-api) (`/stats/v1`), documentada en su [contrato del tablero](https://github.com/ChTole/bitacora-api/blob/main/docs/api-tablero.md). La primera simulación es el [Taller de Ensamblado](https://github.com/ChTole/taller-ensamblado).

## Estado

🚧 En desarrollo.

- [x] Estructura del proyecto, tema visual y acceso a la API.
- [x] Página principal con las simulaciones.
- [x] Tablero de una simulación: filtros y tarjetas de métricas.
- [x] Gráficos de resumen, evolución y comparación por mueble.
- [x] Gráficos de dificultades: fallas por motivo y mapa de calor por caja.
- [x] Sesiones: búsqueda por alias y recorrido de una sesión.
- [ ] Publicación en Netlify.

## Stack

- **Angular 22**, con componentes standalone, signals y `httpResource`.
- **Bootstrap 5**, con la paleta y la tipografía (Lato) del portfolio y del Taller.
- **Apache ECharts**, con `ngx-echarts`. Se carga recién cuando una página muestra el primer gráfico.

## Puesta en marcha

Solo se necesita **Docker**. Node corre en un contenedor: no hace falta instalarlo.

```bash
docker compose -f docker-compose-dev.yml up --build
```

El tablero queda en `http://127.0.0.1:4200` y se recarga solo al guardar un archivo.

Necesita la API corriendo en `http://127.0.0.1:8000`, desde el repo [bitacora-api](https://github.com/ChTole/bitacora-api). Los dos proyectos se levantan por separado: el navegador es el que llama a la API, así que los contenedores no necesitan comunicarse entre sí.

**Dependencias.** Se instalan desde el contenedor, para que se actualicen a la vez `package.json` y las dependencias del contenedor:

```bash
docker compose -f docker-compose-dev.yml exec web npm install <paquete>
```

**Tests:**

```bash
docker compose -f docker-compose-dev.yml exec web npx ng test --watch=false
```

## Páginas

| Ruta | Contenido |
|---|---|
| `/` | Simulaciones con datos |
| `/{simulación}` | Tablero: métricas, resumen, evolución, comparación y dificultades |
| `/{simulación}/sesiones?alias=...` | Sesiones cerradas, con búsqueda por alias |
| `/{simulación}/sesiones/{id}` | Detalle de una sesión, con su recorrido |

La búsqueda acepta el alias en la URL, así que una simulación puede enlazar directamente a la sesión que se acaba de terminar, por ejemplo `/taller-ensamblado/sesiones?alias=Tero%20Alegre`.

## Configuración

La URL de la API está en `src/environments`:

| Archivo | Uso | API |
|---|---|---|
| `environment.development.ts` | `ng serve` | `http://127.0.0.1:8000` |
| `environment.ts` | `ng build` (producción) | El servicio en Render |

En producción, el dominio del tablero tiene que estar en `CORS_ALLOWED_ORIGINS` de la API.

**Servidor dormido.** La API corre en el plan gratuito de Render, que la apaga sin tráfico. Al cargar, el tablero la despierta con `/healthz` y, si tarda, muestra un aviso mientras se activa.

## Estructura

```
src/app/
├── core/          Acceso a la API, tipos, formatos y estado del servidor
├── charts/        Gráficos, su paleta y los módulos de ECharts que usan
└── pages/         Una carpeta por página: inicio, tablero, sesiones y detalle de una sesión
```

## Licencia

[MIT](LICENSE)
