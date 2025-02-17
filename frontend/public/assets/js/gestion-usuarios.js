document.addEventListener('DOMContentLoaded', function () {
    // Función para realizar la búsqueda
    function searchUsers() {
        const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
        const rows = document.querySelectorAll('#userTableBody tr');

        rows.forEach(row => {
            const userName = row.cells[1].textContent.toLowerCase();
            const userEmail = row.cells[2].textContent.toLowerCase();

            if (userName.includes(searchTerm) || userEmail.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // Delegación de eventos para botones de acción
    function handleTableActions(event) {
        const target = event.target;

        if (target.classList.contains('view-user-btn')) {
            alert('Ver detalles del usuario');
        } else if (target.classList.contains('edit-user-btn')) {
            alert('Ed

// Función para obtener usuarios desde el backend
async function fetchUsers() {
    try {
        const response = await fetch('/api/users', { method: 'GET', credentials: 'include' });
        const users = await response.json();

        const tableBody = document.getElementById('userTableBody');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar datos

        users.forEach(user => {
            const row = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>
                        <button class="btn btn-primary view-user-btn">Ver</button>
                        <button class="btn btn-warning edit-user-btn">Editar</button>
                        <button class="btn btn-danger delete-user-btn">Eliminar</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
    }
}

// Llamar la función al cargar la página
document.addEventListener('DOMContentLoaded', fetchUsers);
