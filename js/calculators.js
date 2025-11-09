// Calculadora de líquidos IV
function renderFluidCalculator() {
    return `
        <div class="card">
            <h2>💧 Calculadora de Líquidos IV</h2>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="fluidPeso">Peso (kg) *</label>
                    <input type="number" id="fluidPeso" placeholder="Ej: 70" step="0.1" min="1">
                </div>
                <div class="input-group">
                    <label for="fluidVelocidad">Velocidad (ml/kg/h) *</label>
                    <input type="number" id="fluidVelocidad" placeholder="Ej: 10" step="0.1" min="0.1" max="19.9">
                </div>
            </div>

            <div class="input-row">
                <div class="input-group">
                    <label for="fluidDuracion">Duración (horas) *</label>
                    <input type="number" id="fluidDuracion" placeholder="Ej: 4" step="0.5" min="0.5">
                </div>
                <div class="input-group">
                    <label for="fluidGoteo">Tipo de goteo</label>
                    <select id="fluidGoteo">
                        <option value="20">Normogotero (20 gotas/ml)</option>
                        <option value="10">Macrogotero (10 gotas/ml)</option>
                        <option value="60">Microgotero (60 gotas/ml)</option>
                    </select>
                </div>
            </div>

            <div class="result-box" id="fluidResult"></div>

            <!-- Calculadora de bolo -->
            <div class="collapsible">
                <div class="collapsible-header" onclick="toggleCollapsible(this)">
                    <h4>💉 Calculadora de Bolo de Rescate</h4>
                    <span class="collapsible-arrow">▶</span>
                </div>
                <div class="collapsible-content">
                    <div class="input-row">
                        <div class="input-group">
                            <label for="boloVolumen">Volumen (ml/kg)</label>
                            <input type="number" id="boloVolumen" placeholder="Típico: 10-20" value="10" step="1" min="5" max="20">
                        </div>
                        <div class="input-group">
                            <label for="boloTiempo">Tiempo (minutos)</label>
                            <input type="number" id="boloTiempo" placeholder="Típico: 15-30" value="15" step="5" min="5" max="60">
                        </div>
                    </div>
                    <div class="result-box" id="boloResult"></div>
                </div>
            </div>
        </div>
    `;
}

function activateFluidCalculator() {
    const pesoInput = document.getElementById('fluidPeso');
    const velocidadInput = document.getElementById('fluidVelocidad');
    const duracionInput = document.getElementById('fluidDuracion');
    const goteoSelect = document.getElementById('fluidGoteo');
    const boloVolInput = document.getElementById('boloVolumen');
    const boloTiempoInput = document.getElementById('boloTiempo');

    // Calculadora principal
    [pesoInput, velocidadInput, duracionInput, goteoSelect].forEach(el => {
        if (el) el.addEventListener('input', calculateFluids);
    });

    // Calculadora de bolo
    [pesoInput, boloVolInput, boloTiempoInput].forEach(el => {
        if (el) el.addEventListener('input', calculateBolus);
    });
}

