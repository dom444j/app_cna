document.addEventListener('DOMContentLoaded', function () {
    // Simulación de búsqueda
    document.getElementById('searchAffiliates').addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#affiliateTableBody tr');
        rows.forEach(row => {
            const name = row.cells[1].textContent.toLowerCase();
            const email = row.cells[2].textContent.toLowerCase();
            if (name.includes(searchTerm) || email.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Acciones de los botones (ver afiliado, eliminar)
    document.querySelectorAll('.view-affiliate-btn').forEach(button => {
        button.addEventListener('click', function () {
            alert('Ver detalles del afiliado');
        });
    });

    document.querySelectorAll('.delete-affiliate-btn').forEach(button => {
        button.addEventListener('click', function () {
            if (confirm('¿Estás seguro de eliminar este afiliado?')) {
                alert('Afiliado eliminado');
            }
        });
    });
});
