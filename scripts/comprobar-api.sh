#!/bin/sh
# Prueba de humo contra una instancia en marcha de la pasarela (local o en
# contenedor). Comprueba que los endpoints responden lo esperado.
#
# GET /salud/servicios no se comprueba aquí porque necesita NATS y los
# microservicios en marcha (en la CI la pasarela arranca sola).
#
# Uso: sh scripts/comprobar-api.sh [URL_BASE]   (por defecto http://localhost:3000)
# Necesita curl.

BASE_URL="${1:-http://localhost:3000}"
fallos=0

ok() { echo "  ✔ $1"; }
ko() { echo "  ✘ $1"; fallos=$((fallos + 1)); }

# Hace una petición y deja el cuerpo en $body y el código HTTP en $status.
peticion() {
  metodo="$1"
  ruta="$2"
  datos="$3"
  if [ -n "$datos" ]; then
    respuesta=$(curl -s -w '\n%{http_code}' -X "$metodo" "$BASE_URL$ruta" \
      -H "Content-Type: application/json" -d "$datos")
  else
    respuesta=$(curl -s -w '\n%{http_code}' -X "$metodo" "$BASE_URL$ruta")
  fi
  status=$(printf '%s\n' "$respuesta" | tail -n 1)
  body=$(printf '%s\n' "$respuesta" | sed '$d')
}

# Comprueba el código HTTP y, si se indica, el cuerpo exacto de la respuesta.
comprobar() {
  descripcion="$1"
  esperado="$2"
  cuerpo="$3"
  if [ "$status" != "$esperado" ]; then
    ko "$descripcion (HTTP $status, se esperaba $esperado): $body"
  elif [ -n "$cuerpo" ] && [ "$body" != "$cuerpo" ]; then
    ko "$descripcion (respuesta inesperada): $body"
  else
    ok "$descripcion"
  fi
}

echo "Prueba de humo contra $BASE_URL"

# Añade aquí una comprobación por cada endpoint nuevo.
peticion GET /salud
comprobar "GET /salud responde 200" 200 '{"servicio":"gateway","estado":"ok"}'

peticion GET /no-existe
comprobar "una ruta desconocida devuelve 404" 404

if [ "$fallos" -gt 0 ]; then
  echo "Han fallado $fallos comprobaciones."
  exit 1
fi
echo "Todas las comprobaciones han pasado."
