# ---- Etapa 1: build ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

# ---- Etapa 2: runtime ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

# Solo las dependencias de producción, sin las de desarrollo
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist

# Nunca ejecutes la aplicación como root (la imagen de Node ya trae el usuario node)
USER node

EXPOSE 3000
# La imagen alpine no trae curl, así que el healthcheck usa el propio Node.
# Apunta a la ruta raíz porque todavía no hay un endpoint /health.
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=5 \
  CMD node -e "fetch('http://localhost:3000/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "dist/main"]
