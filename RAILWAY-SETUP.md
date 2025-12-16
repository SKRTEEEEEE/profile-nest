# 🚂 Railway - Configuración de Deploy

Guía para desplegar profile-nest en Railway con el package `@skrteeeeee/profile-domain`.

## 📋 Prerequisitos

1. Token de GitHub con scope `read:packages`
   - Ve a: https://github.com/settings/tokens
   - Crea un token **Classic** con scope: ✅ `read:packages`
   - Guarda el token (ejemplo: `ghp_xxxxxxxxxxxx`)

2. Proyecto en Railway
   - Conectado al repositorio de GitHub
   - Railway detecta automáticamente el Dockerfile

## ⚙️ Configuración

### 1. Configurar Variable de Entorno

En tu proyecto de Railway:

```
Settings → Variables → New Variable

Name: NPM_TOKEN
Value: ghp_tu_token_de_github_aqui

Click "Add"
```

### 2. Verificar Dockerfile

Railway usa automáticamente el `Dockerfile` en la raíz del proyecto.

El Dockerfile está configurado para:
- ✅ Leer `NPM_TOKEN` de las variables de Railway
- ✅ Instalar el package `@skrteeeeee/profile-domain` desde GitHub Packages
- ✅ Eliminar el submodule `src/domain` (usa el package)
- ✅ Construir la aplicación

### 3. Deploy

Railway hace deploy automáticamente cuando:
- Haces push a la rama configurada (ej: `main`)
- O cuando clickeas **"Deploy"** manualmente

**Railway ejecuta:**
```bash
docker build --build-arg NPM_TOKEN=$NPM_TOKEN -t profile-nest .
```

## 🔍 Verificación

### Logs de Build

En Railway, ve a **Deployments** → Click en el deploy → **Build Logs**

Deberías ver:
```
✅ Submodule removed - using package instead
> nest build
[Build successful]
```

### Si falla el build:

**Error: "401 Unauthorized"**
```
npm error 401 Unauthorized - GET https://npm.pkg.github.com/@skrteeeeee/profile-domain
```
→ Verifica que:
1. La variable `NPM_TOKEN` está configurada
2. El token tiene el scope `read:packages`
3. El token es del mismo usuario que publicó el package

**Error: "Cannot find module 'src/domain/...'**
```
TS2307: Cannot find module 'src/domain/entities/user'
```
→ Verifica que el package esté instalado:
- Check en los logs: `added ... packages` debe incluir `@skrteeeeee/profile-domain`

## 📝 Variables de Entorno Adicionales

Además de `NPM_TOKEN`, configura las variables que necesite tu app:

```
DATABASE_URL=...
JWT_SECRET=...
PORT=3000
NODE_ENV=production
# etc.
```

## 🔄 Actualización del Package

Cuando publiques una nueva versión de `@skrteeeeee/profile-domain`:

1. Actualiza `package.json` en profile-nest:
   ```bash
   npm install @skrteeeeee/profile-domain@0.0.3
   git commit -am "chore: bump profile-domain to 0.0.3"
   git push
   ```

2. Railway detecta el push y redeploya automáticamente

## 🐛 Troubleshooting

### El token no se reconoce

**Síntoma:** Build falla con 401 incluso con `NPM_TOKEN` configurado

**Solución:**
1. Verifica que la variable se llama exactamente `NPM_TOKEN` (case-sensitive)
2. Elimina y vuelve a crear la variable
3. Fuerza un redeploy: Settings → Redeploy

### Build es muy lento

**Síntoma:** El build tarda más de 5 minutos

**Solución:**
- Railway no cachea layers de Docker por defecto
- Es normal que el primer build sea lento
- Builds posteriores son más rápidos si no cambias dependencies

### La app no inicia después del build

**Síntoma:** Build exitoso pero la app crashea

**Solución:**
1. Verifica los **Runtime Logs** en Railway
2. Asegúrate de que todas las variables de entorno están configuradas
3. Verifica que el `CMD` del Dockerfile es correcto:
   ```dockerfile
   CMD ["node", "dist/src/main"]
   ```

## 🔒 Seguridad

### ⚠️ El token en ARG

Aunque usamos `ARG NPM_TOKEN` (que normalmente es inseguro), en Railway es aceptable porque:

1. ✅ Railway construye en entornos efímeros (desaparecen después)
2. ✅ El token NO queda en la imagen final (se elimina después de `npm ci`)
3. ✅ Railway no expone el historial de build públicamente

### ✅ Mejores prácticas

- Usa un token dedicado solo para `read:packages`
- NO uses tu token personal de admin
- Rota el token periódicamente
- Revoca el token si detectas uso sospechoso

## 📚 Referencias

- [Railway Docs - Environment Variables](https://docs.railway.app/develop/variables)
- [Railway Docs - Dockerfiles](https://docs.railway.app/deploy/dockerfiles)
- [GitHub Packages - NPM](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
