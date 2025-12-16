# 🔄 Configuración Híbrida: Domain Submodule + Package

Este proyecto usa una **configuración híbrida** para `domain`:
- **Desarrollo local:** Submodule en `src/domain/` (edición directa)
- **CI/CD y Producción:** Package `@skrteeeeee/profile-domain` desde GitHub Packages

## 🎯 ¿Por qué híbrido?

### Ventajas del enfoque:
✅ **Dev local rápido:** Editas `src/domain/` y ves cambios inmediatos
✅ **Tests instantáneos:** No necesitas publicar para probar
✅ **Producción consistente:** CI/CD usa versión específica del package
✅ **Versionado claro:** `package.json` define qué versión está en prod
✅ **Mismo código:** Imports idénticos en dev y prod

## 📁 Estructura

```
profile-nest/
├── src/
│   ├── domain/              # Submodule (SOLO en desarrollo)
│   │   └── src/
│   │       ├── entities/    # Tipos compartidos
│   │       └── flows/       # Errores y flows
│   ├── modules/
│   └── ...
├── node_modules/
│   └── @skrteeeeee/
│       └── profile-domain/  # Package (CI/CD y fallback)
├── .npmrc                   # Config para GitHub Packages
├── package.json             # Versión del package
└── tsconfig.json            # Path mapping híbrido
```

## ⚙️ Configuración

### 1. TypeScript Path Mapping (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "paths": {
      "src/domain/entities/*": [
        "src/domain/src/entities/*",              // 1. Intenta submodule
        "node_modules/@skrteeeeee/profile-domain/src/entities/*"  // 2. Fallback a package
      ],
      "src/domain/flows/*": [
        "src/domain/src/flows/*",
        "node_modules/@skrteeeeee/profile-domain/src/flows/*"
      ]
    }
  }
}
```

**Cómo funciona:**
- TypeScript intenta resolver desde `src/domain/src/*` primero
- Si no existe (CI/CD), usa `node_modules/@skrteeeeee/profile-domain/*`
- **Mismo import en todos lados:** `import { X } from 'src/domain/entities/...'`

### 2. GitHub Actions (`.github/workflows/node.yml`)

```yaml
- name: Checkout
  uses: actions/checkout@v4
  # NO incluir: with.submodules: true

- name: Remove submodule (force package usage)
  run: |
    rm -rf src/domain
    echo "✅ Will use package instead"

- name: Install dependencies
  run: npm ci
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 3. Dockerfile (con BuildKit Secrets)

Ver [DOCKER-BUILD.md](./DOCKER-BUILD.md) para instrucciones detalladas.

```dockerfile
# Usa BuildKit secret (NO queda en la imagen)
RUN --mount=type=secret,id=npm_token \
  echo "@skrteeeeee:registry=https://npm.pkg.github.com" > ~/.npmrc && \
  echo "//npm.pkg.github.com/:_authToken=$(cat /run/secrets/npm_token)" >> ~/.npmrc && \
  npm ci && \
  rm -f ~/.npmrc

# Elimina submodule si existe
RUN rm -rf src/domain
```

## 🔄 Workflow de Desarrollo

### Día a día (desarrollo local):

```bash
# 1. Trabajas normalmente con el submodule
cd src/domain
# Editas entities, flows, etc.

# 2. Tests locales - usan el submodule
npm run test

# 3. Cuando terminas, haces commit en domain
cd src/domain
git add .
git commit -m "feat: add UserFormS type"
git push origin main

# 4. Publicas nueva versión del package
cd ../../../profile-domain
npm version patch  # 0.0.2 → 0.0.3
npm publish

# 5. Actualizas el package en profile-nest
cd ../profile-nest
npm install @skrteeeeee/profile-domain@0.0.3

# 6. Commit del bump de versión
git add package.json package-lock.json
git commit -m "chore: bump profile-domain to 0.0.3"
git push
```

### En CI/CD (automático):

```bash
# GitHub Actions:
1. Checkout (SIN submodules)
2. Elimina src/domain/
3. npm ci instala el package desde GitHub Packages
4. Build usa node_modules/@skrteeeeee/profile-domain
✅ Usa versión exacta de package.json
```

## 🔍 Verificación

### Local (con submodule):
```bash
# Verifica que el submodule existe
ls src/domain/src/entities

# Build local debe funcionar
npm run build
```

### Simulando CI/CD:
```bash
# 1. Elimina el submodule temporalmente
mv src/domain src/domain.bak

# 2. Build debe funcionar con el package
npm run build

# 3. Restaura el submodule
mv src/domain.bak src/domain
```

## ⚠️ Cosas a recordar

### ✅ SIEMPRE:
- Publica el package después de cambios en domain
- Actualiza la versión en `package.json` después de publicar
- El package define qué va a producción

### ❌ NUNCA:
- No pushes cambios del submodule sin publicar
- No olvides actualizar la versión en profile-nest
- No uses `ARG` para `NPM_TOKEN` en Dockerfile

## 🐛 Troubleshooting

### "Cannot find name 'UserBase'"
→ Falta el import: `import { UserBase } from 'src/domain/entities/user'`

### "Module not found: src/domain/..."
→ Verifica que:
1. El submodule existe en dev: `ls src/domain`
2. El package está instalado: `ls node_modules/@skrteeeeee/profile-domain`
3. El `tsconfig.json` tiene los paths correctos

### CI/CD falla con "401 Unauthorized"
→ Configura el secreto `NPM_TOKEN` en GitHub:
```
Settings → Secrets → Actions → New repository secret
Name: NPM_TOKEN
Value: ghp_tu_token_aqui (con scope: read:packages)
```

### Docker build falla con "unauthenticated"
→ Usa BuildKit secrets (ver [DOCKER-BUILD.md](./DOCKER-BUILD.md)):
```bash
DOCKER_BUILDKIT=1 docker build \
  --secret id=npm_token,env=NPM_TOKEN \
  -t profile-nest .
```

## 📚 Referencias

- [TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
- [GitHub Packages - NPM](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [Docker BuildKit Secrets](https://docs.docker.com/build/building/secrets/)
