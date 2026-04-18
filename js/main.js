// --- FUNCIONES DE BASE DE DATOS LOCAL ---
const obtenerLista = (llave) => JSON.parse(localStorage.getItem(llave)) || [];
const guardarLista = (llave, lista) => localStorage.setItem(llave, JSON.stringify(lista));

document.addEventListener('DOMContentLoaded', () => {
    
    // Formulario de duenos
    const fDuenos = document.getElementById('formDuenos');
    fDuenos?.addEventListener('submit', (e) => {
        e.preventDefault();
        const lista = obtenerLista('db_duenos');
        lista.push({
            id: document.getElementById('id_dueno').value,
            nombre: document.getElementById('nombre_dueno').value,
            tel: document.getElementById('tel_dueno').value,
            correo: document.getElementById('correo_dueno').value
        });
        guardarLista('db_duenos', lista);
        alert("Dueño guardado correctamente");
        fDuenos.reset();
    });

    // Formulario de mascotas (y cargar dueños)
    const fMascotas = document.getElementById('formMascotas');
    const selDuenos = document.getElementById('select_dueno');
    
    if (selDuenos) {
        obtenerLista('db_duenos').forEach(d => {
            selDuenos.innerHTML += `<option value="${d.id}">${d.nombre}</option>`;
        });
    }

    fMascotas?.addEventListener('submit', (e) => {
        e.preventDefault();
        const lista = obtenerLista('db_mascotas');
        lista.push({
            id_dueno: selDuenos.value,
            nombre: document.getElementById('nombre_mascota').value,
            raza: document.getElementById('raza_mascota').value
        });
        guardarLista('db_mascotas', lista);
        alert("Mascota registrada");
        fMascotas.reset();
    });

    // Formulario de citas (y cargar mascotas)
    const fCitas = document.getElementById('formCitas');
    const selMascotas = document.getElementById('select_mascota');

    if (selMascotas) {
        obtenerLista('db_mascotas').forEach((m, index) => {
            selMascotas.innerHTML += `<option value="${index}">${m.nombre}</option>`;
        });
    }

    fCitas?.addEventListener('submit', (e) => {
        e.preventDefault();
        const lista = obtenerLista('db_citas');
        lista.push({
            index_mascota: selMascotas.value,
            fecha: document.getElementById('fecha_cita').value,
            hora: document.getElementById('hora_cita').value
        });
        guardarLista('db_citas', lista);
        alert("Cita agendada con éxito");
        fCitas.reset();
    });
});