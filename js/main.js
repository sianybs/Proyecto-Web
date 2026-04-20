// --- FUNCIONES DE BASE DE DATOS LOCAL ---
const obtenerLista = (llave) => JSON.parse(localStorage.getItem(llave)) || [];
const guardarLista = (llave, lista) => localStorage.setItem(llave, JSON.stringify(lista));

// Función de validación mejorada
function validarCampos(campos) {
    let valido = true;
    campos.forEach(campo => {
        const elemento = document.getElementById(campo.id);
        if (!elemento) return; // Si el elemento no existe, continuar

        let valor = elemento.value.trim();

        // Validación básica de campo vacío
        if (!valor) {
            alert(campo.mensaje || `El campo ${campo.id} es obligatorio.`);
            elemento.focus();
            valido = false;
            return;
        }

        // Validaciones específicas por tipo
        if (campo.tipo === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(valor)) {
                alert('Por favor ingrese un correo electrónico válido.');
                elemento.focus();
                valido = false;
                return;
            }
        }

        if (campo.tipo === 'telefono') {
            // Permitir diferentes formatos de teléfono (ej: 8888-8888, 88888888, +50688888888)
            const telRegex = /^[\+]?[\d\s\-\(\)]{8,15}$/;
            if (!telRegex.test(valor.replace(/\s/g, ''))) {
                alert('Por favor ingrese un número de teléfono válido.');
                elemento.focus();
                valido = false;
                return;
            }
        }

        if (campo.tipo === 'numero') {
            if (isNaN(valor) || parseFloat(valor) <= 0) {
                alert(campo.mensaje || 'Por favor ingrese un número válido mayor a 0.');
                elemento.focus();
                valido = false;
                return;
            }
        }

        if (campo.tipo === 'fecha') {
            const fecha = new Date(valor);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            if (fecha < hoy) {
                alert('La fecha no puede ser anterior a hoy.');
                elemento.focus();
                valido = false;
                return;
            }
        }
    });
    return valido;
}