function calculateFluids() {
    const peso = parseFloat(document.getElementById('fluidPeso').value);
    const velocidad = parseFloat(document.getElementById('fluidVelocidad').value);
    const duracion = parseFloat(document.getElementById('fluidDuracion').value);
    const gotasPorMl = parseInt(document.getElementById('fluidGoteo').value);

    const resultDiv = document.getElementById('fluidResult');

    if (!peso || !velocidad || !duracion) {
        resultDiv.classList.remove('show');
        return;
    }

    if (velocidad >= 20) {
        resultDiv.innerHTML = `
            <div class="error-box">
                <h4>⚠️ Velocidad excesiva</h4>
                <p>Velocidad ≥20 ml/kg/h sugiere bolo rápido. Usar calculadora de bolos.</p>
            </div>
        `;
        resultDiv.classList.add('show');
        return;
    }

    const volumenTotal = peso * velocidad * duracion;
    const gotasPorMinuto = (volumenTotal * gotasPorMl) / (duracion * 60);
    const mlPorHora = volumenTotal / duracion;
    const frascos = Math.ceil(volumenTotal / 500);

    const tipoGoteo = gotasPorMl === 20 ? 'normogotero' : 
                      gotasPorMl === 10 ? 'macrogotero' : 'microgotero';

    resultDiv.innerHTML = `
        <h3>📋 Indicación calculada</h3>
        <div class="dose-display">
            <strong>SSN 0.9%</strong> (o solución indicada)<br>
            Administrar <strong>${volumenTotal.toFixed(1)} ml</strong> a durar <strong>${duracion} horas</strong><br>
            a razón de <strong>${gotasPorMinuto.toFixed(1)} gotas/min</strong> (${tipoGoteo})<br>
            o <strong>${mlPorHora.toFixed(1)} ml/h</strong> en bomba de infusión<br>
            <br>
            <span class="text-muted">Frascos necesarios: ${frascos} × 500ml</span><br>
            <span class="text-muted">Cálculo: ${velocidad} ml/kg/h × ${peso} kg × ${duracion} h = ${volumenTotal.toFixed(1)} ml</span>
        </div>
    `;
    resultDiv.classList.add('show');
}

function calculateBolus() {
    const peso = parseFloat(document.getElementById('fluidPeso').value);
    const volumen = parseFloat(document.getElementById('boloVolumen').value);
    const tiempo = parseFloat(document.getElementById('boloTiempo').value);
    const gotasPorMl = parseInt(document.getElementById('fluidGoteo').value);

    const resultDiv = document.getElementById('boloResult');

    if (!peso || !volumen || !tiempo) {
        resultDiv.classList.remove('show');
        return;
    }

    const volumenTotal = peso * volumen;
    const gotasPorMinuto = (volumenTotal * gotasPorMl) / tiempo;
    const mlPorHora = (volumenTotal * 60) / tiempo;
    const frascos = Math.ceil(volumenTotal / 500);

    const tipoGoteo = gotasPorMl === 20 ? 'normogotero' : 
                      gotasPorMl === 10 ? 'macrogotero' : 'microgotero';

    resultDiv.innerHTML = `
        <h3>💉 Bolo de rescate</h3>
        <div class="dose-display">
            <strong>SSN 0.9%</strong> (o solución indicada)<br>
            Administrar <strong>${volumenTotal.toFixed(1)} ml</strong> en <strong>${tiempo} minutos</strong><br>
            a razón de <strong>${gotasPorMinuto.toFixed(1)} gotas/min</strong> (${tipoGoteo})<br>
            o <strong>${mlPorHora.toFixed(1)} ml/h</strong> en bomba de infusión<br>
            <br>
            <span class="text-muted">Frascos necesarios: ${frascos} × 500ml</span>
        </div>
    `;
    resultDiv.classList.add('show');
}

// Calculadora de medicamentos
function renderMedicationCalculator() {
    return `
        <div class="card">
            <h2>💊 Calculadora de Dosis</h2>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="medPeso">Peso del paciente (kg)</label>
                    <input type="number" id="medPeso" placeholder="Ej: 70" step="0.1" min="1">
                </div>
                <div class="input-group">
                    <label for="medBuscar">Buscar medicamento</label>
                    <input type="text" id="medBuscar" placeholder="Escriba el nombre" autocomplete="off">
                </div>
            </div>

            <div id="medList" class="medication-list"></div>
            <div class="result-box" id="medResult"></div>
        </div>
    `;
}

