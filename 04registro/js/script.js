document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registroForm');
    const cuerpoTabla = document.getElementById('cuerpoTabla');
    const filaVacia = document.getElementById('filaVacia');
    const formTitle = document.getElementById('formTitle');
    const btnAccion = document.getElementById('btnAccion');
    const btnCancelar = document.getElementById('btnCancelar');
    const inputBuscar = document.getElementById('inputBuscar');

    const inputEditId = document.getElementById('editId');
    const inputNombres = document.getElementById('nombres');
    const inputApellidos = document.getElementById('apellidos');
    const inputCorreo = document.getElementById('correo');
    const inputEdad = document.getElementById('edad');

    const errorNombres = document.getElementById('errorNombres');
    const errorApellidos = document.getElementById('errorApellidos');
    const errorCorreo = document.getElementById('errorCorreo');
    const errorEdad = document.getElementById('errorEdad');

    let registros = [];
    let contadorId = 0;

    // Manejar Envío (Crear o Actualizar)
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        limpiarErrores();

        const nombres = inputNombres.value.trim();
        const apellidos = inputApellidos.value.trim();
        const correo = inputCorreo.value.trim();
        const edad = inputEdad.value.trim();
        const idEditando = inputEditId.value;

        let esValido = true;
        if (nombres === '') { mostrarError(inputNombres, errorNombres, 'Campo obligatorio.'); esValido = false; }
        if (apellidos === '') { mostrarError(inputApellidos, errorApellidos, 'Campo obligatorio.'); esValido = false; }
        if (correo === '') { mostrarError(inputCorreo, errorCorreo, 'Campo obligatorio.'); esValido = false; } 
        else if (!validarEmail(correo)) { mostrarError(inputCorreo, errorCorreo, 'Correo no válido.'); esValido = false; }
        if (edad === '') { mostrarError(inputEdad, errorEdad, 'Campo obligatorio.'); esValido = false; } 
        else if (isNaN(edad) || Number(edad) <= 0 || Number(edad) > 120) { mostrarError(inputEdad, errorEdad, 'Edad entre 1 y 120.'); esValido = false; }

        if (esValido) {
            if (idEditando === '') {
                agregarRegistro(nombres, apellidos, correo, edad);
                mostrarNotificacion('Registro agregado exitosamente', 'success');
            } else {
                guardarEdicion(idEditando, nombres, apellidos, correo, edad);
                mostrarNotificacion('Registro actualizado correctamente', 'success');
            }
            resetearFormulario();
        }
    });

    btnCancelar.addEventListener('click', resetearFormulario);

    // Búsqueda en tiempo real
    if (inputBuscar) {
        inputBuscar.addEventListener('input', () => {
            renderizarTabla(inputBuscar.value.trim());
        });
    }

    function agregarRegistro(nombres, apellidos, correo, edad) {
        contadorId++;
        registros.push({ id: contadorId, nombres, apellidos, correo, edad });
        renderizarTabla();
    }

    // FUNCIÓN DE EDITAR CON ANIMACIÓN Y AVISO VISUAL
    window.iniciarEdicion = function(id) {
        const reg = registros.find(r => r.id === Number(id));
        if (reg) {
            // Animación suave de confirmación antes de cargar los datos para editar
            if (confirm(`¿Desea editar los datos de ${reg.nombres} ${reg.apellidos}?`)) {
                formTitle.innerHTML = `<i class="fas fa-user-edit"></i> Editar Persona (ID: ${reg.id})`;
                btnAccion.innerHTML = `<i class="fas fa-save"></i> Actualizar`;
                btnCancelar.style.display = 'block';

                inputEditId.value = reg.id;
                inputNombres.value = reg.nombres;
                inputApellidos.value = reg.apellidos;
                inputCorreo.value = reg.correo;
                inputEdad.value = reg.edad;
                
                window.scrollTo({ top: 0, behavior: 'smooth' });
                mostrarNotificacion('Modo de edición activado', 'success');
            }
        }
    };

    function guardarEdicion(id, nombres, apellidos, correo, edad) {
        registros = registros.map(reg => {
            if (reg.id === Number(id)) {
                return { id: Number(id), nombres, apellidos, correo, edad };
            }
            return reg;
        });
        renderizarTabla();
    }

    // FUNCIÓN DE ELIMINAR CON ANIMACIÓN DE SALIDA
    window.eliminarRegistro = function(id) {
        const reg = registros.find(r => r.id === Number(id));
        if (!reg) return;

        // Cuadro de confirmación estilizado que pregunta si está seguro
        if (confirm(`¿Está totalmente seguro de eliminar el registro de ${reg.nombres} ${reg.apellidos}?`)) {
            const fila = document.getElementById(`fila-${id}`);
            
            if (fila) {
                // Aplicar una animación CSS de desvanecimiento antes de borrarlo de la memoria
                fila.style.transition = 'all 0.4s ease';
                fila.style.transform = 'translateX(50px)';
                fila.style.opacity = '0';
                
                setTimeout(() => {
                    registros = registros.filter(item => item.id !== Number(id));
                    renderizarTabla();
                    mostrarNotificacion('Registro eliminado correctamente', 'error');
                }, 400); // Espera a que termine la animación visual
            } else {
                registros = registros.filter(item => item.id !== Number(id));
                renderizarTabla();
                mostrarNotificacion('Registro eliminado correctamente', 'error');
            }
        }
    };

    function renderizarTabla(filtro = '') {
        cuerpoTabla.innerHTML = '';

        const registrosFiltrados = registros.filter(reg => 
            reg.nombres.toLowerCase().includes(filtro.toLowerCase()) ||
            reg.apellidos.toLowerCase().includes(filtro.toLowerCase()) ||
            reg.correo.toLowerCase().includes(filtro.toLowerCase())
        );

        if (registrosFiltrados.length === 0) {
            cuerpoTabla.innerHTML = `<tr id="filaVacia"><td colspan="6" class="text-center">No se encontraron registros.</td></tr>`;
            return;
        }

        registrosFiltrados.forEach((reg, index) => {
            const tr = document.createElement('tr');
            tr.id = `fila-${reg.id}`; // Asignamos un ID único a cada fila para las animaciones
            tr.innerHTML = `
                <td><strong>${index + 1}</strong></td>
                <td>${escaparHTML(reg.nombres)}</td>
                <td>${escaparHTML(reg.apellidos)}</td>
                <td>${escaparHTML(reg.correo)}</td>
                <td>${escaparHTML(reg.edad)}</td>
                <td class="text-center">
                    <button type="button" class="btn-accion btn-editar" onclick="iniciarEdicion(${reg.id})" title="Editar"><i class="fas fa-pen"></i></button>
                    <button type="button" class="btn-accion btn-eliminar" onclick="eliminarRegistro(${reg.id})" title="Eliminar"><i class="fas fa-trash"></i></button>
                </td>
            `;
            cuerpoTabla.appendChild(tr);
        });
    }

    function resetearFormulario() {
        form.reset();
        inputEditId.value = '';
        formTitle.innerHTML = `<i class="fas fa-user-plus"></i> Registrar Nueva Persona`;
        btnAccion.innerHTML = `<i class="fas fa-plus"></i> Agregar Registro`;
        btnCancelar.style.display = 'none';
        limpiarErrores();
    }

    function mostrarNotificacion(mensaje, tipo) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = document.getElementById('toastIcon');

        toastMessage.textContent = mensaje;
        if(tipo === 'success') {
            toast.style.borderLeftColor = 'var(--success-color)';
            toastIcon.className = 'fas fa-check-circle';
            toastIcon.style.color = 'var(--success-color)';
        } else {
            toast.style.borderLeftColor = 'var(--error-color)';
            toastIcon.className = 'fas fa-exclamation-circle';
            toastIcon.style.color = 'var(--error-color)';
        }

        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function mostrarError(input, span, msg) {
        input.classList.add('error');
        if (span) span.textContent = msg;
    }

    function limpiarErrores() {
        [inputNombres, inputApellidos, inputCorreo, inputEdad].forEach(i => i.classList.remove('error'));
        [errorNombres, errorApellidos, errorCorreo, errorEdad].forEach(s => { if(s) s.textContent = ''; });
    }

    function validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function escaparHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});