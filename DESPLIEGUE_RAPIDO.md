# 🚀 GUÍA RÁPIDA DE DESPLIEGUE - EMERGENCIAS PRO

## ✅ LO QUE TIENES

Una PWA completa con:
- ✅ 9 módulos de emergencias médicas
- ✅ Protocolos completos de EPA, IMA, Paro Cardíaco, Ácido-Base
- ✅ Calculadoras integradas (líquidos IV, dosis, gasometría)
- ✅ Base de datos de medicamentos
- ✅ Alternativas terapéuticas para Cuba
- ✅ Funcionalidad offline

## 📋 LO QUE NECESITAS HACER

### 1. CREAR ICONOS (5 minutos)

Necesitas 2 archivos PNG:
- `icon-192.png` (192×192 píxeles)
- `icon-512.png` (512×512 píxeles)

**Opciones para crearlos:**

**A) Canva (más fácil):**
1. Ve a www.canva.com
2. Crea diseño personalizado 192×192
3. Agrega: Cruz roja + símbolo rayo ⚡
4. Fondo: Rojo (#dc2626)
5. Descargar como PNG
6. Repetir para 512×512

**B) Figma/GIMP:**
- Diseño simple con cruz médica y símbolo emergencia
- Colores: Rojo y blanco
- Exportar en ambos tamaños

**C) Usar generador online:**
- https://www.favicon-generator.org/
- Sube una imagen base
- Genera iconos automáticamente

### 2. SUBIR A GITHUB (10 minutos)

```bash
# En tu terminal/Git Bash:

# 1. Ir a la carpeta del proyecto
cd EmergenciasPro

# 2. Agregar los iconos que creaste
# (copia icon-192.png y icon-512.png a esta carpeta)

# 3. Inicializar Git
git init
git add .
git commit -m "Initial commit - Emergencias Pro"

# 4. Crear repositorio en GitHub
# Ve a: https://github.com/new
# Nombre: EmergenciasPro
# Público
# NO inicializar con README

# 5. Conectar y subir
git remote add origin https://github.com/TU-USUARIO/EmergenciasPro.git
git branch -M main
git push -u origin main
```

### 3. ACTIVAR GITHUB PAGES (2 minutos)

1. Ve a tu repositorio: `https://github.com/TU-USUARIO/EmergenciasPro`
2. Click en **Settings** (arriba derecha)
3. En menú izquierdo: **Pages**
4. En **Source**: selecciona `main` branch y `/ (root)`
5. Click **Save**
6. ¡Listo! Tu app estará en:
   `https://TU-USUARIO.github.io/EmergenciasPro/`

### 4. PROBAR LA APP (5 minutos)

**En tu móvil:**
- Abre la URL en Chrome/Safari
- Menú → "Añadir a pantalla de inicio"
- ¡Ahora funciona offline!

**En tu PC:**
- Abre la URL en Chrome
- Verás icono de instalación en barra de direcciones
- Click para instalar como app de escritorio

## 🎯 VERIFICACIÓN RÁPIDA

✅ La app carga en el navegador  
✅ Ves los 9 módulos en la pantalla principal  
✅ Al entrar a "Cardiovascular" ves lista de patologías  
✅ Al entrar a "Edema Pulmonar Agudo" ves el protocolo completo  
✅ Las calculadoras funcionan (prueba la de líquidos IV)  
✅ Se puede instalar como PWA  
✅ Funciona offline después de primera carga  

## 🔧 SI ALGO NO FUNCIONA

**"No veo las patologías":**
- Abre consola del navegador (F12)
- Ve a tab "Network"
- Verifica que archivos JSON se descarguen
- Si hay error 404: revisa que carpeta `data/` exista

**"No se instala como PWA":**
- Verifica que usas HTTPS (GitHub Pages lo usa automáticamente)
- Confirma que `manifest.json` existe
- Asegúrate que los iconos PNG existen y tienen los nombres correctos

**"Calculadoras no calculan":**
- Abre consola (F12) → tab "Console"
- Busca errores en rojo
- Verifica que archivos JS estén en carpeta `js/`

**"Funciona en PC pero no en móvil":**
- Limpia caché del navegador móvil
- Recarga la página
- Espera a que service worker se instale

## 📱 ESTRUCTURA FINAL

```
EmergenciasPro/
├── index.html              ✅
├── manifest.json           ✅
├── sw.js                   ✅
├── icon-192.png           ⚠️ DEBES CREAR
├── icon-512.png           ⚠️ DEBES CREAR
├── styles/
│   └── main.css           ✅
├── js/
│   ├── app.js             ✅
│   ├── calculators.js     ✅
│   └── algorithms.js      ✅
├── data/
│   ├── cardiovascular.json ✅
│   ├── paro.json          ✅
│   ├── acidbase.json      ✅
│   └── medications.json   ✅
└── README.md              ✅
```

## 🎓 PRÓXIMOS PASOS (OPCIONAL)

Una vez funcionando, puedes:

1. **Añadir más módulos:**
   - Crea archivos JSON en `data/` para módulos faltantes
   - Sigue el formato de `cardiovascular.json`

2. **Personalizar protocolos:**
   - Edita archivos JSON
   - Incrementa versión en `sw.js`
   - Commit y push a GitHub

3. **Agregar medicamentos:**
   - Edita `medications.json`
   - Añade nuevos medicamentos con mismo formato

4. **Mejorar calculadoras:**
   - Edita `calculators.js`
   - Añade nuevas funciones de cálculo

## ⏱️ TIEMPO TOTAL ESTIMADO

- Crear iconos: 5 min
- Subir a GitHub: 10 min
- Activar Pages: 2 min
- Probar app: 5 min

**TOTAL: ~20-25 minutos** y tienes tu PWA funcionando! 🎉

## 📞 SOPORTE

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica que todos los archivos existan
3. Confirma que GitHub Pages esté activado
4. Intenta en modo incógnito para descartar caché

---

**¡Éxito en tu despliegue! 🚀**
