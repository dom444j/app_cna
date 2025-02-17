document.addEventListener('DOMContentLoaded', function () {
    // ------------------------------
    // Búsqueda en Usuarios Activos
    // ------------------------------
    document.getElementById('searchActiveUsers').addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#activeUserTableBody tr');
        rows.forEach(row => {
            const userName = row.cells[1].textContent.toLowerCase();
            const userEmail = row.cells[2].textContent.toLowerCase();
            if (userName.includes(searchTerm) || userEmail.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // ------------------------------
    // Acciones en los botones (Ver, Editar, Desactivar)
    // ------------------------------
    document.querySelectorAll('.view-active-user-btn').forEach(button => {
        button.addEventListener('click', function () {
            alert('Ver detalles del usuario activo');
        });
    });

    document.querySelectorAll('.deactivate-user-btn').forEach(button => {
        button.addEventListener('click', function () {
            if (confirm('¿Deseas desactivar este usuario?')) {
                alert('Usuario desactivado');
            }
        });
    });

    document.querySelectorAll('.edit-active-user-btn').forEach(button => {
        button.addEventListener('click', function () {
            alert('Editar usuario activo');
        });
    });
});