document.addEventListener('DOMContentLoaded', () => {
    
    // Formulario de duenos
    const fDuenos = document.getElementById('formDuenos');
    fDuenos?.addEventListener('submit', (e) => {
        e.preventDefault();
        const campos = [
            { id: 'id_dueno', mensaje: 'El ID del dueño es obligatorio.' },
            { id: 'nombre_dueno', mensaje: 'El nombre del dueño es obligatorio.' },
            { id: 'tel_dueno', mensaje: 'El teléfono del dueño es obligatorio.', tipo: 'telefono' },
            { id: 'correo_dueno', mensaje: 'El correo del dueño es obligatorio.', tipo: 'email' },
            { id: 'direccion_dueno', mensaje: 'La dirección del dueño es obligatoria.' }
        ];
        if (!validarCampos(campos)) return;
        
        const lista = obtenerLista('vc_duenos');
        lista.push({
            id: document.getElementById('id_dueno').value,
            nombre: document.getElementById('nombre_dueno').value,
            tel: document.getElementById('tel_dueno').value,
            correo: document.getElementById('correo_dueno').value,
            direccion: document.getElementById('direccion_dueno').value
        });
        guardarLista('vc_duenos', lista);
        alert("Dueño guardado correctamente");
        fDuenos.reset();
    });

    // Formulario de mascotas (y carga de dueños por ID)
    const fMascotas = document.getElementById('formMascotas');
    const selDuenos = document.getElementById('select_dueno');
    
    if (selDuenos) {
        obtenerLista('vc_duenos').forEach(d => {
            selDuenos.innerHTML += `<option value="${d.id}">${d.nombre}</option>`;
        });
    }

    fMascotas?.addEventListener('submit', (e) => {
        e.preventDefault();
        const campos = [
            { id: 'select_dueno', mensaje: 'Debe seleccionar un dueño.' },
            { id: 'nombre_mascota', mensaje: 'El nombre de la mascota es obligatorio.' },
            { id: 'raza_mascota', mensaje: 'La raza de la mascota es obligatoria.' },
            { id: 'color_mascota', mensaje: 'El color de la mascota es obligatorio.' },
            { id: 'categoria_mascota', mensaje: 'La categoría de la mascota es obligatoria.' },
            { id: 'edad_mascota', mensaje: 'La edad de la mascota es obligatoria.', tipo: 'numero' },
            { id: 'peso_mascota', mensaje: 'El peso de la mascota es obligatorio.', tipo: 'numero' }
        ];
        if (!validarCampos(campos)) return;
        
        const lista = obtenerLista('vc_mascotas');
        lista.push({
            id_dueno: selDuenos.value,
            nombre: document.getElementById('nombre_mascota').value,
            raza: document.getElementById('raza_mascota').value,
            color: document.getElementById('color_mascota').value,
            categoria: document.getElementById('categoria_mascota').value,
            edad: document.getElementById('edad_mascota').value,
            peso: document.getElementById('peso_mascota').value
        });
        guardarLista('vc_mascotas', lista);
        alert("Mascota registrada");
        fMascotas.reset();
    });

    // Formulario de citas (y carga de mascotas)
    const fCitas = document.getElementById('formCitas');
    const selMascotas = document.getElementById('select_mascota');

    // Nota: Las mascotas se cargan desde citas.html según el dueño seleccionado

    fCitas?.addEventListener('submit', (e) => {
        e.preventDefault();
        const campos = [
            { id: 'select_dueno', mensaje: 'Debe seleccionar un dueño.' },
            { id: 'select_mascota', mensaje: 'Debe seleccionar una mascota.' },
            { id: 'fecha_cita', mensaje: 'La fecha de la cita es obligatoria.', tipo: 'fecha' },
            { id: 'hora_cita', mensaje: 'La hora de la cita es obligatoria.' }
        ];
        if (!validarCampos(campos)) return;
        
        const lista = obtenerLista('vc_citas');
        lista.push({
            index_mascota: selMascotas.value,
            fecha: document.getElementById('fecha_cita').value,
            hora: document.getElementById('hora_cita').value,
            motivo: document.getElementById('motivo_cita')?.value || ''
        });
        guardarLista('vc_citas', lista);
        alert("Cita agendada con éxito");
        fCitas.reset();
        // Resetear selects después de enviar
        document.getElementById('select_dueno').value = '';
        document.getElementById('select_mascota').innerHTML = '<option value="">-- Seleccione una mascota --</option>';
        document.getElementById('select_mascota').disabled = true;
    });

    // ── FUNCIONES PARA DUENOS ──
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
        inputBuscarDueno.addEventListener('input', function() {
            cargarTablaDuenos(this.value);
        });
    }

    // ── FUNCIONES PARA MASCOTAS ──
    function cargarTablaMascotas(filtro = '') {
        const mascotas = obtenerLista('vc_mascotas');
        const duenos = obtenerLista('vc_duenos');
        const tbody = document.getElementById('bodyMascotas');
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
        inputBuscarMascota.addEventListener('input', function() {
            cargarTablaMascotas(this.value);
        });
    }

    // ── INICIALIZACIONES ──
    if (document.getElementById('bodyDuenos')) {
        cargarTablaDuenos();
    }

    if (document.getElementById('bodyMascotas')) {
        cargarTablaMascotas();
    }

    // ── FUNCIONES PARA EXPEDIENTE ──
    function validarSeleccionExpediente() {
        const selectDueno = document.getElementById('select_dueno_exp');
        const selectMascota = document.getElementById('select_mascota_exp');

        if (!selectDueno.value) {
            alert('Por favor seleccione un dueño primero.');
            selectDueno.focus();
            return false;
        }

        if (!selectMascota.value) {
            alert('Por favor seleccione una mascota.');
            selectMascota.focus();
            return false;
        }

        return true;
    }

    function cargarDuenosExp() {
        const duenos = obtenerLista('vc_duenos');
        const select = document.getElementById('select_dueno_exp');

        if (duenos.length === 0) {
            select.innerHTML = '<option value="">No hay dueños registrados</option>';
            select.disabled = true;
            alert('No hay dueños registrados en el sistema. Registre dueños primero.');
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
        const select = document.getElementById('select_mascota_exp');

        if (!idDueno) {
            select.innerHTML = '<option value="">-- Seleccione una mascota --</option>';
            select.disabled = true;
            return;
        }

        const mascotasFiltradas = mascotas.filter(m => m.id_dueno === idDueno);

        if (mascotasFiltradas.length === 0) {
            select.innerHTML = '<option value="">No tiene mascotas registradas</option>';
            select.disabled = true;
            alert('Este dueño no tiene mascotas registradas.');
            return;
        }

        select.innerHTML = '<option value="">-- Seleccione una mascota --</option>';
        select.disabled = false;

        mascotasFiltradas.forEach((m) => {
            const indiceReal = mascotas.indexOf(m);
            select.innerHTML += `<option value="${indiceReal}">${m.nombre} (${m.raza})</option>`;
        });
    }

    function mostrarExpediente(indexMascota) {
        if (!validarSeleccionExpediente()) {
            return;
        }

        const mascotas = obtenerLista('vc_mascotas');
        const duenos = obtenerLista('vc_duenos');
        const citas = obtenerLista('vc_citas');

        const mascota = mascotas[indexMascota];
        if (!mascota) {
            alert('Error: Mascota no encontrada.');
            return;
        }

        const dueno = duenos.find(d => d.id === mascota.id_dueno);
        if (!dueno) {
            alert('Error: Dueño no encontrado.');
            return;
        }

        // Mostrar información del dueño
        document.getElementById('dueno_id').textContent = dueno.id;
        document.getElementById('dueno_nombre').textContent = dueno.nombre;
        document.getElementById('dueno_tel').textContent = dueno.tel;
        document.getElementById('dueno_correo').textContent = dueno.correo;
        document.getElementById('dueno_direccion').textContent = dueno.direccion || 'No especificada';
        document.getElementById('info_dueno').style.display = 'block';

        // Mostrar información de la mascota
        document.getElementById('mascota_nombre').textContent = mascota.nombre;
        document.getElementById('mascota_raza').textContent = mascota.raza;
        document.getElementById('mascota_color').textContent = mascota.color || 'No especificado';
        document.getElementById('mascota_categoria').textContent = mascota.categoria || 'No especificada';
        document.getElementById('mascota_edad').textContent = mascota.edad || 'No especificada';
        document.getElementById('mascota_peso').textContent = mascota.peso || 'No especificado';
        document.getElementById('info_mascota').style.display = 'block';

        // Mostrar historial de citas
        const citasMascota = citas.filter(c => c.index_mascota == indexMascota);
        const tbody = document.getElementById('tbody_historial');

        if (citasMascota.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay citas registradas para esta mascota</td></tr>';
        } else {
            tbody.innerHTML = '';
            citasMascota.forEach(cita => {
                const fechaActual = new Date();
                const fechaCita = new Date(cita.fecha + 'T' + cita.hora);
                const estado = fechaCita < fechaActual ? 'Completada' : 'Pendiente';
                const claseEstado = estado === 'Completada' ? 'text-success' : 'text-warning';

                tbody.innerHTML += `
                    <tr>
                        <td>${cita.fecha}</td>
                        <td>${cita.hora}</td>
                        <td>${cita.motivo || '-'}</td>
                        <td><span class="${claseEstado}">${estado}</span></td>
                    </tr>
                `;
            });
        }
        document.getElementById('historial_citas').style.display = 'block';
    }

    // ── EVENT LISTENERS PARA EXPEDIENTE ──
    const selectDuenoExp = document.getElementById('select_dueno_exp');
    const selectMascotaExp = document.getElementById('select_mascota_exp');

    if (selectDuenoExp) {
        selectDuenoExp.addEventListener('change', function() {
            const idDueno = this.value;
            cargarMascotasExp(idDueno);
            // Ocultar información cuando cambie el dueño
            document.getElementById('info_dueno').style.display = 'none';
            document.getElementById('info_mascota').style.display = 'none';
            document.getElementById('historial_citas').style.display = 'none';
        });
    }

    if (selectMascotaExp) {
        selectMascotaExp.addEventListener('change', function() {
            const indexMascota = this.value;
            if (indexMascota) {
                mostrarExpediente(indexMascota);
            } else {
                document.getElementById('info_dueno').style.display = 'none';
                document.getElementById('info_mascota').style.display = 'none';
                document.getElementById('historial_citas').style.display = 'none';
            }
        });
    }

    // ── INICIALIZACIÓN PARA EXPEDIENTE ──
    if (document.getElementById('select_dueno_exp')) {
        cargarDuenosExp();
    }

    // ── FUNCIONES PARA LOGIN ──
    // Inicializar usuarios por defecto si no existen
    if (!localStorage.getItem('vc_usuarios')) {
        localStorage.setItem('vc_usuarios', JSON.stringify([
            { usuario: 'admin', contrasena: '1234' }
        ]));
    }

    // Variables para controlar la vista (login o registro)
    let mostrandoRegistro = false;

    // Función para alternar entre login y registro
    function alternarFormularios() {
        mostrandoRegistro = !mostrandoRegistro;
        const formLogin = document.getElementById('formLogin');
        const formRegistro = document.getElementById('formRegistro');
        const formTitle = document.getElementById('formTitle');
        const formSubtitle = document.getElementById('formSubtitle');
        const toggleText = document.getElementById('toggleText');
        const alertError = document.getElementById('alertError');

        if (mostrandoRegistro) {
            formLogin.style.display = 'none';
            formRegistro.style.display = 'block';
            formTitle.innerHTML = 'Crea tu<br>cuenta.';
            formSubtitle.textContent = 'Ingresá tus datos para registrarte.';
            toggleText.innerHTML = '¿Ya tienes cuenta? <button type="button" id="btnToggleFormulario" style="background: none; border: none; color: #4a9b7f; cursor: pointer; text-decoration: underline; font-weight: 600; transition: color 0.2s;" onmouseover="this.style.color=\'#357a62\'" onmouseout="this.style.color=\'#4a9b7f\'">Inicia sesión</button>';
            alertError.classList.remove('visible');
            // Agregar event listener al nuevo botón
            document.getElementById('btnToggleFormulario').addEventListener('click', alternarFormularios);
        } else {
            formLogin.style.display = 'block';
            formRegistro.style.display = 'none';
            formTitle.innerHTML = 'Bienvenido<br>de nuevo.';
            formSubtitle.textContent = 'Ingresá tus datos para continuar.';
            toggleText.innerHTML = '¿No tienes cuenta? <button type="button" id="btnToggleFormulario" style="background: none; border: none; color: #4a9b7f; cursor: pointer; text-decoration: underline; font-weight: 600; transition: color 0.2s;" onmouseover="this.style.color=\'#357a62\'" onmouseout="this.style.color=\'#4a9b7f\'">Crea una aquí</button>';
            alertError.classList.remove('visible');
            limpiarFormularios();
            // Agregar event listener al nuevo botón
            document.getElementById('btnToggleFormulario').addEventListener('click', alternarFormularios);
        }
    }

    // Función para limpiar formularios
    function limpiarFormularios() {
        const formLogin = document.getElementById('formLogin');
        const formRegistro = document.getElementById('formRegistro');
        if (formLogin) formLogin.reset();
        if (formRegistro) formRegistro.reset();
        document.querySelectorAll('.campo-error').forEach(el => el.classList.remove('visible'));
        document.querySelectorAll('input').forEach(el => el.classList.remove('error-input'));
    }

    // Event listener para botón de alternar
    const btnToggleFormulario = document.getElementById('btnToggleFormulario');
    if (btnToggleFormulario) {
        btnToggleFormulario.addEventListener('click', alternarFormularios);
    }

    // Botón para limpiar todos los datos del LocalStorage
    const btnLimpiarDatos = document.getElementById('btnLimpiarDatos');
    if (btnLimpiarDatos) {
        btnLimpiarDatos.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas limpiar todos los datos de la aplicación?\n\nEsto incluye: usuarios, dueños, mascotas y citas.')) {
                localStorage.clear();
                alert('Datos limpiados correctamente. La página se recargará.');
                window.location.reload();
            }
        });
    }

    // Toggle mostrar/ocultar contraseña
    const togglePass = document.getElementById('togglePass');
    if (togglePass) {
        togglePass.addEventListener('click', function() {
            const input = document.getElementById('contrasena');
            const visible = input.type === 'text';
            input.type = visible ? 'password' : 'text';
            this.textContent = visible ? '👁️' : '🙈';
        });
    }

    // Submit del formulario de login
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();

            const inputUsuario = document.getElementById('usuario');
            const inputClave = document.getElementById('contrasena');
            const errUsuario = document.getElementById('err-usuario');
            const errClave = document.getElementById('err-contrasena');
            const alertError = document.getElementById('alertError');
            let valido = true;

            // Limpiar errores previos
            [inputUsuario, inputClave].forEach(i => i.classList.remove('error-input'));
            [errUsuario, errClave].forEach(el => el.classList.remove('visible'));
            alertError.classList.remove('visible');

            // Validar usuario
            if (!inputUsuario.value.trim()) {
                inputUsuario.classList.add('error-input');
                errUsuario.classList.add('visible');
                valido = false;
            }

            // Validar contraseña
            if (!inputClave.value.trim()) {
                inputClave.classList.add('error-input');
                errClave.classList.add('visible');
                valido = false;
            }

            if (!valido) return;

            // Verificar credenciales
            const usuarios = obtenerLista('vc_usuarios');
            const match = usuarios.find(
                u => u.usuario === inputUsuario.value.trim() &&
                    u.contrasena === inputClave.value
            );

            if (match) {
                localStorage.setItem('vc_sesion', JSON.stringify({ usuario: match.usuario }));
                window.location.href = 'index.html';
            } else {
                alertError.classList.add('visible');
                document.getElementById('alertErrorMsg').textContent = 'Usuario o contraseña incorrectos.';
                inputClave.value = '';
                inputClave.focus();
            }
        });
    }

    // Submit del formulario de registro
    const formRegistro = document.getElementById('formRegistro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', function(e) {
            e.preventDefault();

            const inputUsuarioReg = document.getElementById('usuarioReg');
            const inputClaveReg = document.getElementById('contrasenaReg');
            const inputConfirmarClave = document.getElementById('confirmarContrasena');
            const errUsuarioReg = document.getElementById('err-usuarioReg');
            const errClaveReg = document.getElementById('err-contrasenaReg');
            const errConfirmarClave = document.getElementById('err-confirmarContrasena');
            const alertError = document.getElementById('alertError');
            let valido = true;

            // Limpiar errores previos
            [inputUsuarioReg, inputClaveReg, inputConfirmarClave].forEach(i => i.classList.remove('error-input'));
            [errUsuarioReg, errClaveReg, errConfirmarClave].forEach(el => el.classList.remove('visible'));
            alertError.classList.remove('visible');

            // Validar usuario
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

            // Validar contraseña
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

            // Validar confirmación
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

            // Verificar que el usuario no exista
            const usuarios = obtenerLista('vc_usuarios');
            const usuarioExistente = usuarios.find(u => u.usuario === inputUsuarioReg.value.trim());

            if (usuarioExistente) {
                inputUsuarioReg.classList.add('error-input');
                errUsuarioReg.classList.add('visible');
                errUsuarioReg.textContent = 'Este usuario ya existe. Elige otro.';
                return;
            }

            // Crear nueva cuenta
            usuarios.push({
                usuario: inputUsuarioReg.value.trim(),
                contrasena: inputClaveReg.value
            });

            guardarLista('vc_usuarios', usuarios);
            alert('¡Cuenta creada exitosamente! Ahora inicia sesión.');
            
            // Limpiar y volver a login
            formRegistro.reset();
            alternarFormularios();
            inputUsuarioReg.focus();
        });
    }

    // Toggle mostrar/ocultar contraseña
    const togglePassReg = document.getElementById('togglePassReg');
    if (togglePassReg) {
        togglePassReg.addEventListener('click', function() {
            const input = document.getElementById('contrasena');
            const visible = input.type === 'text';
            input.type = visible ? 'password' : 'text';
            this.textContent = visible ? '👁️' : '🙈';
        });
    }
    // Toggle mostrar/ocultar contraseña para registro
    const togglePassConfirmar = document.getElementById('togglePassConfirmar');
    if (togglePassConfirmar) {
        togglePassConfirmar.addEventListener('click', function() {
            const input = document.getElementById('confirmarContrasena');
            const visible = input.type === 'text';
            input.type = visible ? 'password' : 'text';
            this.textContent = visible ? '👁️' : '🙈';
        });
    }
});

