## 🔧 ¿Qué es un dynamic image rendering endpoint?

Un *dynamic image rendering endpoint* es un **punto de acceso HTTP** que genera imágenes **bajo demanda**, por ejemplo:

* Infografías personalizadas
* Gráficos
* Avatares con iniciales
* Badges (como shields.io)

Se suele implementar en backend (ej. NestJS) con librerías como **canvas**, **puppeteer**, **QuickChart**, o servicios headless.

---

## ✅ Ventajas de los dynamic image rendering endpoints

### 1. **Universalidad y compatibilidad**

* Una imagen (`.png`, `.svg`) se puede consumir en **cualquier frontend** (Next.js, React, Vue, emails, apps móviles, PDFs...).
* No requiere JS para renderizarse en el cliente.

### 2. **Ideal para contenidos no interactivos**

* Perfecto para contenido **visual que no necesita interacción**, como dashboards, thumbnails o etiquetas.

### 3. **Caching agresivo posible**

* Puedes aplicar `Cache-Control`, `ETag` o usar un CDN (Cloudflare, Vercel Edge) para **cachear la imagen final**, incluso si fue generada dinámicamente.

### 4. **Independiente del framework frontend**

* Reutilizable 100% entre proyectos y tecnologías. No importa si usas React, Vue, o HTML puro.

---

## ❌ Inconvenientes (rendimiento y escalabilidad)

### 1. **Consumo alto de CPU/RAM**

* Generar imágenes dinámicamente (especialmente con canvas o puppeteer) puede ser **costoso en tiempo y recursos**, comparado con servir contenido estático o prerenderizado.

### 2. **Problemas de latencia**

* El tiempo de respuesta de una imagen generada puede ser >200ms, frente a \~10ms para una imagen estática servida desde CDN.

### 3. **Escalabilidad limitada si no se cachea**

* Si cada request genera una imagen distinta y no cacheable, escalar requiere más instancias de backend y posiblemente balanceo de carga.

### 4. **Sin interactividad**

* Aunque son visuales, las imágenes no permiten interacción (hover, click, dinámica interna), a diferencia de componentes frontend.

---

## ⚔️ Comparación con otras alternativas

| Alternativa                     | Tiempo inicial | Carga en cliente | Ideal para                         | Caché CDN posible | Interactividad |
| ------------------------------- | -------------- | ---------------- | ---------------------------------- | ----------------- | -------------- |
| **Dynamic image endpoint**      | Alto           | Bajo             | Gráficos, previews, contenido fijo | ✅ (si se cachea)  | ❌              |
| **Web Components**              | Medio          | Medio            | Interfaz interactiva reutilizable  | ❌ (JS requerido)  | ✅              |
| **JAMstack (SSG)**              | Bajo           | Bajo             | Contenido estático que cambia poco | ✅                 | Opcional       |
| **SSR (Server-side rendering)** | Medio          | Bajo             | SEO + contenido dinámico           | Parcial           | ✅              |
| **CSR (Client-side rendering)** | Bajo           | Alto             | Apps SPA, interacción compleja     | ❌                 | ✅              |

---

## 📊 Cuándo elegir dynamic image endpoints

Úsalo cuando:

* Quieres **mostrar contenido visual y personalizado**, sin requerir lógica cliente.
* Necesitas **reutilización extrema entre frontends** (una imagen se puede incluir en PDFs, correos, HTML, apps...).
* Puedes aplicar **caché de manera agresiva** (usando parámetros como hashes en la URL).
* No necesitas **interacción ni accesibilidad avanzada** en la imagen.

Evítalo si:

* El coste computacional es un problema en escala (usa SSG o prerendering).
* Requieres contenido **interactivo o accesible**.
* Puedes resolver el mismo caso con SVGs generados estáticamente o con Web Components interactivos.