// Calculadora de gasometría
function renderGasometryCalculator() {
    return `
        <div class="card">
            <h2>🔬 Interpretación de Gasometría</h2>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="gasPH">pH</label>
                    <input type="number" id="gasPH" placeholder="7.35-7.45" step="0.01" min="6.8" max="7.8">
                </div>
                <div class="input-group">
                    <label for="gasPCO2">PCO2 (mmHg)</label>
                    <input type="number" id="gasPCO2" placeholder="35-45" step="1" min="10" max="100">
                </div>
            </div>

            <div class="input-row">
                <div class="input-group">
                    <label for="gasHCO3">HCO3 (mEq/L)</label>
                    <input type="number" id="gasHCO3" placeholder="22-26" step="1" min="5" max="50">
                </div>
                <div class="input-group">
                    <label for="gasPO2">PO2 (mmHg)</label>
                    <input type="number" id="gasPO2" placeholder=">80" step="1" min="20" max="600">
                </div>
            </div>

            <button class="btn btn-primary" onclick="interpretGasometry()">Interpretar</button>

            <div class="result-box" id="gasResult"></div>
        </div>
    `;
}

function interpretGasometry() {
    const ph = parseFloat(document.getElementById('gasPH').value);
    const pco2 = parseFloat(document.getElementById('gasPCO2').value);
    const hco3 = parseFloat(document.getElementById('gasHCO3').value);
    const po2 = parseFloat(document.getElementById('gasPO2').value);

    const resultDiv = document.getElementById('gasResult');

    if (!ph || !pco2 || !hco3) {
        alert('Ingrese al menos pH, PCO2 y HCO3');
        return;
    }

    let interpretation = '';
    let primaryDisorder = '';
    let compensation = '';

    // Determinar trastorno primario
    if (ph < 7.35) {
        // Acidemia
        if (pco2 > 45) {
            primaryDisorder = 'Acidosis respiratoria';
            // Compensación esperada: HCO3 aumenta
            const expectedHCO3_acute = 24 + ((pco2 - 40) * 0.1);
            const expectedHCO3_chronic = 24 + ((pco2 - 40) * 0.35);
            
            if (hco3 < expectedHCO3_acute - 2) {
                compensation = 'Acidosis metabólica asociada';
            } else if (hco3 > expectedHCO3_chronic + 2) {
                compensation = 'Alcalosis metabólica asociada';
            } else {
                compensation = hco3 < 26 ? 'Compensación aguda apropiada' : 'Compensación crónica apropiada';
            }
        } else if (hco3 < 22) {
            primaryDisorder = 'Acidosis metabólica';
            // Compensación esperada: PCO2 disminuye
            const expectedPCO2 = 40 - (1.2 * (24 - hco3));
            
            if (Math.abs(pco2 - expectedPCO2) <= 5) {
                compensation = 'Compensación respiratoria apropiada';
            } else if (pco2 > expectedPCO2 + 5) {
                compensation = 'Acidosis respiratoria asociada';
            } else {
                compensation = 'Alcalosis respiratoria asociada';
            }

            // Calcular anion gap
            // Necesitaríamos Na+ y Cl- para esto
            interpretation += '<p><strong>💡 Tip:</strong> Calcular anion gap para clasificar</p>';
        }
    } else if (ph > 7.45) {
        // Alcalemia
        if (pco2 < 35) {
            primaryDisorder = 'Alcalosis respiratoria';
            const expectedHCO3_acute = 24 - ((40 - pco2) * 0.2);
            const expectedHCO3_chronic = 24 - ((40 - pco2) * 0.4);
            
            if (hco3 > expectedHCO3_chronic + 2) {
                compensation = 'Alcalosis metabólica asociada';
            } else if (hco3 < expectedHCO3_acute - 2) {
                compensation = 'Acidosis metabólica asociada';
            } else {
                compensation = 'Compensación apropiada';
            }
        } else if (hco3 > 26) {
            primaryDisorder = 'Alcalosis metabólica';
            const expectedPCO2 = 40 + (0.7 * (hco3 - 24));
            
            if (Math.abs(pco2 - expectedPCO2) <= 5) {
                compensation = 'Compensación respiratoria apropiada';
            } else if (pco2 < expectedPCO2 - 5) {
                compensation = 'Alcalosis respiratoria asociada';
            } else {
                compensation = 'Acidosis respiratoria asociada';
            }
        }
    } else {
        primaryDisorder = 'pH normal';
        if (pco2 > 45 && hco3 > 26) {
            compensation = 'Acidosis respiratoria crónica compensada';
        } else if (pco2 < 35 && hco3 < 22) {
            compensation = 'Alcalosis respiratoria crónica compensada';
        } else {
            compensation = 'Sin trastorno ácido-base';
        }
    }

    // Evaluar oxigenación
    let oxygenStatus = '';
    if (po2 < 60) {
        oxygenStatus = '<div class="error-box">⚠️ Hipoxemia severa (PO2 <60 mmHg)</div>';
    } else if (po2 < 80) {
        oxygenStatus = '<div class="warning-box">⚠️ Hipoxemia leve-moderada</div>';
    } else {
        oxygenStatus = '<div class="success-box">✅ Oxigenación adecuada</div>';
    }

    interpretation = `
        <h3>📊 Interpretación</h3>
        <div class="dose-display">
            <p><strong>pH:</strong> ${ph} ${ph < 7.35 ? '(Acidemia)' : ph > 7.45 ? '(Alcalemia)' : '(Normal)'}</p>
            <p><strong>PCO2:</strong> ${pco2} mmHg ${pco2 > 45 ? '(Elevado)' : pco2 < 35 ? '(Bajo)' : '(Normal)'}</p>
            <p><strong>HCO3:</strong> ${hco3} mEq/L ${hco3 > 26 ? '(Elevado)' : hco3 < 22 ? '(Bajo)' : '(Normal)'}</p>
            ${po2 ? `<p><strong>PO2:</strong> ${po2} mmHg</p>` : ''}
        </div>
        
        <div class="info-box">
            <h4>🔍 Diagnóstico</h4>
            <p><strong>Trastorno primario:</strong> ${primaryDisorder}</p>
            <p><strong>Compensación:</strong> ${compensation}</p>
        </div>

        ${oxygenStatus}
    `;

    resultDiv.innerHTML = interpretation;
    resultDiv.classList.add('show');
}

