// Variables globales
let currentModule = null;
let currentPathology = null;
let moduleData = {};
let medicationsDB = {};
let fluidsDB = {};

// Elementos del DOM
const homeScreen = document.getElementById('homeScreen');
const moduleScreen = document.getElementById('moduleScreen');
const moduleContent = document.getElementById('moduleContent');
const backButton = document.getElementById('backButton');

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    await loadAllData();
    setupEventListeners();
    updateConnectionStatus();
});

// Cargar todas las bases de datos
async function loadAllData() {
    try {
        // Cargar bases de datos de patologías
        const modules = ['cardiovascular', 'paro', 'respiratory', 'neurological', 'metabolic', 'acidbase'];
        
        for (const module of modules) {
            try {
                const response = await fetch(`data/${module}.json`);
                if (response.ok) {
                    moduleData[module] = await response.json();
                }
            } catch (error) {
                console.log(`Módulo ${module} no disponible aún`);
            }
        }

        // Cargar medicamentos
        try {
            const medResponse = await fetch('data/medications.json');
            if (medResponse.ok) {
                medicationsDB = await medResponse.json();
            }
        } catch (error) {
            console.log('Base de medicamentos no disponible');
        }

        // Cargar líquidos
        try {
            const fluidsResponse = await fetch('data/fluids.json');
            if (fluidsResponse.ok) {
                fluidsDB = await fluidsResponse.json();
            }
        } catch (error) {
            console.log('Base de líquidos no disponible');
        }

        console.log('Datos cargados:', Object.keys(moduleData));
    } catch (error) {
        console.error('Error cargando datos:', error);
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Click en módulos
    document.querySelectorAll('.module-card').forEach(card => {
        card.addEventListener('click', () => {
            const module = card.dataset.module;
            loadModule(module);
        });
    });

    // Botón volver
    backButton.addEventListener('click', () => {
        if (currentPathology) {
            // Si estamos en una patología, volver a lista de patologías
            showPathologyList(currentModule);
        } else {
            // Si estamos en lista de patologías, volver al inicio
            showHome();
        }
    });
}

// Mostrar pantalla de inicio
function showHome() {
    homeScreen.style.display = 'block';
    moduleScreen.style.display = 'none';
    currentModule = null;
    currentPathology = null;
}

// Cargar módulo
function loadModule(moduleName) {
    currentModule = moduleName;
    currentPathology = null;

    if (!moduleData[moduleName]) {
        showModuleNotAvailable(moduleName);
        return;
    }

    showPathologyList(moduleName);
}

// Mostrar lista de patologías del módulo
function showPathologyList(moduleName) {
    currentPathology = null;
    const data = moduleData[moduleName];
    
    let html = `
        <div class="card">
            <h2>${getModuleName(moduleName)}</h2>
            <div class="pathology-list">
    `;

    Object.keys(data).forEach(pathologyKey => {
        const pathology = data[pathologyKey];
        const priorityIcon = getPriorityIcon(pathology.prioridad);
        
        html += `
            <div class="pathology-item" onclick="loadPathology('${moduleName}', '${pathologyKey}')">
                <h3>${priorityIcon} ${pathology.nombre}</h3>
                <p>${pathology.categoria || ''}</p>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    moduleContent.innerHTML = html;
    homeScreen.style.display = 'none';
    moduleScreen.style.display = 'block';
}

// Cargar patología específica
function loadPathology(moduleName, pathologyKey) {
    currentModule = moduleName;
    currentPathology = pathologyKey;
    
    const pathology = moduleData[moduleName][pathologyKey];
    
    let html = `<div class="card">`;
    html += `<h2>${pathology.nombre}</h2>`;

    // SELECTOR DE DISPONIBILIDAD DE MEDICAMENTOS
    html += renderAvailabilitySelector();

    // Evaluación inicial
    if (pathology.evaluacion_inicial) {
        html += renderEvaluacionInicial(pathology.evaluacion_inicial);
    }

    // Estratificación
    if (pathology.estratificacion) {
        html += renderEstratificacion(pathology.estratificacion);
    }

    // Clasificación
    if (pathology.clasificacion) {
        html += renderClasificacion(pathology.clasificacion);
    }

    // Protocolo secuencial
    if (pathology.protocolo_secuencial) {
        html += renderProtocoloSecuencial(pathology.protocolo_secuencial);
    }

    // Algoritmo universal (para paro)
    if (pathology.algoritmo_universal) {
        html += renderAlgoritmoUniversal(pathology.algoritmo_universal);
    }

    // RCP alta calidad
    if (pathology.rcp_alta_calidad) {
        html += renderRCPAltaCalidad(pathology.rcp_alta_calidad);
    }

    // Ritmos desfibrilables/no desfibrilables
    if (pathology.ritmos_desfibrilables) {
        html += renderRitmosDesfibrilables(pathology.ritmos_desfibrilables);
    }
    if (pathology.ritmos_no_desfibrilables) {
        html += renderRitmosNoDesfibrilables(pathology.ritmos_no_desfibrilables);
    }

    // Hidratación
    if (pathology.hidratacion) {
        html += renderHidratacion(pathology.hidratacion);
    }

    // Gasometría
    if (pathology.gasometria) {
        html += renderGasometria(pathology.gasometria);
    }

    // Monitoreo
    if (pathology.monitoreo) {
        html += renderMonitoreo(pathology.monitoreo);
    }

    // Criterios de mejoría/deterioro
    if (pathology.criterios_mejoria) {
        html += renderCriteriosMejoria(pathology.criterios_mejoria);
    }
    if (pathology.criterios_deterioro) {
        html += renderCriteriosDeterioro(pathology.criterios_deterioro);
    }

    html += `</div>`;

    // Añadir calculadoras si es necesario
    if (needsFluidCalculator(pathology)) {
        html += renderFluidCalculator();
    }

    if (needsMedicationCalculator(pathology)) {
        html += renderMedicationCalculator();
    }

    moduleContent.innerHTML = html;
    homeScreen.style.display = 'none';
    moduleScreen.style.display = 'block';

    // Activar calculadoras
    if (needsFluidCalculator(pathology)) {
        activateFluidCalculator();
    }
    
    if (needsMedicationCalculator(pathology)) {
        activateMedicationCalculator();
    }
}

// Funciones de renderizado
function renderEvaluacionInicial(evaluacion) {
    let html = `
        <div class="info-box">
            <h4>📋 Evaluación Inicial</h4>
    `;

    if (evaluacion.abc) {
        html += `<p><strong>ABC:</strong></p><ul>`;
        for (const [key, value] of Object.entries(evaluacion.abc)) {
            html += `<li><strong>${key}:</strong> ${value}</li>`;
        }
        html += `</ul>`;
    }

    if (evaluacion.signos_vitales_criticos) {
        html += `<p><strong>Signos vitales críticos:</strong> ${evaluacion.signos_vitales_criticos.join(', ')}</p>`;
    }

    if (evaluacion.labs_urgentes) {
        html += `<p><strong>Laboratorios urgentes:</strong> ${evaluacion.labs_urgentes.join(', ')}</p>`;
    }

    if (evaluacion.imagen) {
        html += `<p><strong>Imagen:</strong> ${evaluacion.imagen}</p>`;
    }

    html += `</div>`;
    return html;
}

function renderEstratificacion(estratificacion) {
    let html = `
        <div class="warning-box">
            <h4>📊 Estratificación</h4>
    `;

    estratificacion.forEach(grupo => {
        html += `
            <div class="mb-10">
                <strong>${grupo.nombre}:</strong> ${grupo.criterio}<br>
                <em>Prioridad: ${grupo.prioridad}</em>
            </div>
        `;
    });

    html += `</div>`;
    return html;
}

function renderClasificacion(clasificacion) {
    let html = `
        <div class="info-box">
            <h4>📊 Clasificación</h4>
    `;

    clasificacion.forEach(tipo => {
        html += `
            <div class="mb-10">
                <strong>${tipo.tipo}:</strong><br>
                Criterio: ${tipo.criterio}<br>
                ${tipo.urgencia ? `Urgencia: ${tipo.urgencia}` : ''}
            </div>
        `;
    });

    html += `</div>`;
    return html;
}

function renderProtocoloSecuencial(protocolo) {
    let html = `<h3>🔄 Protocolo Secuencial</h3>`;

    Object.keys(protocolo).forEach(pasoKey => {
        const paso = protocolo[pasoKey];
        html += `
            <div class="collapsible">
                <div class="collapsible-header" onclick="toggleCollapsible(this)">
                    <h4>${paso.nombre}</h4>
                    <span class="collapsible-arrow">▶</span>
                </div>
                <div class="collapsible-content">
        `;

        if (paso.descripcion) {
            html += `<p>${paso.descripcion}</p>`;
        }

        if (paso.opciones) {
            html += `<div class="medication-list">`;
            paso.opciones.forEach(opcion => {
                html += renderOpcionTratamiento(opcion);
            });
            html += `</div>`;
        }

        if (paso.diureticos) {
            html += `<h4>Diuréticos</h4><div class="medication-list">`;
            paso.diureticos.forEach(med => {
                html += renderMedicamento(med);
            });
            html += `</div>`;
        }

        if (paso.nitratos) {
            html += `<h4>Nitratos</h4><div class="medication-list">`;
            paso.nitratos.forEach(med => {
                html += renderMedicamento(med);
            });
            html += `</div>`;
        }

        if (paso.grupo_hipertensivo) {
            html += renderGrupoPresion('Grupo Hipertensivo (PAS ≥140)', paso.grupo_hipertensivo);
        }
        if (paso.grupo_normotensivo) {
            html += renderGrupoPresion('Grupo Normotensivo (PAS 100-140)', paso.grupo_normotensivo);
        }
        if (paso.grupo_shock) {
            html += renderGrupoShock(paso.grupo_shock);
        }

        html += `
                </div>
            </div>
        `;
    });

    return html;
}

function renderMedicamento(med) {
    let html = `
        <div class="medication-item">
            <h4>${med.medicamento || med.nombre}
                ${med.primera_linea ? ' ⭐' : ''}
                <span class="text-small text-muted">(${getDisponibilidadText(med.disponibilidad_cuba)})</span>
            </h4>
    `;

    // Renderizar dosis
    if (med.dosis) {
        if (typeof med.dosis === 'string') {
            html += `<div class="dose">💊 ${med.dosis}</div>`;
        } else if (typeof med.dosis === 'object') {
            html += `<div class="dose">`;
            for (const [key, value] of Object.entries(med.dosis)) {
                const keyFormatted = formatKey(key);
                html += `<strong>${keyFormatted}:</strong> ${value}<br>`;
            }
            html += `</div>`;
        }
    }

    // Dosis específicas con etiquetas claras
    if (med.dosis_inicial) html += `<div class="dose"><strong>Dosis inicial:</strong> ${med.dosis_inicial}</div>`;
    if (med.dosis_carga) html += `<div class="dose"><strong>Dosis de carga:</strong> ${med.dosis_carga}</div>`;
    if (med.dosis_bolo) html += `<div class="dose"><strong>Bolo:</strong> ${med.dosis_bolo}</div>`;
    if (med.infusion) html += `<div class="dose"><strong>Infusión:</strong> ${med.infusion}</div>`;
    if (med.infusion_continua && typeof med.infusion_continua === 'object') {
        html += `<div class="info-box" style="margin-top: 10px; padding: 10px;">`;
        html += `<strong>Infusión continua:</strong><br>`;
        for (const [key, value] of Object.entries(med.infusion_continua)) {
            html += `${formatKey(key)}: ${value}<br>`;
        }
        html += `</div>`;
    }

    // Preparación
    if (med.preparacion && typeof med.preparacion === 'object') {
        html += `<div class="info-box" style="margin-top: 10px; padding: 10px;">`;
        html += `<strong>Preparación:</strong><br>`;
        for (const [key, value] of Object.entries(med.preparacion)) {
            if (typeof value === 'object') {
                html += `<em>${formatKey(key)}:</em><br>`;
                for (const [k, v] of Object.entries(value)) {
                    html += `&nbsp;&nbsp;• ${formatKey(k)}: ${v}<br>`;
                }
            } else {
                html += `${formatKey(key)}: ${value}<br>`;
            }
        }
        html += `</div>`;
    } else if (med.preparacion && typeof med.preparacion === 'string') {
        html += `<p><strong>Preparación:</strong> ${med.preparacion}</p>`;
    }

    // Otras propiedades
    if (med.administracion) html += `<p><strong>Administración:</strong> ${med.administracion}</p>`;
    if (med.indicacion) html += `<p><strong>Indicación:</strong> ${med.indicacion}</p>`;
    if (med.inicio_accion) html += `<p><strong>Inicio:</strong> ${med.inicio_accion}</p>`;
    if (med.reevaluacion) html += `<p><strong>Reevaluar:</strong> ${med.reevaluacion}</p>`;
    if (med.objetivo) html += `<p><strong>Objetivo:</strong> ${med.objetivo}</p>`;
    if (med.ventaja) html += `<p class="text-muted"><strong>Ventaja:</strong> ${med.ventaja}</p>`;
    if (med.desventaja) html += `<p class="text-muted"><strong>Desventaja:</strong> ${med.desventaja}</p>`;
    if (med.efectos) html += `<p class="text-muted"><strong>Efectos:</strong> ${med.efectos}</p>`;
    if (med.vigilar) html += `<p class="text-muted"><strong>Vigilar:</strong> ${med.vigilar}</p>`;
    
    // Presentaciones
    if (med.presentaciones && Array.isArray(med.presentaciones)) {
        html += `<p class="text-small text-muted"><strong>Presentaciones:</strong> ${med.presentaciones.join(', ')}</p>`;
    }

    // Contraindicaciones y precauciones
    if (med.contraindicacion) {
        if (Array.isArray(med.contraindicacion)) {
            html += `<div class="error-box" style="padding: 8px; margin-top: 8px;">`;
            html += `<strong>⛔ Contraindicaciones:</strong><ul style="margin: 5px 0 0 20px;">`;
            med.contraindicacion.forEach(ci => html += `<li>${ci}</li>`);
            html += `</ul></div>`;
        } else {
            html += `<div class="error-box" style="padding: 8px; margin-top: 8px;">⛔ ${med.contraindicacion}</div>`;
        }
    }
    
    if (med.precaucion) {
        if (Array.isArray(med.precaucion)) {
            html += `<div class="warning-box" style="padding: 8px; margin-top: 8px;">`;
            html += `<strong>⚠️ Precauciones:</strong><ul style="margin: 5px 0 0 20px;">`;
            med.precaucion.forEach(p => html += `<li>${p}</li>`);
            html += `</ul></div>`;
        } else {
            html += `<div class="warning-box" style="padding: 8px; margin-top: 8px;">⚠️ ${med.precaucion}</div>`;
        }
    }

    html += `</div>`;
    return html;
}

// Función auxiliar para formatear claves
function formatKey(key) {
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

function renderOpcionTratamiento(opcion) {
    let html = `<div class="medication-item">`;
    html += `<h4>${opcion.metodo || opcion.medicamento}</h4>`;
    if (opcion.indicacion) html += `<p>${opcion.indicacion}</p>`;
    if (opcion.flujo) html += `<p><strong>Flujo:</strong> ${opcion.flujo}</p>`;
    if (opcion.objetivo) html += `<p><strong>Objetivo:</strong> ${opcion.objetivo}</p>`;
    if (opcion.contraindicaciones) {
        html += `<div class="error-box" style="padding: 10px; margin-top: 10px;">`;
        html += `<strong>Contraindicaciones:</strong><ul>`;
        opcion.contraindicaciones.forEach(ci => html += `<li>${ci}</li>`);
        html += `</ul></div>`;
    }
    html += `</div>`;
    return html;
}

function renderGrupoPresion(titulo, grupo) {
    if (!grupo) return '';
    
    let html = `
        <div class="info-box mt-20">
            <h4>${titulo}</h4>
    `;

    if (grupo.pas) html += `<p><strong>PAS:</strong> ${grupo.pas}</p>`;
    if (grupo.objetivo) html += `<p><strong>Objetivo:</strong> ${grupo.objetivo}</p>`;
    if (grupo.prioridad) html += `<p><strong>Prioridad:</strong> ${grupo.prioridad}</p>`;

    if (grupo.tratamiento_base && Array.isArray(grupo.tratamiento_base)) {
        html += `<p><strong>Tratamiento base:</strong> ${grupo.tratamiento_base.join(', ')}</p>`;
    } else if (grupo.tratamiento && Array.isArray(grupo.tratamiento)) {
        html += `<p><strong>Tratamiento:</strong> ${grupo.tratamiento.join(', ')}</p>`;
    }

    if (grupo.antihipertensivos_adicionales && Array.isArray(grupo.antihipertensivos_adicionales)) {
        html += `<h4 style="margin-top: 15px;">Antihipertensivos adicionales:</h4>`;
        html += `<div class="medication-list">`;
        grupo.antihipertensivos_adicionales.forEach(med => {
            html += renderMedicamento(med);
        });
        html += `</div>`;
    }

    html += `</div>`;
    return html;
}

function renderGrupoShock(grupo) {
    if (!grupo) return '';
    
    let html = `
        <div class="error-box mt-20">
    `;
    
    if (grupo.diagnostico) html += `<h4>${grupo.diagnostico}</h4>`;
    if (grupo.pas) html += `<p><strong>PAS:</strong> ${grupo.pas}</p>`;
    
    if (grupo.causas_buscar && Array.isArray(grupo.causas_buscar)) {
        html += `<p><strong>Causas a buscar:</strong> ${grupo.causas_buscar.join(', ')}</p>`;
    }

    if (grupo.precauciones && typeof grupo.precauciones === 'object') {
        html += `<div class="warning-box" style="margin-top: 10px;">`;
        html += `<strong>⚠️ Precauciones:</strong><br>`;
        for (const [key, value] of Object.entries(grupo.precauciones)) {
            html += `<strong>${formatKey(key)}:</strong> ${value}<br>`;
        }
        html += `</div>`;
    }

    if (grupo.inotropicos && Array.isArray(grupo.inotropicos)) {
        html += `<h4 style="margin-top: 15px;">Inotrópicos y vasopresores:</h4>`;
        html += `<div class="medication-list">`;
        grupo.inotropicos.forEach(med => {
            html += renderMedicamento(med);
        });
        html += `</div>`;
    }

    html += `</div>`;
    return html;
}

function renderAlgoritmoUniversal(algoritmo) {
    let html = `
        <div class="warning-box">
            <h4>⚡ Algoritmo Universal de Paro</h4>
    `;

    Object.keys(algoritmo).forEach(pasoKey => {
        const paso = algoritmo[pasoKey];
        html += `<div class="mb-10">`;
        html += `<strong>${pasoKey.replace('_', ' ').toUpperCase()}:</strong> ${paso.accion}<br>`;
        
        if (paso.verificar) {
            html += `Verificar: ${paso.verificar.join(', ')}<br>`;
        }
        if (paso.pedir) {
            html += `Pedir: ${paso.pedir.join(', ')}<br>`;
        }
        if (paso.tiempo_maximo) {
            html += `<em>${paso.tiempo_maximo}</em><br>`;
        }
        
        html += `</div>`;
    });

    html += `</div>`;
    return html;
}

function renderRCPAltaCalidad(rcp) {
    let html = `
        <div class="success-box">
            <h4>✅ RCP de Alta Calidad</h4>
    `;

    if (rcp.compresiones) {
        html += `<p><strong>Compresiones:</strong></p><ul>`;
        for (const [key, value] of Object.entries(rcp.compresiones)) {
            html += `<li>${key.replace(/_/g, ' ')}: ${value}</li>`;
        }
        html += `</ul>`;
    }

    if (rcp.ventilacion) {
        html += `<p><strong>Ventilación:</strong></p><ul>`;
        for (const [key, value] of Object.entries(rcp.ventilacion)) {
            html += `<li>${key.replace(/_/g, ' ')}: ${value}</li>`;
        }
        html += `</ul>`;
    }

    html += `</div>`;
    return html;
}

function renderRitmosDesfibrilables(ritmos) {
    let html = `
        <div class="card">
            <h3>⚡ Ritmos Desfibrilables (FV/TV sin pulso)</h3>
    `;

    if (ritmos.secuencia) {
        html += `<h4>Secuencia de tratamiento:</h4>`;
        Object.keys(ritmos.secuencia).forEach(pasoKey => {
            const paso = ritmos.secuencia[pasoKey];
            html += `<div class="decision-step"><strong>${pasoKey}:</strong> ${paso.accion}`;
            if (paso.duracion) html += ` - ${paso.duracion}`;
            if (paso.durante_rcp) html += `<br>Durante RCP: ${paso.durante_rcp.join(', ')}`;
            html += `</div>`;
        });
    }

    if (ritmos.medicamentos) {
        html += `<h4>Medicamentos:</h4><div class="medication-list">`;
        ritmos.medicamentos.forEach(med => html += renderMedicamento(med));
        html += `</div>`;
    }

    html += `</div>`;
    return html;
}

function renderRitmosNoDesfibrilables(ritmos) {
    let html = `
        <div class="card">
            <h3>📉 Ritmos No Desfibrilables (Asistolia/AESP)</h3>
    `;

    if (ritmos.secuencia) {
        html += `<h4>Secuencia de tratamiento:</h4>`;
        Object.keys(ritmos.secuencia).forEach(pasoKey => {
            const paso = ritmos.secuencia[pasoKey];
            html += `<div class="decision-step"><strong>${pasoKey}:</strong> ${paso.accion}`;
            if (paso.importante) html += `<br><strong>⚠️ ${paso.importante}</strong>`;
            html += `</div>`;
        });
    }

    if (ritmos.medicamentos) {
        html += `<h4>Medicamentos:</h4><div class="medication-list">`;
        ritmos.medicamentos.forEach(med => html += renderMedicamento(med));
        html += `</div>`;
    }

    html += `</div>`;
    return html;
}

function renderHidratacion(hidratacion) {
    let html = `
        <div class="info-box">
            <h4>💧 Manejo de Líquidos</h4>
            <p><strong>Regla:</strong> ${hidratacion.regla}</p>
    `;

    for (const [key, value] of Object.entries(hidratacion)) {
        if (key !== 'regla') {
            html += `<p><strong>${key.replace(/_/g, ' ')}:</strong> ${value}</p>`;
        }
    }

    html += `</div>`;
    return html;
}

function renderGasometria(gasometria) {
    let html = `
        <div class="info-box">
            <h4>🔬 Gasometría</h4>
    `;

    if (gasometria.patron_esperado) {
        html += `<p><strong>Patrón esperado:</strong></p><ul>`;
        for (const [key, value] of Object.entries(gasometria.patron_esperado)) {
            html += `<li>${key}: ${value}</li>`;
        }
        html += `</ul>`;
    }

    html += `</div>`;
    return html;
}

function renderMonitoreo(monitoreo) {
    let html = `
        <div class="warning-box">
            <h4>📊 Monitoreo</h4><ul>
    `;

    for (const [key, value] of Object.entries(monitoreo)) {
        html += `<li><strong>${key.replace(/_/g, ' ')}:</strong> ${value}</li>`;
    }

    html += `</ul></div>`;
    return html;
}

function renderCriteriosMejoria(criterios) {
    let html = `
        <div class="success-box">
            <h4>✅ Criterios de Mejoría</h4><ul>
    `;
    criterios.forEach(criterio => html += `<li>${criterio}</li>`);
    html += `</ul></div>`;
    return html;
}

function renderCriteriosDeterioro(criterios) {
    let html = `
        <div class="error-box">
            <h4>⚠️ Criterios de Deterioro</h4>
    `;

    if (Array.isArray(criterios)) {
        html += `<ul>`;
        criterios.forEach(criterio => html += `<li>${criterio}</li>`);
        html += `</ul>`;
    } else {
        for (const [key, value] of Object.entries(criterios)) {
            if (Array.isArray(value)) {
                html += `<p><strong>${key}:</strong></p><ul>`;
                value.forEach(item => html += `<li>${item}</li>`);
                html += `</ul>`;
            } else {
                html += `<p><strong>${key}:</strong> ${value}</p>`;
            }
        }
    }

    html += `</div>`;
    return html;
}

// Selector de disponibilidad de medicamentos
let selectedAvailability = ['alta', 'media', 'baja']; // Por defecto todos

function renderAvailabilitySelector() {
    return `
        <div class="warning-box">
            <h4>💊 Disponibilidad de Medicamentos</h4>
            <p>Selecciona qué medicamentos están disponibles en tu centro:</p>
            <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-top: 10px;">
                <label style="cursor: pointer;">
                    <input type="checkbox" id="avail_alta" checked onchange="updateAvailability()">
                    ✅ Alta disponibilidad
                </label>
                <label style="cursor: pointer;">
                    <input type="checkbox" id="avail_media" checked onchange="updateAvailability()">
                    🟡 Disponibilidad limitada
                </label>
                <label style="cursor: pointer;">
                    <input type="checkbox" id="avail_baja" checked onchange="updateAvailability()">
                    🔴 Disponibilidad escasa
                </label>
            </div>
        </div>
    `;
}

function updateAvailability() {
    selectedAvailability = [];
    if (document.getElementById('avail_alta')?.checked) selectedAvailability.push('alta');
    if (document.getElementById('avail_media')?.checked) selectedAvailability.push('media');
    if (document.getElementById('avail_baja')?.checked) selectedAvailability.push('baja');
    
    // Filtrar medicamentos visibles
    document.querySelectorAll('.medication-item').forEach(item => {
        const availText = item.querySelector('.text-small.text-muted')?.textContent || '';
        const isVisible = 
            (selectedAvailability.includes('alta') && availText.includes('Disponible')) ||
            (selectedAvailability.includes('media') && availText.includes('Limitada')) ||
            (selectedAvailability.includes('baja') && availText.includes('Escasa'));
        
        item.style.display = isVisible ? 'block' : 'none';
    });
}

// Utilidades
function getModuleName(moduleName) {
    const nombres = {
        'cardiovascular': '❤️ Cardiovascular',
        'respiratorio': '🫁 Respiratorio',
        'neurologico': '🧠 Neurológico',
        'metabolico': '⚗️ Metabólico',
        'acidobase': '🔬 Ácido-Base',
        'gastrointestinal': '🩺 Gastrointestinal',
        'infeccioso': '🦠 Infeccioso',
        'intoxicaciones': '☠️ Intoxicaciones',
        'paro': '⚡ Paro Cardíaco'
    };
    return nombres[moduleName] || moduleName;
}

function getPriorityIcon(priority) {
    const icons = {
        'critica': '🔴',
        'maxima': '⚡',
        'alta': '🟠',
        'media': '🟡'
    };
    return icons[priority] || '';
}

function getDisponibilidadText(disponibilidad) {
    const texts = {
        'alta': '✅ Disponible',
        'media': '🟡 Limitada',
        'baja': '🔴 Escasa',
        'muy baja': '⛔ Muy escasa'
    };
    return texts[disponibilidad] || '';
}

function toggleCollapsible(element) {
    element.parentElement.classList.toggle('active');
}

function showModuleNotAvailable(moduleName) {
    moduleContent.innerHTML = `
        <div class="card">
            <h2>${getModuleName(moduleName)}</h2>
            <div class="warning-box">
                <h4>⚠️ Módulo en desarrollo</h4>
                <p>Este módulo estará disponible próximamente.</p>
            </div>
        </div>
    `;
    homeScreen.style.display = 'none';
    moduleScreen.style.display = 'block';
}

// Determinar si necesita calculadoras
function needsFluidCalculator(pathology) {
    return pathology.hidratacion || pathology.nombre.toLowerCase().includes('shock');
}

function needsMedicationCalculator(pathology) {
    return true; // Todas las patologías pueden beneficiarse
}

// Activar calculadora de medicamentos
function activateMedicationCalculator() {
    const pesoInput = document.getElementById('medPeso');
    const buscarInput = document.getElementById('medBuscar');
    
    if (!pesoInput || !buscarInput) return;
    
    // Búsqueda de medicamentos
    buscarInput.addEventListener('input', () => {
        const query = buscarInput.value.toLowerCase().trim();
        const listDiv = document.getElementById('medList');
        
        if (query === '') {
            listDiv.innerHTML = '';
            return;
        }
        
        const results = Object.keys(medicationsDB).filter(key => 
            key.includes(query) || 
            medicationsDB[key].nombre.toLowerCase().includes(query) ||
            (medicationsDB[key].indicaciones && 
             medicationsDB[key].indicaciones.some(ind => ind.toLowerCase().includes(query)))
        );
        
        if (results.length === 0) {
            listDiv.innerHTML = '<p class="text-muted">No se encontraron medicamentos</p>';
            return;
        }
        
        let html = '<h4>Resultados:</h4>';
        results.forEach(key => {
            const med = medicationsDB[key];
            html += `
                <div class="medication-item" style="cursor: pointer;" onclick="selectMedication('${key}')">
                    <h4>${med.nombre}</h4>
                    <p class="text-small">${med.indicaciones ? med.indicaciones.join(', ') : ''}</p>
                </div>
            `;
        });
        
        listDiv.innerHTML = html;
    });
    
    // Cálculo al cambiar peso
    pesoInput.addEventListener('input', calculateSelectedMedication);
}

// Seleccionar medicamento para calcular dosis
function selectMedication(medKey) {
    window.selectedMedicationKey = medKey;
    const med = medicationsDB[medKey];
    
    document.getElementById('medBuscar').value = med.nombre;
    document.getElementById('medList').innerHTML = '';
    
    calculateSelectedMedication();
}

// Calcular dosis del medicamento seleccionado
function calculateSelectedMedication() {
    if (!window.selectedMedicationKey) return;
    
    const peso = parseFloat(document.getElementById('medPeso').value);
    if (!peso || peso <= 0) {
        document.getElementById('medResult').classList.remove('show');
        return;
    }
    
    const med = medicationsDB[window.selectedMedicationKey];
    const resultDiv = document.getElementById('medResult');
    
    let html = `<h3>💊 ${med.nombre}</h3><div class="dose-display">`;
    
    // Dosis de paro si existe
    if (med.dosis_paro) {
        html += `<p><strong>Dosis en paro:</strong> ${med.dosis_paro}</p>`;
    }
    
    // Dosis de anafilaxia
    if (med.dosis_anafilaxia) {
        const dosisCalc = (0.01 * peso).toFixed(2);
        html += `<p><strong>Dosis anafilaxia:</strong> ${dosisCalc} mg IM (${med.dosis_anafilaxia})</p>`;
    }
    
    // Dosis de infusión
    if (med.dosis_infusion) {
        html += `<p><strong>Infusión:</strong> ${med.dosis_infusion}</p>`;
    }
    
    // Preparación
    if (med.preparacion_infusion) {
        html += `<p><strong>Preparación:</strong> ${med.preparacion_infusion}</p>`;
    }
    
    // Indicaciones
    if (med.indicaciones) {
        html += `<p><strong>Indicaciones:</strong> ${med.indicaciones.join(', ')}</p>`;
    }
    
    // Presentaciones
    if (med.presentaciones) {
        html += `<p class="text-small text-muted"><strong>Presentaciones:</strong> ${med.presentaciones.join(', ')}</p>`;
    }
    
    // Disponibilidad
    html += `<p class="text-small"><strong>Disponibilidad Cuba:</strong> ${getDisponibilidadText(med.disponibilidad_cuba)}</p>`;
    
    html += `</div>`;
    
    resultDiv.innerHTML = html;
    resultDiv.classList.add('show');
}

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registrado'))
            .catch(err => console.log('Error Service Worker:', err));
    });
}

// Detector de conexión
function updateConnectionStatus() {
    const indicator = document.getElementById('offlineIndicator');
    if (!navigator.onLine) {
        indicator.classList.add('offline');
    } else {
        indicator.classList.remove('offline');
    }
}

window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);
