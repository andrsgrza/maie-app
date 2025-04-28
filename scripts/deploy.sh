#!/bin/bash

# Exit immediately on error
set -e

# 1. Validar que las variables necesarias están presentes
REQUIRED_VARS=("MAIE_GATEWAY_HOST_PATH" "S3_BUCKET_NAME" "CLOUDFRONT_DIST_ID")
source .env.production
echo $MAIE_GATEWAY_HOST_PATH

echo "Verificando variables de entorno necesarias..."
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Error: La variable de entorno '$var' no está definida."
    exit 1
  fi
done

echo "Variables de entorno OK."

# 2. Ejecutar build del frontend
echo "Construyendo el frontend..."
npm run build

# 3. Verificar que el directorio dist/ existe
if [ ! -d "dist" ]; then
  echo "Error: No se encontró el directorio 'dist/'. ¿Falló el build?"
  exit 1
fi

# 4. Subir archivos al bucket S3
echo "Sincronizando 'dist/' con el bucket s3://${S3_BUCKET_NAME}..."
aws s3 sync dist/ s3://${S3_BUCKET_NAME} --delete

# 5. Invalidar la caché de CloudFront
echo "Invalidando caché de CloudFront..."
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_DIST_ID \
  --paths "/*" \
  --no-cli-pager

echo "Despliegue completo."
