// Algoritmos de decisión interactivos

function initializeAlgorithm(pathology) {
    // Inicializar algoritmo de decisión para patología específica
    console.log('Inicializando algoritmo para:', pathology);
}

function handleDecisionPoint(step, choice) {
    // Manejar punto de decisión en algoritmo
    console.log('Decisión en paso:', step, 'Opción:', choice);
}

// Algoritmo para estratificación de EPA
function stratifyEPA(pas) {
    if (pas >= 140) {
        return {
            grupo: 'hipertensivo',
            prioridad: 'Reducción agresiva PA + precarga',
            tratamiento: ['NTG IV titulada', 'Furosemida IV', 'Antihipertensivos']
        };
    } else if (pas >= 100) {
        return {
            grupo: 'normotensivo',
            prioridad: 'Balance precarga',
            tratamiento: ['Furosemida estándar', 'NTG baja dosis', 'Monitoreo PA']
        };
    } else {
        return {
            grupo: 'shock',
            prioridad: 'Soporte inotrópico',
            tratamiento: ['Dobutamina', 'Precaución con diuréticos', 'Buscar causa']
        };
    }
}

// Algoritmo para decisión de reperfusión en IMA
function determineReperfusionStrategy(tiempoEvolucion, icpDisponible, contraindicacionesFibrinolisis) {
    if (tiempoEvolucion > 12) {
        return {
            estrategia: 'Manejo conservador',
            razon: 'Ventana terapéutica cerrada',
            tratamiento: 'Antiagregación + anticoagulación + manejo médico'
        };
    }

    if (icpDisponible && tiempoEvolucion <= 12) {
        return {
            estrategia: 'ICP primaria',
            razon: 'Gold standard disponible',
            meta: 'Puerta-balón <90min'
        };
    }

    if (!contraindicacionesFibrinolisis) {
        return {
            estrategia: 'Fibrinólisis',
            razon: 'ICP no disponible, sin contraindicaciones',
            agente: 'Estreptoquinasa (más disponible Cuba)'
        };
    }

    return {
        estrategia: 'Traslado urgente + manejo médico',
        razon: 'Contraindicaciones para fibrinólisis',
        accion: 'Coordinar traslado a centro con ICP'
    };
}

// Algoritmo para clasificación de shock
function classifyShock(signos) {
    // signos: {hipotension, taquicardia, oliguria, piel_fria, confusion, lactato_elevado}
    
    if (signos.hipotension && signos.taquicardia && signos.piel_fria) {
        if (signos.ingurgitacion_yugular) {
            return {
                tipo: 'Shock cardiogénico',
                fisiopatologia: 'Fallo de bomba',
                tratamiento: 'Inotrópicos + optimizar precarga'
            };
        }
        
        if (signos.hemorragia || signos.deshidratacion) {
            return {
                tipo: 'Shock hipovolémico',
                fisiopatologia: 'Pérdida de volumen',
                tratamiento: 'Reposición volumen agresiva'
            };
        }
        
        if (signos.fiebre || signos.infeccion) {
            return {
                tipo: 'Shock séptico',
                fisiopatologia: 'Vasodilatación + disfunción miocárdica',
                tratamiento: 'Antibióticos + volumen + vasopresores'
            };
        }
    }
    
    if (signos.urticaria || signos.broncoespasmo || signos.edema_glotis) {
        return {
            tipo: 'Shock anafiláctico',
            fisiopatologia: 'Reacción alérgica',
            tratamiento: 'Epinefrina IM + volumen'
        };
    }
    
    return {
        tipo: 'Indeterminado',
        accion: 'Reevaluar signos y buscar causa'
    };
}

// Algoritmo para RCP según ritmo
function selectCPRAlgorithm(ritmo) {
    const desfibrilables = ['FV', 'TV_sin_pulso'];
    const no_desfibrilables = ['Asistolia', 'AESP'];
    
    if (desfibrilables.includes(ritmo)) {
        return {
            algoritmo: 'desfibrilable',
            pasos: [
                'RCP inmediata',
                'Desfibrilar (120-200J bifásico)',
                'RCP 2 min',
                'Verificar ritmo',
                'Epinefrina cada 3-5 min',
                'Amiodarona después 3er shock'
            ]
        };
    }
    
    if (no_desfibrilables.includes(ritmo)) {
        return {
            algoritmo: 'no_desfibrilable',
            pasos: [
                'RCP inmediata (NO desfibrilar)',
                'Vía IV/IO + Epinefrina',
                'RCP 2 min continuos',
                'Buscar causas reversibles (5H + 5T)',
                'Verificar ritmo cada 2 min'
            ]
        };
    }
    
    return {
        algoritmo: 'verificar',
        accion: 'Confirmar ritmo en monitor'
    };
}

