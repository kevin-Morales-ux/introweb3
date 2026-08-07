document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-moto');
    const cuerpoTabla = document.querySelector('#tabla-motos tbody');
    const btnGuardar = document.getElementById('btn-guardar');
    const inputBuscar = document.getElementById('input-buscar');
    const selectOrden = document.getElementById('select-orden');
    const btnDarkMode = document.getElementById('btn-dark-mode');
    const btnExportar = document.getElementById('btn-exportar');

    const inputIndex = document.getElementById('moto-index');
    const inputPlaca = document.getElementById('placa');
    const inputMarca = document.getElementById('marca');
    const inputCilindrada = document.getElementById('cilindrada');
    const inputPropietario = document.getElementById('propietario');
    const selectEstado = document.getElementById('estado');

    const statTotal = document.getElementById('stat-total');
    const statAvgCc = document.getElementById('stat-avg-cc');
    const statMantenimiento = document.getElementById('stat-mantenimiento');

    let motos = [];

    // CREAR EL BOTÓN DE BUSCAR AL LADO DEL INPUT Y LA VENTANA MODAL AUTOMÁTICAMENTE
    if (inputBuscar) {
        const parentDiv = inputBuscar.parentElement;
        parentDiv.style.display = 'flex';
        parentDiv.style.gap = '10px';
        parentDiv.style.alignItems = 'center';

        const btnBuscar = document.createElement('button');
        btnBuscar.id = 'btn-ejecutar-busqueda';
        btnBuscar.type = 'button';
        btnBuscar.className = 'btn-secondary';
        btnBuscar.textContent = '🔍 Buscar';
        parentDiv.insertBefore(btnBuscar, selectOrden);

        btnBuscar.addEventListener('click', () => {
            const texto = inputBuscar.value.trim().toUpperCase();
            if (!texto) {
                alert('Escribe una placa, marca o dueño para buscar.');
                return;
            }
            const encontrada = motos.find(m => m.placa.toUpperCase() === texto || m.marca.toUpperCase().includes(texto) || m.propietario.toUpperCase().includes(texto));
            if (encontrada) {
                mostrarModal(encontrada);
            } else {
                alert('No se encontró ninguna moto con ese criterio.');
            }
        });
    }

    // CREAR MODAL FLOTANTE
    let modal = document.getElementById('modal-moto-encontrada');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-moto-encontrada';
        modal.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999; justify-content:center; align-items:center;';
        modal.innerHTML = `
            <div style="background:white; padding:25px; border-radius:12px; width:320px; box-shadow:0 10px 25px rgba(0,0,0,0.3); text-align:center; font-family:sans-serif; color:#333;">
                <h3 style="margin-top:0; color:#2563eb;">¡Moto Encontrada!</h3>
                <div id="modal-contenido" style="margin:15px 0; font-size:15px; line-height:1.6; text-align:left;"></div>
                <button id="cerrar-modal" style="background:#ef4444; color:white; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:600;">Cerrar</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('cerrar-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }

    function mostrarModal(moto) {
        const contenido = document.getElementById('modal-contenido');
        contenido.innerHTML = `
            <strong>Placa:</strong> ${moto.placa}<br>
            <strong>Marca/Modelo:</strong> ${moto.marca}<br>
            <strong>Cilindrada:</strong> ${moto.cilindrada} cc<br>
            <strong>Propietario:</strong> ${moto.propietario}<br>
            <strong>Estado:</strong> ${moto.estado}
        `;
        modal.style.display = 'flex';
    }

    // GESTIÓN DEL FORMULARIO (CRUD)
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const index = inputIndex.value;
            const nuevaMoto = {
                placa: inputPlaca.value.trim().toUpperCase(),
                marca: inputMarca.value.trim(),
                cilindrada: Number(inputCilindrada.value),
                propietario: inputPropietario.value.trim(),
                estado: selectEstado.value
            };

            if (index === '') {
                motos.push(nuevaMoto);
            } else {
                motos[index] = nuevaMoto;
                inputIndex.value = '';
                btnGuardar.textContent = 'Registrar Motocicleta';
            }

            form.reset();
            actualizarInterfaz();
        });
    }

    // FILTRO EN TIEMPO REAL EN LA TABLA
    if (inputBuscar) {
        inputBuscar.addEventListener('input', () => {
            renderizarTabla(inputBuscar.value);
        });
    }

    // ORDENAMIENTO
    if (selectOrden) {
        selectOrden.addEventListener('change', () => {
            if (selectOrden.value === 'placa') {
                motos.sort((a, b) => a.placa.localeCompare(b.placa));
            } else if (selectOrden.value === 'cilindrada') {
                motos.sort((a, b) => b.cilindrada - a.cilindrada);
            }
            renderizarTabla(inputBuscar ? inputBuscar.value : '');
        });
    }

    // MODO OSCURO
    if (btnDarkMode) {
        btnDarkMode.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            // Estilos rápidos de modo oscuro si no están en tu CSS
            if (document.body.classList.contains('dark-mode')) {
                document.body.style.background = '#111827';
                document.body.style.color = '#f3f4f6';
                btnDarkMode.textContent = '☀️ Modo Claro';
            } else {
                document.body.style.background = '#f9fafb';
                document.body.style.color = '#111827';
                btnDarkMode.textContent = '🌙 Modo Oscuro';
            }
        });
    }

    // EXPORTAR CSV
    if (btnExportar) {
        btnExportar.addEventListener('click', () => {
            if (motos.length === 0) {
                alert('No hay datos para exportar.');
                return;
            }
            let csv = 'Placa,Marca/Modelo,Cilindrada,Propietario,Estado\n';
            motos.forEach(m => {
                csv += `${m.placa},"${m.marca}",${m.cilindrada},"${m.propietario}",${m.estado}\n`;
            });
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'motos_mantenimiento.csv';
            a.click();
        });
    }

    window.editarMoto = function(index) {
        const m = motos[index];
        inputIndex.value = index;
        inputPlaca.value = m.placa;
        inputMarca.value = m.marca;
        inputCilindrada.value = m.cilindrada;
        inputPropietario.value = m.propietario;
        selectEstado.value = m.estado;
        btnGuardar.textContent = 'Actualizar Motocicleta';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.eliminarMoto = function(index) {
        if (confirm('¿Estás seguro de eliminar este registro?')) {
            motos.splice(index, 1);
            actualizarInterfaz();
        }
    };

    function actualizarInterfaz() {
        renderizarTabla(inputBuscar ? inputBuscar.value : '');
        actualizarEstadisticas();
    }

    function renderizarTabla(filtro = '') {
        if (!cuerpoTabla) return;
        cuerpoTabla.innerHTML = '';

        const filtradas = motos.filter(m => 
            m.placa.toLowerCase().includes(filtro.toLowerCase()) ||
            m.marca.toLowerCase().includes(filtro.toLowerCase()) ||
            m.propietario.toLowerCase().includes(filtro.toLowerCase())
        );

        if (filtradas.length === 0) {
            cuerpoTabla.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:15px;">No se encontraron motocicletas.</td></tr>`;
            return;
        }

        filtradas.forEach((m) => {
            // Encontrar el índice real en el array principal
            const realIndex = motos.indexOf(m);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${m.placa}</strong></td>
                <td>${m.marca}</td>
                <td>${m.cilindrada} cc</td>
                <td>${m.propietario}</td>
                <td>${m.estado}</td>
                <td style="text-align:center;">
                    <button type="button" class="btn-secondary" onclick="editarMoto(${realIndex})">Editar</button>
                    <button type="button" class="btn-secondary" style="background:#ef4444; color:white; border:none;" onclick="eliminarMoto(${realIndex})">Eliminar</button>
                </td>
            `;
            cuerpoTabla.appendChild(tr);
        });
    }

    function actualizarEstadisticas() {
        if (statTotal) statTotal.textContent = motos.length;

        if (statAvgCc) {
            if (motos.length > 0) {
                const suma = motos.reduce((acc, m) => acc + m.cilindrada, 0);
                statAvgCc.textContent = Math.round(suma / motos.length) + ' cc';
            } else {
                statAvgCc.textContent = '0 cc';
            }
        }

        if (statMantenimiento) {
            const cantMantenimiento = motos.filter(m => m.estado === 'Mantenimiento').length;
            statMantenimiento.textContent = cantMantenimiento;
        }
    }
});