// ── Cargar dueños en el select ──
        function cargarDuenos() {
            const duenos = JSON.parse(localStorage.getItem('vc_duenos') || '[]');
            const select = document.getElementById('select_dueno');
            
            select.innerHTML = '<option value="">-- Seleccione un dueño --</option>';
            
            duenos.forEach(d => {
                select.innerHTML += `<option value="${d.id}">${d.id} - ${d.nombre}</option>`;
            });
        }

        // ── Cargar mascotas filtradas por dueño ──
        function cargarMascotas(idDueno) {
            const mascotas = JSON.parse(localStorage.getItem('vc_mascotas') || '[]');
            const select = document.getElementById('select_mascota');
            
            select.innerHTML = '<option value="">-- Seleccione una mascota --</option>';
            
            if (idDueno) {
                const mascotasFiltradas = mascotas.filter(m => m.id_dueno === idDueno);
                mascotasFiltradas.forEach((m, index) => {
                    // Encontrar el índice real en el array completo
                    const indiceReal = mascotas.indexOf(m);
                    select.innerHTML += `<option value="${indiceReal}">${m.nombre} (${m.raza})</option>`;
                });
                select.disabled = false;
            } else {
                select.disabled = true;
            }
        }

        // ── Event listener para cambio de dueño ──
        document.getElementById('select_dueno').addEventListener('change', function() {
            const idDueno = this.value;
            cargarMascotas(idDueno);
        });

        // ── Cargar tabla de citas ──
        function cargarTabla() {
            const citas = JSON.parse(localStorage.getItem('vc_citas') || '[]');
            const mascotas = JSON.parse(localStorage.getItem('vc_mascotas') || '[]');
            const duenos = JSON.parse(localStorage.getItem('vc_duenos') || '[]');
            const tbody = document.getElementById('tbody_citas');
            
            if (citas.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay citas agendadas</td></tr>';
                return;
            }
            
            tbody.innerHTML = '';
            citas.forEach((cita, index) => {
                const mascota = mascotas[cita.index_mascota];
                if (!mascota) return;
                
                const dueno = duenos.find(d => d.id === mascota.id_dueno);
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
                    </tr>
                `;
            });
        }

        // ── Eliminar cita ──
        function eliminarCita(index) {
            if (confirm('¿Está seguro de que desea eliminar esta cita?')) {
                const citas = JSON.parse(localStorage.getItem('vc_citas') || '[]');
                citas.splice(index, 1);
                localStorage.setItem('vc_citas', JSON.stringify(citas));
                cargarTabla();
            }
        }

        // ── Buscar citas ──
        document.getElementById('buscar_cita')?.addEventListener('keyup', function() {
            const busqueda = this.value.toLowerCase();
            const filas = document.querySelectorAll('#tablaCitas tbody tr');
            
            filas.forEach(fila => {
                const texto = fila.textContent.toLowerCase();
                fila.style.display = texto.includes(busqueda) ? '' : 'none';
            });
        });

        // ── Iniciar ──
        window.addEventListener('load', () => {
            cargarDuenos();
            cargarTabla();
        });

        // Verificar sesión
        if (!localStorage.getItem('vc_sesion')) {
            window.location.href = 'login.html';
        }