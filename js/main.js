// --- SISTEMA DE NOTIFICACIONES ---

// Inyectar el contenedor de toasts y modal de confirmación en el DOM
function inyectarUI() {
    if (document.getElementById('vc-toast-container')) return;

    // Contenedor de toasts (esquina superior derecha)
    const toastContainer = document.createElement('div');
    toastContainer.id = 'vc-toast-container';
    toastContainer.style.cssText = 'position:fixed;top:80px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:10px;';
    document.body.appendChild(toastContainer);

    // Modal de confirmación reutilizable
    const modalHTML = `
    <div class="modal fade" id="vcModalConfirm" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content" style="border-radius:24px;border:none;box-shadow:0 16px 48px rgba(74,155,127,0.2);">
                <div class="modal-body text-center p-4">
                    <div style="width:52px;height:52px;border-radius:50%;background:#fef7dd;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#c8960c" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                        </svg>
                    </div>
                    <p id="vcModalConfirmMsg" style="font-size:.95rem;font-weight:500;color:#1e2d27;margin-bottom:1.5rem;"></p>
                    <div class="d-flex gap-2 justify-content-center">
                        <button id="vcModalConfirmNo" class="btn btn-outline-secondary btn-sm px-4" data-bs-dismiss="modal">Cancelar</button>
                        <button id="vcModalConfirmSi" class="btn btn-sm px-4" style="background:#e05252;color:white;border:none;border-radius:999px;">Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Mostrar un toast
// tipo: 'success' | 'error' | 'warning' | 'info'
function mostrarToast(mensaje, tipo = 'success') {
    inyectarUI();

    const colores = {
        success: { bg: '#d8f5e9', borde: '#4a9b7f', icono: '#4a9b7f', svg: '<path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>' },
        error:   { bg: '#fde8e8', borde: '#e05252', icono: '#e05252', svg: '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>' },
        warning: { bg: '#fef7dd', borde: '#c8960c', icono: '#c8960c', svg: '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>' },
        info:    { bg: '#dff0f7', borde: '#1a6a8a', icono: '#1a6a8a', svg: '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>' },
    };

    const c = colores[tipo] || colores.success;
    const id = 'toast-' + Date.now();

    const toast = document.createElement('div');
    toast.id = id;
    toast.style.cssText = `
        background:${c.bg};
        border-left:4px solid ${c.borde};
        border-radius:16px;
        padding:14px 18px;
        display:flex;
        align-items:center;
        gap:12px;
        box-shadow:0 4px 20px rgba(0,0,0,0.1);
        font-family:'Segoe UI',Arial,sans-serif;
        font-size:.9rem;
        font-weight:500;
        color:#1e2d27;
        min-width:260px;
        max-width:340px;
        opacity:0;
        transform:translateX(30px);
        transition:all .3s ease;
    `;
    toast.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="${c.icono}" viewBox="0 0 16 16" style="flex-shrink:0;">${c.svg}</svg>
        <span style="flex:1;">${mensaje}</span>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;padding:0;color:#6b7f76;font-size:1rem;line-height:1;">&times;</button>
    `;

    document.getElementById('vc-toast-container').appendChild(toast);

    // Animar entrada
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    });

    // Auto-cerrar en 4 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(30px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Mostrar modal de confirmación
// Retorna una Promise que resuelve true (confirmar) o false (cancelar)
function mostrarConfirm(mensaje) {
    inyectarUI();
    return new Promise((resolve) => {
        document.getElementById('vcModalConfirmMsg').textContent = mensaje;
        const modal = new bootstrap.Modal(document.getElementById('vcModalConfirm'));
        modal.show();

        const btnSi = document.getElementById('vcModalConfirmSi');
        const btnNo = document.getElementById('vcModalConfirmNo');

        // Clonar para eliminar listeners previos
        const nuevoSi = btnSi.cloneNode(true);
        const nuevoNo = btnNo.cloneNode(true);
        btnSi.replaceWith(nuevoSi);
        btnNo.replaceWith(nuevoNo);

        document.getElementById('vcModalConfirmSi').addEventListener('click', () => {
            modal.hide();
            resolve(true);
        });
        document.getElementById('vcModalConfirmNo').addEventListener('click', () => {
            resolve(false);
        });
    });
}

