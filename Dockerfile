# Entorno de desarrollo del tablero. En producción no se usa: Netlify compila la app y publica
# los archivos estáticos.
FROM node:24-slim

ENV NG_CLI_ANALYTICS=false

WORKDIR /app
RUN chown node:node /app

# Usuario sin privilegios (UID 1000): los archivos creados en el contenedor quedan a tu nombre
USER node

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node . .

EXPOSE 4200
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