// Algoritmo para manejo de crisis hipertensiva
function manageCrisisHTA(pas, danoOrgano) {
    if (danoOrgano) {
        return {
            tipo: 'Emergencia hipertensiva',
            objetivo: 'Reducir PA 10-20% primera hora',
            via: 'IV',
            opciones: [
                'Labetalol 20mg IV inicial',
                'Nitroprusiato 0.25-10 mcg/kg/min',
                'Nitroglicerina 5-100 mcg/min (si SCA/EPA)',
                'Hidralazina 10-20mg IV',
                'Enalaprilato 1.25-5mg IV'
            ]
        };
    } else {
        return {
            tipo: 'Urgencia hipertensiva',
            objetivo: 'Reducir PA gradualmente 24-48h',
            via: 'VO',
            opciones: [
                'Captopril 12.5-25mg SL/VO',
                'Nifedipino 10mg VO',
                'Clonidina 0.1-0.2mg VO'
            ]
        };
    }
}

// Calcular tiempo de RCP
let rcpStartTime = null;
let rcpInterval = null;

function startRCPTimer() {
    rcpStartTime = Date.now();
    updateRCPTimer();
    rcpInterval = setInterval(updateRCPTimer, 1000);
}

function updateRCPTimer() {
    if (!rcpStartTime) return;
    
    const elapsed = Math.floor((Date.now() - rcpStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    const timerDisplay = document.getElementById('rcpTimer');
    if (timerDisplay) {
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Alertas cada 2 minutos
        if (elapsed % 120 === 0 && elapsed > 0) {
            alert('⏰ 2 minutos - Verificar ritmo y cambiar compresor');
        }
    }
}

function stopRCPTimer() {
    if (rcpInterval) {
        clearInterval(rcpInterval);
        rcpInterval = null;
    }
    rcpStartTime = null;
}

function resetRCPTimer() {
    stopRCPTimer();
    const timerDisplay = document.getElementById('rcpTimer');
    if (timerDisplay) {
        timerDisplay.textContent = '0:00';
    }
}

// Checklist de RCP
function createRCPChecklist() {
    return `
        <div class="card">
            <h3>✅ Checklist de RCP</h3>
            <div class="decision-step">
                <input type="checkbox" id="check_pulso"> <label for="check_pulso">Verificar ausencia de pulso (<10seg)</label><br>
                <input type="checkbox" id="check_codigo"> <label for="check_codigo">Activar código azul</label><br>
                <input type="checkbox" id="check_cpr"> <label for="check_cpr">Iniciar RCP (C-A-B)</label><br>
                <input type="checkbox" id="check_defib"> <label for="check_defib">Traer desfibrilador</label><br>
                <input type="checkbox" id="check_via"> <label for="check_via">Acceso vascular (IV/IO)</label><br>
                <input type="checkbox" id="check_epinefrina"> <label for="check_epinefrina">Epinefrina 1mg IV</label><br>
                <input type="checkbox" id="check_via_aerea"> <label for="check_via_aerea">Vía aérea avanzada</label><br>
                <input type="checkbox" id="check_causas"> <label for="check_causas">Buscar causas reversibles</label><br>
            </div>
            <div id="rcpTimerDisplay" class="info-box" style="text-align: center;">
                <h4>Tiempo de RCP: <span id="rcpTimer">0:00</span></h4>
                <button class="btn btn-primary" onclick="startRCPTimer()">Iniciar</button>
                <button class="btn btn-secondary" onclick="stopRCPTimer()">Pausar</button>
                <button class="btn btn-secondary" onclick="resetRCPTimer()">Reiniciar</button>
            </div>
        </div>
    `;
}

// Timeline de eventos en emergencia
class EmergencyTimeline {
    constructor() {
        this.events = [];
    }
    
    addEvent(description, time = new Date()) {
        this.events.push({
            time: time,
            description: description
        });
    }
    
    render() {
        let html = '<div class="info-box"><h4>📋 Timeline de eventos</h4><ul>';
        this.events.forEach(event => {
            const timeStr = event.time.toLocaleTimeString('es-ES');
            html += `<li><strong>${timeStr}:</strong> ${event.description}</li>`;
        });
        html += '</ul></div>';
        return html;
    }
    
    export() {
        return this.events.map(e => 
            `${e.time.toLocaleTimeString('es-ES')} - ${e.description}`
        ).join('\n');
    }
}

// Instancia global de timeline
const emergencyTimeline = new EmergencyTimeline();

// Añadir evento a timeline
function addTimelineEvent(description) {
    emergencyTimeline.addEvent(description);
    const timelineDiv = document.getElementById('emergencyTimeline');
    if (timelineDiv) {
        timelineDiv.innerHTML = emergencyTimeline.render();
    }
}