// --- FUNCIONES DE BASE DE DATOS LOCAL ---
const obtenerLista = (llave) => JSON.parse(localStorage.getItem(llave)) || [];
const guardarLista = (llave, lista) => localStorage.setItem(llave, JSON.stringify(lista));

// Función de validación
function validarCampos(campos) {
    let valido = true;
    for (const campo of campos) {
        const elemento = document.getElementById(campo.id);
        if (!elemento) continue;

        let valor = elemento.value.trim();

        if (!valor) {
            mostrarToast(campo.mensaje || `El campo es obligatorio.`, 'error');
            elemento.focus();
            valido = false;
            break;
        }

        if (campo.tipo === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(valor)) {
                mostrarToast('Por favor ingrese un correo electrónico válido.', 'error');
                elemento.focus();
                valido = false;
                break;
            }
        }

        if (campo.tipo === 'telefono') {
            const telRegex = /^[\+]?[\d\s\-\(\)]{8,15}$/;
            if (!telRegex.test(valor.replace(/\s/g, ''))) {
                mostrarToast('Por favor ingrese un número de teléfono válido.', 'error');
                elemento.focus();
                valido = false;
                break;
            }
        }

        if (campo.tipo === 'numero') {
            if (isNaN(valor) || parseFloat(valor) <= 0) {
                mostrarToast(campo.mensaje || 'Por favor ingrese un número válido mayor a 0.', 'error');
                elemento.focus();
                valido = false;
                break;
            }
        }

        if (campo.tipo === 'fecha') {
            const fecha = new Date(valor);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            if (fecha < hoy) {
                mostrarToast('La fecha no puede ser anterior a hoy.', 'warning');
                elemento.focus();
                valido = false;
                break;
            }
        }
    }
    return valido;
}

