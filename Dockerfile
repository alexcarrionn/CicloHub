# Una sola receta para todas las apps del monorepo. La app se elige con el
# argumento APP (por defecto, la pasarela):
#   docker build -t ciclohub-prestamos --build-arg APP=prestamos .
ARG APP=gateway

# ---- Etapa 1: build ----
FROM node:22-alpine AS build
ARG APP
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY apps ./apps
COPY libs ./libs
# Nest compila la app con webpack en un único fichero (las librerías del
# monorepo van dentro); se deja como dist/main.js para que el CMD sea igual
# en todas las imágenes.
RUN npx nest build "$APP" && cp "dist/apps/$APP/main.js" dist/main.js

# ---- Etapa 2: runtime ----
FROM node:22-alpine
ARG APP
WORKDIR /app
ENV NODE_ENV=production
ENV APP=$APP

# Solo las dependencias de producción, sin las de desarrollo
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist/main.js ./dist/main.js

# Nunca ejecutes la aplicación como root (la imagen de Node ya trae el usuario node)
USER node

EXPOSE 3000
# La imagen alpine no trae curl, así que el healthcheck usa el propio Node.
# Solo la pasarela escucha HTTP: comprueba GET /salud. Los microservicios solo
# escuchan NATS, así que su imagen no lleva comprobación HTTP; su estado se
# consulta desde la pasarela con GET /salud/servicios.
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=5 \
  CMD [ "$APP" != "gateway" ] || node -e "fetch('http://localhost:3000/salud').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "dist/main"]
