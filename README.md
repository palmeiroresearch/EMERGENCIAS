# 🚨 Emergencias Pro

PWA completa de protocolos de emergencias médicas para cuerpo de guardia con algoritmos de decisión, calculadoras integradas y funcionalidad offline.

## 🚀 Acceso rápido
**URL:** `https://tu-usuario.github.io/EmergenciasPro/`

## 📋 Características principales

### Módulos de Emergencias
- **❤️ Cardiovascular:** IMA, EPA, Crisis HTA, Shock, Arritmias
- **⚡ Paro Cardíaco:** Algoritmos ACLS completos, RCP, Manejo post-RCCP
- **🧠 Neurológico:** ACV, Status epiléptico, Coma
- **⚗️ Metabólico:** CAD, Crisis tiroidea, Hipoglucemia
- **🔬 Ácido-Base:** Acidosis, Alcalosis, Hipercalemia, Hiponatremia
- **🫁 Respiratorio:** Crisis asmática, EPOC, Neumotórax
- **🩺 Gastrointestinal:** HDA, HDB, Abdomen agudo
- **🦠 Infeccioso:** Sepsis, Meningitis, Neumonía grave
- **☠️ Intoxicaciones:** Organofosforados, Paracetamol, Opioides

### Características técnicas
✅ **Alternativas terapéuticas** adaptadas a disponibilidad en Cuba  
✅ **Calculadoras integradas:** Líquidos IV, dosis, gasometría, electrolitos  
✅ **Protocolos algorítmicos** paso a paso con árbol de decisiones  
✅ **Manejo de líquidos detallado** con tipos de soluciones y cálculos  
✅ **Base de datos de medicamentos** con dosis, preparación y disponibilidad  
✅ **PWA instalable** - Funciona offline después de primera carga  
✅ **Diseño responsive** optimizado para móviles  

## 📦 Estructura del proyecto

```
EmergenciasPro/
├── index.html              # Página principal
├── manifest.json           # Configuración PWA
├── sw.js                   # Service Worker
├── styles/
│   └── main.css           # Estilos globales
├── js/
│   ├── app.js             # Lógica principal
│   ├── calculators.js     # Calculadoras integradas
│   └── algorithms.js      # Algoritmos de decisión
├── data/
│   ├── cardiovascular.json  # Protocolos cardiovasculares
│   ├── paro.json           # Protocolos de paro cardíaco
│   ├── acidbase.json       # Trastornos ácido-base
│   └── medications.json    # Base de medicamentos
├── icon-192.png
├── icon-512.png
└── README.md
```

## 🛠️ Instalación y despliegue

### Paso 1: Preparar archivos locales

1. **Crear carpeta del proyecto:**
```bash
mkdir EmergenciasPro
cd EmergenciasPro
```

2. **Copiar todos los archivos** del proyecto en esta carpeta siguiendo la estructura anterior.

