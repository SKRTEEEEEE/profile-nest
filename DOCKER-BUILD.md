# 🐳 Docker Build - Uso Seguro de Secrets

Este Dockerfile usa **BuildKit secrets** para manejar el `NPM_TOKEN` de forma segura, **sin dejarlo en el historial de la imagen**.

## 🔒 Construcción Segura

### Opción 1: Desde archivo `.env`

```bash
# 1. Asegúrate de tener el token en .env
# .env:
# GITHUB_TOKEN=ghp_tu_token_aqui

# 2. Build con secret desde .env
DOCKER_BUILDKIT=1 docker build \
  --secret id=npm_token,src=<(echo -n $GITHUB_TOKEN) \
  -t profile-nest:latest .
```

### Opción 2: Desde variable de entorno

```bash
# 1. Exporta el token
export NPM_TOKEN=ghp_tu_token_aqui

# 2. Build con secret desde env
DOCKER_BUILDKIT=1 docker build \
  --secret id=npm_token,env=NPM_TOKEN \
  -t profile-nest:latest .
```

### Opción 3: Desde archivo de secreto

```bash
# 1. Crea un archivo temporal con el token
echo "ghp_tu_token_aqui" > /tmp/npm_token

# 2. Build con secret desde archivo
DOCKER_BUILDKIT=1 docker build \
  --secret id=npm_token,src=/tmp/npm_token \
  -t profile-nest:latest .

# 3. Elimina el archivo temporal
rm /tmp/npm_token
```

## 🚀 En CI/CD

### GitHub Actions

```yaml
- name: Build Docker image
  env:
    DOCKER_BUILDKIT: 1
  run: |
    docker build \
      --secret id=npm_token,env=NPM_TOKEN \
      -t profile-nest:latest .
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Railway

Railway detecta automáticamente el Dockerfile y pasa las variables de entorno como `ARG`.

**Configuración:**
1. Ve a tu proyecto en Railway
2. Selecciona el servicio `profile-nest`
3. Ve a **Variables** → **New Variable**
4. Agrega:
   ```
   Name: NPM_TOKEN
   Value: ghp_tu_token_de_github_aqui
   ```
5. Railway lo pasa automáticamente como `--build-arg NPM_TOKEN=...`

**⚠️ Nota de seguridad en Railway:**
- El Dockerfile usa `ARG` como fallback para Railway
- Railway construye en entornos efímeros, el token NO queda expuesto
- Para máxima seguridad en local, usa BuildKit secrets (opciones 1-3 arriba)

## ⚠️ IMPORTANTE

### ✅ LO QUE SÍ HACE (seguro):
- El token se monta como secret temporal en `/run/secrets/npm_token`
- Se usa solo durante `npm install`
- Se elimina automáticamente después
- **NO queda en el historial de layers de Docker**
- **NO se puede extraer de la imagen final**

### ❌ LO QUE NO DEBES HACER:
```bash
# ❌ MALO: El token queda en el historial de la imagen
docker build --build-arg NPM_TOKEN=ghp_xxx .

# ❌ MALO: El token queda visible en docker history
ARG NPM_TOKEN
ENV NPM_TOKEN=${NPM_TOKEN}
```

## 🔍 Verificación

Verifica que el token NO esté en la imagen:

```bash
# 1. Construye la imagen
DOCKER_BUILDKIT=1 docker build \
  --secret id=npm_token,env=NPM_TOKEN \
  -t profile-nest:latest .

# 2. Verifica el historial (NO debe aparecer el token)
docker history profile-nest:latest

# 3. Inspecciona la imagen (NO debe haber secrets)
docker inspect profile-nest:latest | grep -i token
```

## 📚 Referencias

- [Docker BuildKit Secrets](https://docs.docker.com/build/building/secrets/)
- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