document.addEventListener('DOMContentLoaded', () => {

    // ── Formulario de dueños ──
    const fDuenos = document.getElementById('formDuenos');
    fDuenos?.addEventListener('submit', (e) => {
        e.preventDefault();
        const campos = [
            { id: 'id_dueno',       mensaje: 'El ID del dueño es obligatorio.' },
            { id: 'nombre_dueno',   mensaje: 'El nombre del dueño es obligatorio.' },
            { id: 'tel_dueno',      mensaje: 'El teléfono del dueño es obligatorio.', tipo: 'telefono' },
            { id: 'correo_dueno',   mensaje: 'El correo del dueño es obligatorio.', tipo: 'email' },
            { id: 'direccion_dueno',mensaje: 'La dirección del dueño es obligatoria.' }
        ];
        if (!validarCampos(campos)) return;

        const lista = obtenerLista('vc_duenos');
        lista.push({
            id:        document.getElementById('id_dueno').value,
            nombre:    document.getElementById('nombre_dueno').value,
            tel:       document.getElementById('tel_dueno').value,
            correo:    document.getElementById('correo_dueno').value,
            direccion: document.getElementById('direccion_dueno').value
        });
        guardarLista('vc_duenos', lista);
        mostrarToast('Dueño guardado correctamente.', 'success');
        fDuenos.reset();

        // Recargar tabla si existe
        if (typeof cargarTablaDuenos === 'function') cargarTablaDuenos();
    });

    // ── Formulario de mascotas ──
    const fMascotas = document.getElementById('formMascotas');
    const selDuenos = document.getElementById('select_dueno');

    if (selDuenos && !document.getElementById('select_dueno_exp')) {
        obtenerLista('vc_duenos').forEach(d => {
            selDuenos.innerHTML += `<option value="${d.id}">${d.nombre}</option>`;
        });
    }

    fMascotas?.addEventListener('submit', (e) => {
        e.preventDefault();
        const campos = [
            { id: 'select_dueno',      mensaje: 'Debe seleccionar un dueño.' },
            { id: 'nombre_mascota',    mensaje: 'El nombre de la mascota es obligatorio.' },
            { id: 'raza_mascota',      mensaje: 'La raza de la mascota es obligatoria.' },
            { id: 'color_mascota',     mensaje: 'El color de la mascota es obligatorio.' },
            { id: 'categoria_mascota', mensaje: 'La categoría de la mascota es obligatoria.' },
            { id: 'edad_mascota',      mensaje: 'La edad de la mascota es obligatoria.', tipo: 'numero' },
            { id: 'peso_mascota',      mensaje: 'El peso de la mascota es obligatorio.', tipo: 'numero' }
        ];
        if (!validarCampos(campos)) return;

        const lista = obtenerLista('vc_mascotas');
        lista.push({
            id_dueno:  selDuenos.value,
            nombre:    document.getElementById('nombre_mascota').value,
            raza:      document.getElementById('raza_mascota').value,
            color:     document.getElementById('color_mascota').value,
            categoria: document.getElementById('categoria_mascota').value,
            edad:      document.getElementById('edad_mascota').value,
            peso:      document.getElementById('peso_mascota').value
        });
        guardarLista('vc_mascotas', lista);
        mostrarToast('Mascota registrada correctamente.', 'success');
        fMascotas.reset();
    });

    // ── Formulario de citas ──
    const fCitas = document.getElementById('formCitas');
    const selMascotas = document.getElementById('select_mascota');

    fCitas?.addEventListener('submit', (e) => {
        e.preventDefault();
        const campos = [
            { id: 'select_dueno',   mensaje: 'Debe seleccionar un dueño.' },
            { id: 'select_mascota', mensaje: 'Debe seleccionar una mascota.' },
            { id: 'fecha_cita',     mensaje: 'La fecha de la cita es obligatoria.', tipo: 'fecha' },
            { id: 'hora_cita',      mensaje: 'La hora de la cita es obligatoria.' }
        ];
        if (!validarCampos(campos)) return;

        const lista = obtenerLista('vc_citas');
        lista.push({
            index_mascota: selMascotas.value,
            fecha:  document.getElementById('fecha_cita').value,
            hora:   document.getElementById('hora_cita').value,
            motivo: document.getElementById('motivo_cita')?.value || ''
        });
        guardarLista('vc_citas', lista);
        mostrarToast('Cita agendada con éxito.', 'success');
        fCitas.reset();
        document.getElementById('select_dueno').value = '';
        document.getElementById('select_mascota').innerHTML = '<option value="">-- Seleccione una mascota --</option>';
        document.getElementById('select_mascota').disabled = true;
    });

    // ── Tabla de dueños ──
    function cargarTablaDuenos(filtro = '') {
        const duenos = obtenerLista('vc_duenos');
        const tbody = document.getElementById('bodyDuenos');
        if (!tbody) return;

        tbody.innerHTML = '';
        const filtrados = duenos.filter(d =>
            d.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
            d.id.includes(filtro) ||
            d.correo.toLowerCase().includes(filtro.toLowerCase())
        );

        if (filtrados.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No hay resultados.</td></tr>`;
            return;
        }
        filtrados.forEach(d => {
            tbody.innerHTML += `
                <tr>
                    <td>${d.id}</td>
                    <td>${d.nombre}</td>
                    <td>${d.tel}</td>
                    <td>${d.correo}</td>
                    <td>${d.direccion}</td>
                </tr>`;
        });
    }

    const inputBuscarDueno = document.getElementById('buscar_dueno');
    if (inputBuscarDueno) {
        inputBuscarDueno.addEventListener('input', function () { cargarTablaDuenos(this.value); });
    }

    // ── Tabla de mascotas ──
    function cargarTablaMascotas(filtro = '') {
        const mascotas = obtenerLista('vc_mascotas');
        const duenos   = obtenerLista('vc_duenos');
        const tbody    = document.getElementById('bodyMascotas');
        if (!tbody) return;

        const filtradas = mascotas.filter(m =>
            m.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
            m.raza.toLowerCase().includes(filtro.toLowerCase()) ||
            m.categoria.toLowerCase().includes(filtro.toLowerCase())
        );

        if (filtradas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No hay resultados.</td></tr>`;
            return;
        }
        tbody.innerHTML = '';
        filtradas.forEach(m => {
            const dueno = duenos.find(d => d.id === m.id_dueno);
            tbody.innerHTML += `
                <tr>
                    <td><strong>${m.nombre}</strong></td>
                    <td>${m.categoria}</td>
                    <td>${m.raza}</td>
                    <td>${m.color}</td>
                    <td>${m.edad} años</td>
                    <td>${m.peso} kg</td>
                    <td>${dueno ? dueno.nombre : '—'}</td>
                </tr>`;
        });
    }

    const inputBuscarMascota = document.getElementById('buscar_mascota');
    if (inputBuscarMascota) {
        inputBuscarMascota.addEventListener('input', function () { cargarTablaMascotas(this.value); });
    }

    if (document.getElementById('bodyDuenos'))   cargarTablaDuenos();
    if (document.getElementById('bodyMascotas')) cargarTablaMascotas();

    // ── Expediente ──
    function cargarDuenosExp() {
        const duenos = obtenerLista('vc_duenos');
        const select = document.getElementById('select_dueno_exp');
        if (!select) return;

        if (duenos.length === 0) {
            select.innerHTML = '<option value="">No hay dueños registrados</option>';
            select.disabled = true;
            mostrarToast('No hay dueños registrados. Registre dueños primero.', 'warning');
            return;
        }
        select.innerHTML = '<option value="">-- Seleccione un dueño --</option>';
        select.disabled = false;
        duenos.forEach(d => {
            select.innerHTML += `<option value="${d.id}">${d.id} - ${d.nombre}</option>`;
        });
    }

    function cargarMascotasExp(idDueno) {
        const mascotas = obtenerLista('vc_mascotas');
        const select   = document.getElementById('select_mascota_exp');
        if (!select) return;

        if (!idDueno) {
            select.innerHTML = '<option value="">-- Seleccione una mascota --</option>';
            select.disabled = true;
            return;
        }
        const filtradas = mascotas.filter(m => m.id_dueno === idDueno);
        if (filtradas.length === 0) {
            select.innerHTML = '<option value="">No tiene mascotas registradas</option>';
            select.disabled = true;
            mostrarToast('Este dueño no tiene mascotas registradas.', 'warning');
            return;
        }
        select.innerHTML = '<option value="">-- Seleccione una mascota --</option>';
        select.disabled = false;
        filtradas.forEach(m => {
            const indiceReal = mascotas.indexOf(m);
            select.innerHTML += `<option value="${indiceReal}">${m.nombre} (${m.raza})</option>`;
        });
    }

    function mostrarExpediente(indexMascota) {
        const mascotas = obtenerLista('vc_mascotas');
        const duenos   = obtenerLista('vc_duenos');
        const citas    = obtenerLista('vc_citas');

        const mascota = mascotas[indexMascota];
        if (!mascota) { mostrarToast('Error: Mascota no encontrada.', 'error'); return; }

        const dueno = duenos.find(d => d.id === mascota.id_dueno);
        if (!dueno) { mostrarToast('Error: Dueño no encontrado.', 'error'); return; }

        document.getElementById('dueno_id').textContent        = dueno.id;
        document.getElementById('dueno_nombre').textContent    = dueno.nombre;
        document.getElementById('dueno_tel').textContent       = dueno.tel;
        document.getElementById('dueno_correo').textContent    = dueno.correo;
        document.getElementById('dueno_direccion').textContent = dueno.direccion || 'No especificada';
        document.getElementById('info_dueno').style.display    = 'block';

        document.getElementById('mascota_nombre').textContent    = mascota.nombre;
        document.getElementById('mascota_raza').textContent      = mascota.raza;
        document.getElementById('mascota_color').textContent     = mascota.color || 'No especificado';
        document.getElementById('mascota_categoria').textContent = mascota.categoria || 'No especificada';
        document.getElementById('mascota_edad').textContent      = mascota.edad || 'No especificada';
        document.getElementById('mascota_peso').textContent      = mascota.peso || 'No especificado';
        document.getElementById('info_mascota').style.display    = 'block';

        const citasMascota = citas.filter(c => c.index_mascota == indexMascota);
        const tbody = document.getElementById('tbody_historial');
        if (citasMascota.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay citas registradas para esta mascota</td></tr>';
        } else {
            tbody.innerHTML = '';
            citasMascota.forEach(cita => {
                const fechaCita   = new Date(cita.fecha + 'T' + cita.hora);
                const estado      = fechaCita < new Date() ? 'Completada' : 'Pendiente';
                const claseEstado = estado === 'Completada' ? 'text-success' : 'text-warning';
                tbody.innerHTML += `
                    <tr>
                        <td>${cita.fecha}</td>
                        <td>${cita.hora}</td>
                        <td>${cita.motivo || '-'}</td>
                        <td><span class="${claseEstado}">${estado}</span></td>
                    </tr>`;
            });
        }
        document.getElementById('historial_citas').style.display = 'block';
    }

    const selectDuenoExp   = document.getElementById('select_dueno_exp');
    const selectMascotaExp = document.getElementById('select_mascota_exp');

    if (selectDuenoExp) {
        selectDuenoExp.addEventListener('change', function () {
            cargarMascotasExp(this.value);
            document.getElementById('info_dueno').style.display    = 'none';
            document.getElementById('info_mascota').style.display  = 'none';
            document.getElementById('historial_citas').style.display = 'none';
        });
    }
    if (selectMascotaExp) {
        selectMascotaExp.addEventListener('change', function () {
            if (this.value) {
                mostrarExpediente(this.value);
            } else {
                document.getElementById('info_dueno').style.display    = 'none';
                document.getElementById('info_mascota').style.display  = 'none';
                document.getElementById('historial_citas').style.display = 'none';
            }
        });
    }
    if (document.getElementById('select_dueno_exp')) cargarDuenosExp();

    // ── Login ──
    if (!localStorage.getItem('vc_usuarios')) {
        localStorage.setItem('vc_usuarios', JSON.stringify([{ usuario: 'admin', contrasena: '1234' }]));
    }

    let mostrandoRegistro = false;

    function alternarFormularios() {
        mostrandoRegistro = !mostrandoRegistro;
        const formLogin    = document.getElementById('formLogin');
        const formRegistro = document.getElementById('formRegistro');
        const formTitle    = document.getElementById('formTitle');
        const formSubtitle = document.getElementById('formSubtitle');
        const toggleText   = document.getElementById('toggleText');
        const alertError   = document.getElementById('alertError');

        if (mostrandoRegistro) {
            formLogin.style.display    = 'none';
            formRegistro.style.display = 'block';
            formTitle.innerHTML        = 'Crea tu<br>cuenta.';
            formSubtitle.textContent   = 'Ingresá tus datos para registrarte.';
            toggleText.innerHTML       = '¿Ya tienes cuenta? <button type="button" id="btnToggleFormulario" style="background:none;border:none;color:#4a9b7f;cursor:pointer;text-decoration:underline;font-weight:600;">Inicia sesión</button>';
        } else {
            formLogin.style.display    = 'block';
            formRegistro.style.display = 'none';
            formTitle.innerHTML        = 'Bienvenido<br>de nuevo.';
            formSubtitle.textContent   = 'Ingresá tus datos para continuar.';
            toggleText.innerHTML       = '¿No tienes cuenta? <button type="button" id="btnToggleFormulario" style="background:none;border:none;color:#4a9b7f;cursor:pointer;text-decoration:underline;font-weight:600;">Crea una aquí</button>';
            limpiarFormularios();
        }
        if (alertError) alertError.classList.remove('visible');
        document.getElementById('btnToggleFormulario')?.addEventListener('click', alternarFormularios);
    }

    function limpiarFormularios() {
        document.getElementById('formLogin')?.reset();
        document.getElementById('formRegistro')?.reset();
        document.querySelectorAll('.campo-error').forEach(el => el.classList.remove('visible'));
        document.querySelectorAll('input').forEach(el => el.classList.remove('error-input'));
    }

    document.getElementById('btnToggleFormulario')?.addEventListener('click', alternarFormularios);

    // Limpiar datos
    document.getElementById('btnLimpiarDatos')?.addEventListener('click', async function () {
        const ok = await mostrarConfirm('¿Seguro que deseas limpiar todos los datos?\nEsto incluye usuarios, dueños, mascotas y citas.');
        if (ok) {
            localStorage.clear();
            mostrarToast('Datos limpiados. La página se recargará.', 'info');
            setTimeout(() => window.location.reload(), 1500);
        }
    });

    // Toggle contraseña login
    document.getElementById('togglePass')?.addEventListener('click', function () {
        const input   = document.getElementById('contrasena');
        const visible = input.type === 'text';
        input.type    = visible ? 'password' : 'text';
        this.textContent = visible ? '🔒' : '🔓';
    });

    // Submit login
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', function (e) {
            e.preventDefault();
            const inputUsuario = document.getElementById('usuario');
            const inputClave   = document.getElementById('contrasena');
            const errUsuario   = document.getElementById('err-usuario');
            const errClave     = document.getElementById('err-contrasena');
            const alertError   = document.getElementById('alertError');
            let valido = true;

            [inputUsuario, inputClave].forEach(i => i.classList.remove('error-input'));
            [errUsuario, errClave].forEach(el => el?.classList.remove('visible'));
            alertError?.classList.remove('visible');

            if (!inputUsuario.value.trim()) {
                inputUsuario.classList.add('error-input');
                errUsuario?.classList.add('visible');
                valido = false;
            }
            if (!inputClave.value.trim()) {
                inputClave.classList.add('error-input');
                errClave?.classList.add('visible');
                valido = false;
            }
            if (!valido) return;

            const usuarios = obtenerLista('vc_usuarios');
            const match = usuarios.find(u => u.usuario === inputUsuario.value.trim() && u.contrasena === inputClave.value);

            if (match) {
                localStorage.setItem('vc_sesion', JSON.stringify({ usuario: match.usuario }));
                window.location.href = 'index.html';
            } else {
                alertError?.classList.add('visible');
                const msg = document.getElementById('alertErrorMsg');
                if (msg) msg.textContent = 'Usuario o contraseña incorrectos.';
                inputClave.value = '';
                inputClave.focus();
            }
        });
    }

    // Submit registro
    const formRegistro = document.getElementById('formRegistro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', function (e) {
            e.preventDefault();
            const inputUsuarioReg    = document.getElementById('usuarioReg');
            const inputClaveReg      = document.getElementById('contrasenaReg');
            const inputConfirmarClave = document.getElementById('confirmarContrasena');
            const errUsuarioReg      = document.getElementById('err-usuarioReg');
            const errClaveReg        = document.getElementById('err-contrasenaReg');
            const errConfirmarClave  = document.getElementById('err-confirmarContrasena');
            let valido = true;

            [inputUsuarioReg, inputClaveReg, inputConfirmarClave].forEach(i => i.classList.remove('error-input'));
            [errUsuarioReg, errClaveReg, errConfirmarClave].forEach(el => el?.classList.remove('visible'));

            if (!inputUsuarioReg.value.trim()) {
                inputUsuarioReg.classList.add('error-input');
                errUsuarioReg.classList.add('visible');
                errUsuarioReg.textContent = 'El usuario es obligatorio.';
                valido = false;
            } else if (inputUsuarioReg.value.trim().length < 3) {
                inputUsuarioReg.classList.add('error-input');
                errUsuarioReg.classList.add('visible');
                errUsuarioReg.textContent = 'El usuario debe tener al menos 3 caracteres.';
                valido = false;
            }

            if (!inputClaveReg.value.trim()) {
                inputClaveReg.classList.add('error-input');
                errClaveReg.classList.add('visible');
                errClaveReg.textContent = 'La contraseña es obligatoria.';
                valido = false;
            } else if (inputClaveReg.value.trim().length < 4) {
                inputClaveReg.classList.add('error-input');
                errClaveReg.classList.add('visible');
                errClaveReg.textContent = 'La contraseña debe tener al menos 4 caracteres.';
                valido = false;
            }

            if (!inputConfirmarClave.value.trim()) {
                inputConfirmarClave.classList.add('error-input');
                errConfirmarClave.classList.add('visible');
                errConfirmarClave.textContent = 'Debes confirmar la contraseña.';
                valido = false;
            } else if (inputClaveReg.value !== inputConfirmarClave.value) {
                inputConfirmarClave.classList.add('error-input');
                errConfirmarClave.classList.add('visible');
                errConfirmarClave.textContent = 'Las contraseñas no coinciden.';
                valido = false;
            }
            if (!valido) return;

            const usuarios = obtenerLista('vc_usuarios');
            if (usuarios.find(u => u.usuario === inputUsuarioReg.value.trim())) {
                inputUsuarioReg.classList.add('error-input');
                errUsuarioReg.classList.add('visible');
                errUsuarioReg.textContent = 'Este usuario ya existe. Elige otro.';
                return;
            }

            usuarios.push({ usuario: inputUsuarioReg.value.trim(), contrasena: inputClaveReg.value });
            guardarLista('vc_usuarios', usuarios);
           mostrarToast('Cuenta creada exitosamente. Ahora inicia sesión.', 'success');
            formRegistro.reset();

            setTimeout(() => {
                alternarFormularios();
            
            },500);
                  });
                }

    // Toggle contraseña registro
    document.getElementById('togglePassReg')?.addEventListener('click', function () {
        const input = document.getElementById('contrasenaReg');
        const visible = input.type === 'text';
        input.type = visible ? 'password' : 'text';
        this.textContent = visible ? '🔒' : '🔓';
    });
    document.getElementById('togglePassConfirmar')?.addEventListener('click', function () {
        const input = document.getElementById('confirmarContrasena');
        const visible = input.type === 'text';
        input.type = visible ? 'password' : 'text';
        this.textContent = visible ? '🔒' : '🔓';
    });
});