// Calculadora de déficit de bicarbonato
function calculateBicarbDeficit(peso, hco3Actual, hco3Deseado = 15) {
    // Fórmula: mEq HCO3 = 0.3 × peso × (HCO3 deseado - HCO3 actual)
    const deficit = 0.3 * peso * (hco3Deseado - hco3Actual);
    return Math.round(deficit);
}

// Calculadora de corrección de sodio
function calculateSodiumCorrection(naActual, naDeseado, peso, agua_corporal = 0.6) {
    // Déficit de Na = (Na deseado - Na actual) × peso × agua corporal
    const deficit = (naDeseado - naActual) * peso * agua_corporal;
    return Math.round(deficit);
}

// Calculadora de corrección de potasio
function calculatePotassiumCorrection(kActual, kDeseado) {
    // Cada 10 mEq KCl eleva K sérico ~0.1 mEq/L
    const deficit = (kDeseado - kActual) / 0.1 * 10;
    return Math.round(deficit);
}

// Calculadora de infusión continua (para vasopresores, inotrópicos)
function calculateInfusionRate(dosis_mcg_kg_min, peso_kg, concentracion_mg_ml) {
    // ml/h = (dosis mcg/kg/min × peso kg × 60) / (concentracion mg/ml × 1000)
    const ml_hora = (dosis_mcg_kg_min * peso_kg * 60) / (concentracion_mg_ml * 1000);
    return ml_hora.toFixed(1);
}

// Calculadora de superficie corporal (Mosteller)
function calculateBSA(peso_kg, talla_cm) {
    return Math.sqrt((peso_kg * talla_cm) / 3600);
}

// Calculadora de clearance de creatinina (Cockcroft-Gault)
function calculateCreatinineClearance(edad, peso_kg, creatinina_mg_dl, sexo_masculino = true) {
    let clcr = ((140 - edad) * peso_kg) / (72 * creatinina_mg_dl);
    if (!sexo_masculino) {
        clcr *= 0.85;
    }
    return Math.round(clcr);
}