3. **Crear iconos PNG:**
   - Usa herramientas como Canva, GIMP o Figma
   - Temática: Cruz roja + símbolo emergencia ⚡
   - Colores: Rojo (#dc2626) y blanco
   - Tamaños: `icon-192.png` (192×192px) y `icon-512.png` (512×512px)

### Paso 2: Subir a GitHub

1. **Inicializar repositorio:**
```bash
git init
git add .
git commit -m "Initial commit - Emergencias Pro"
```

2. **Crear repositorio en GitHub:**
   - Ve a https://github.com/new
   - Nombre: `EmergenciasPro`
   - Público
   - Sin README (ya lo tienes)

3. **Conectar y subir:**
```bash
git remote add origin https://github.com/TU-USUARIO/EmergenciasPro.git
git branch -M main
git push -u origin main
```

### Paso 3: Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. **Settings** → **Pages**
3. **Source:** Deploy from a branch
4. **Branch:** `main` → `/ (root)`
5. **Save**
6. Espera 2-3 minutos
7. Tu app estará en: `https://TU-USUARIO.github.io/EmergenciasPro/`

### Paso 4: Probar instalación PWA

**En móvil Android:**
- Chrome → Menú (⋮) → "Añadir a pantalla de inicio"

**En móvil iOS:**
- Safari → Botón compartir (📤) → "Añadir a pantalla de inicio"

**En PC:**
- Chrome → Icono de instalación en barra de direcciones

## 💡 Guía de uso

### Flujo de trabajo típico en guardia:

1. **Abrir app** → Seleccionar módulo de emergencia
2. **Elegir patología** específica
3. **Seguir protocolo** paso a paso:
   - Evaluación inicial (ABC, signos vitales, labs)
   - Estratificación por severidad
   - Algoritmo de decisión
   - Tratamiento secuencial
4. **Usar calculadoras** integradas:
   - Líquidos IV con goteo
   - Dosis de medicamentos
   - Gasometría arterial
   - Corrección de electrolitos
5. **Monitorear** criterios de mejoría/deterioro

### Ejemplo: Edema Pulmonar Agudo

1. Módulo **Cardiovascular** → **Edema Pulmonar Agudo**
2. Ver **Evaluación inicial**: ABC, signos vitales, labs urgentes
3. **Estratificar** según PA:
   - PAS ≥140 → EPA hipertensivo
   - PAS 100-140 → EPA normotensivo
   - PAS <100 → Shock cardiogénico
4. **Protocolo secuencial:**
   - Paso 1: Oxigenación (opciones según SatO2)
   - Paso 2: Reducción precarga (diuréticos + nitratos)
   - Paso 3: Tratamiento según presión
5. **Usar calculadora de líquidos** para restricción hídrica
6. **Monitorear** criterios de mejoría

### Ejemplo: Paro Cardíaco

1. Módulo **Paro Cardíaco** → **Paro Cardiorrespiratorio**
2. **Algoritmo universal:**
   - Reconocer paro
   - Activar código azul
   - Iniciar RCP
3. **Clasificar ritmo:** FV/TV (desfibrilable) vs Asistolia/AESP
4. **Seguir algoritmo** específico del ritmo
5. **Usar checklist RCP** y timer integrado
6. **Buscar causas** reversibles (5H + 5T)

## 🔬 Calculadoras incluidas

### 1. Líquidos IV
- Cálculo de volumen según peso y velocidad
- Conversión a gotas/min según tipo de goteo
- Cálculo de frascos necesarios
- Calculadora de bolos de rescate
- Límites de seguridad automáticos

### 2. Dosis de medicamentos
- Base de datos completa
- Cálculo automático por peso
- Alternativas según disponibilidad Cuba
- Preparación de infusiones

### 3. Gasometría arterial
- Interpretación automática pH, PCO2, HCO3
- Diagnóstico de trastorno primario
- Evaluación de compensación
- Análisis de oxigenación

### 4. Corrección de electrolitos
- Déficit de bicarbonato
- Corrección de Na, K, Ca, Mg
- Fórmulas y velocidades de infusión

## 📚 Protocolos incluidos

### Cardiovascular completo
- **IMA:** IMACEST vs IMASEST, estrategia de reperfusión, fibrinólisis
- **EPA:** Estratificación por PA, tratamiento secuencial, inotrópicos
- **Crisis HTA:** Emergencia vs urgencia, opciones terapéuticas
- **Shock:** Clasificación, manejo específico por tipo

### Paro cardíaco ACLS
- **Algoritmo universal** de paro
- **RCP alta calidad:** Compresiones, ventilación, vía aérea
- **Ritmos desfibrilables:** FV/TV, secuencia desfibrilación
- **Ritmos no desfibrilables:** Asistolia, AESP
- **Causas reversibles:** 5H + 5T
- **Manejo post-RCCP:** Hipotermia, sedación, pronóstico
- **Situaciones especiales:** Embarazo, ahogamiento, hipotermia

### Ácido-Base y Electrolitos
- **Acidosis metabólica:** Anion gap, CAD, acidosis láctica
- **Alcalosis metabólica:** Salino-sensible vs resistente
- **Hipercalemia:** Cardioprotección, shift, eliminación
- **Hipocalemia:** Reposición oral vs IV, cálculo de déficit
- **Hiponatremia:** Clasificación, SIADH, precaución mielinólisis
- **Hipernatremia:** Cálculo de déficit de agua

## ⚠️ Consideraciones importantes

### Uso apropiado
✅ Herramienta de apoyo al juicio clínico  
✅ Basado en guías internacionales (ACLS, OPS)  
✅ Adaptado a realidad cubana (disponibilidad medicamentos)  
✅ Siempre validar con protocolos institucionales  

### Limitaciones
❌ No reemplaza el juicio médico  
❌ No sustituye evaluación individual del paciente  
❌ Los cálculos son orientativos  
❌ Requiere internet para primera carga  

### Advertencias
⚠️ Medicamentos: Verificar disponibilidad local  
⚠️ Dosis: Ajustar según función renal, peso, edad  
⚠️ Líquidos: Vigilar sobrecarga en cardiopatías  
⚠️ Protocolos: Pueden variar según institución  

## 🔄 Actualización de contenido

Para actualizar protocolos o agregar nuevas patologías:

1. **Editar archivos JSON** en carpeta `data/`
2. **Incrementar versión** en `sw.js`:
```javascript
const CACHE_VERSION = 'emergencias-pro-v1.0.1';
```
3. **Commit y push** a GitHub:
```bash
git add .
git commit -m "Actualización protocolos"
git push
```
4. Los usuarios recibirán actualización automática

## 🐛 Solución de problemas

**No funciona offline:**
- Recarga con Ctrl+F5 o Cmd+Shift+R
- Verifica que service worker esté registrado (Consola dev)

**No se instala como PWA:**
- Verifica que uses HTTPS (GitHub Pages lo usa automáticamente)
- Confirma que `manifest.json` y iconos PNG existan

**Calculadoras no funcionan:**
- Abre consola de desarrollador (F12)
- Verifica errores de JavaScript
- Confirma que archivos JS se cargaron

**Datos no aparecen:**
- Verifica que archivos JSON estén en carpeta `data/`
- Revisa sintaxis JSON (sin comas finales)
- Comprueba en Network tab que JSON se descarguen

## 👨‍⚕️ Desarrollado para

- Estudiantes de Medicina en práctica preprofesional
- Médicos generales de cuerpo de guardia
- Médicos de emergencias y UCI
- Personal médico en formación

## 📖 Referencias

- American Heart Association - ACLS Guidelines
- OPS/PAHO - Manejo clínico de emergencias
- UpToDate - Protocolos de emergencias
- Guías cubanas de práctica clínica

## 🤝 Contribuciones

Mejoras o sugerencias:
1. Fork del proyecto
2. Crea rama (`git checkout -b feature/NuevoProtocolo`)
3. Commit cambios (`git commit -m 'Agregar protocolo X'`)
4. Push (`git push origin feature/NuevoProtocolo`)
5. Abre Pull Request

## 📄 Licencia

Uso libre para fines educativos y asistenciales.

## ⚕️ Disclaimer

Esta herramienta es de apoyo clínico. El manejo definitivo debe basarse en evaluación individual del paciente, juicio clínico y protocolos institucionales. No reemplaza formación médica ni supervisión apropiada.

---

**Desarrollado con ❤️ para facilitar la práctica clínica en emergencias**

*Última actualización: Noviembre 2025*