// ── Citas: cargar dueños y mascotas en select ──
function cargarDuenos() {
    const duenos = JSON.parse(localStorage.getItem('vc_duenos') || '[]');
    const select = document.getElementById('select_dueno');
    if (!select) return;
    select.innerHTML = '<option value="">-- Seleccione un dueño --</option>';
    duenos.forEach(d => {
        select.innerHTML += `<option value="${d.id}">${d.id} - ${d.nombre}</option>`;
    });
}

function cargarMascotas(idDueno) {
    const mascotas = JSON.parse(localStorage.getItem('vc_mascotas') || '[]');
    const select   = document.getElementById('select_mascota');
    if (!select) return;
    select.innerHTML = '<option value="">-- Seleccione una mascota --</option>';
    if (idDueno) {
        const filtradas = mascotas.filter(m => m.id_dueno === idDueno);
        filtradas.forEach(m => {
            const indiceReal = mascotas.indexOf(m);
            select.innerHTML += `<option value="${indiceReal}">${m.nombre} (${m.raza})</option>`;
        });
        select.disabled = false;
    } else {
        select.disabled = true;
    }
}

document.getElementById('select_dueno')?.addEventListener('change', function () {
    cargarMascotas(this.value);
});

function cargarTabla() {
    const citas    = JSON.parse(localStorage.getItem('vc_citas')    || '[]');
    const mascotas = JSON.parse(localStorage.getItem('vc_mascotas') || '[]');
    const duenos   = JSON.parse(localStorage.getItem('vc_duenos')   || '[]');
    const tbody    = document.getElementById('tbody_citas');
    if (!tbody) return;

    if (citas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay citas agendadas</td></tr>';
        return;
    }
    tbody.innerHTML = '';
    citas.forEach((cita, index) => {
        const mascota    = mascotas[cita.index_mascota];
        if (!mascota) return;
        const dueno      = duenos.find(d => d.id === mascota.id_dueno);
        const nombreDueno = dueno ? dueno.nombre : 'Sin dueño';
        tbody.innerHTML += `
            <tr>
                <td>${cita.fecha}</td>
                <td>${cita.hora}</td>
                <td>${mascota.nombre}</td>
                <td>${nombreDueno}</td>
                <td>${cita.motivo || '-'}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="eliminarCita(${index})">Eliminar</button>
                </td>
            </tr>`;
    });
}

async function eliminarCita(index) {
    const ok = await mostrarConfirm('¿Está seguro de que desea eliminar esta cita?');
    if (ok) {
        const citas = JSON.parse(localStorage.getItem('vc_citas') || '[]');
        citas.splice(index, 1);
        localStorage.setItem('vc_citas', JSON.stringify(citas));
        mostrarToast('Cita eliminada correctamente.', 'info');
        cargarTabla();
    }
}

document.getElementById('buscar_cita')?.addEventListener('keyup', function () {
    const busqueda = this.value.toLowerCase();
    document.querySelectorAll('#tablaCitas tbody tr').forEach(fila => {
        fila.style.display = fila.textContent.toLowerCase().includes(busqueda) ? '' : 'none';
    });
});

window.addEventListener('load', () => {
    if (document.getElementById('select_dueno') && document.getElementById('tbody_citas')) {
        cargarDuenos();
        cargarTabla();
    }
});

if (!localStorage.getItem('vc_sesion') && !window.location.href.includes('login.html')) {
    window.location.href = 'login.html';

}

