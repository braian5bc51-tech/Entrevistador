# VO2MAX Entrevistas

App para grabar entrevistas clínicas pre-prueba de esfuerzo, transcribirlas y generar automáticamente una planilla Excel lista para revisar.

---

## Funciones

- **Grabar** — usa el micrófono del dispositivo con reconocimiento de voz en español argentino
- **Transcribir** — convierte el audio a texto en tiempo real (Web Speech API), editable antes de procesar
- **Generar Excel** — Claude extrae los datos de cada paciente y genera un `.xlsx` con el mismo formato de siempre: encabezados, colores de estado, celdas amarillas para datos faltantes, hoja de instrucciones

---

## Cómo instalarla en el teléfono (dos opciones)

### Opción A — PWA desde el navegador (más rápido)

1. Subí el repo a GitHub y activá **GitHub Pages** (Settings → Pages → Source: GitHub Actions).
2. La URL quedará como `https://tuusuario.github.io/vo2max-entrevistas/`.
3. En Android, abrí esa URL en **Chrome**.
4. Chrome mostrará un banner "Instalar app" o lo encontrás en el menú → "Añadir a pantalla de inicio" → **Instalar** (no el acceso directo, sino la opción que dice "Instalar").
5. La app se instala como una **WebAPK real** — aparece en el cajón de apps, puede desinstalarse como cualquier otra app y no muestra la barra del navegador.

### Opción B — APK nativo con Capacitor (más robusto)

Requiere crear un tag en GitHub y esperar que el workflow compile el APK (~10 minutos).

```bash
# Clonar y preparar
git clone https://github.com/tuusuario/vo2max-entrevistas.git
cd vo2max-entrevistas
npm install
npm run build
npx cap add android     # solo la primera vez
npx cap sync android

# Crear un tag para disparar el build del APK
git tag v1.0.0
git push origin v1.0.0
```

El APK aparecerá en **Releases** de GitHub. Descargalo, habilitá "Fuentes desconocidas" en Android e instalá.

---

## Setup inicial

### 1. Clonar el repo

```bash
git clone https://github.com/tuusuario/vo2max-entrevistas.git
cd vo2max-entrevistas
npm install
```

### 2. Correr en desarrollo

```bash
npm run dev
# Abrí http://localhost:5173 en el navegador
```

### 3. Clave de API

En la app, pantalla de Configuración, ingresá tu clave de Claude:
- Obtenéla en [console.anthropic.com](https://console.anthropic.com)
- Se guarda **solo en el dispositivo** (localStorage), nunca sale del mismo

---

## Cómo se usa

1. Abrí la app → ingresá la clave de API y la fecha del estudio
2. Presioná **Iniciar grabación** antes de empezar la entrevista
3. Hablá con el paciente normalmente — el texto aparece en pantalla
4. Presioná **Detener** al terminar
5. Revisá la transcripción y corregí si hace falta
6. Presioná **Procesar con IA** — Claude estructura los datos automáticamente
7. Revisá el resumen de pacientes y presioná **Descargar Excel**

El archivo descargado tiene el nombre `DD-MM-YYYY.xlsx` con la fecha del estudio.

---

## Reglas aplicadas automáticamente

- Cero abreviaturas médicas (hipertensión arterial, nunca HTA; infarto agudo de miocardio, nunca IAM, etc.)
- Celdas amarillas para datos que no se pudieron extraer
- Estado verde = Prueba realizada / naranja = Entrevista cargada
- Si el DNI o algún dato es poco claro en el audio, se marca con "(confirmar con el paciente)"
- Varios pacientes en una sola entrevista → una fila por cada uno

---

## Estructura del proyecto

```
vo2max-entrevistas/
├── src/
│   ├── App.tsx                  # Orquestador de pantallas
│   ├── types.ts                 # Tipos TypeScript
│   ├── components/
│   │   ├── Settings.tsx         # Configuración API key + fecha
│   │   ├── Recorder.tsx         # Grabación + transcripción en vivo
│   │   ├── TranscriptEditor.tsx # Revisión y edición del texto
│   │   └── ExcelExport.tsx      # Resultado + descarga
│   ├── services/
│   │   ├── claude.ts            # Llamada a la API de Claude
│   │   └── excel.ts             # Generación del Excel con SheetJS
│   └── styles/App.css
├── public/manifest.json         # PWA manifest
├── .github/workflows/
│   ├── deploy.yml               # Deploy automático a GitHub Pages
│   └── build-apk.yml            # Build del APK Android (en tags)
├── capacitor.config.ts
├── vite.config.ts
└── package.json
```

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| React + TypeScript | UI |
| Vite | Build |
| Web Speech API | Transcripción de voz (español AR) |
| Claude API (Anthropic) | Extracción de datos del paciente |
| SheetJS (xlsx) | Generación del archivo Excel |
| Capacitor | Empaquetado como APK Android |
| GitHub Actions | Deploy y build automáticos |

---

## Notas

- La transcripción de voz funciona mejor en **Chrome** (Android y desktop). Safari tiene soporte limitado.
- El reconocimiento de voz requiere conexión a internet (se procesa en servidores de Google).
- La clave de Claude se guarda solo en el dispositivo. No se envía a ningún servidor propio.
- El costo por entrevista procesada con Claude es de aproximadamente USD 0.01–0.03 dependiendo de la extensión.
