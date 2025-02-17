document.addEventListener('DOMContentLoaded', function () {
    // **1. Gráficos**: Configuración y renderización con Chart.js
    const usersDistributionCtx = document.getElementById('usersDistributionChart').getContext('2d');
    const networkGrowthCtx = document.getElementById('networkGrowthChart').getContext('2d');

    // Gráfico: Distribución de Usuarios
    new Chart(usersDistributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Activos', 'Inactivos'],
            datasets: [{
                data: [1245, 320], // Datos de ejemplo
                backgroundColor: ['#28a745', '#dc3545']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Gráfico: Crecimiento de Red
    new Chart(networkGrowthCtx, {
        type: 'line',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'], // Meses de ejemplo
            datasets: [{
                label: 'Nuevas Afiliaciones',
                data: [30, 45, 60, 50, 70], // Datos de ejemplo
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Meses'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Afiliaciones'
                    }
                }
            }
        }
    });

    // **2. Tabla Detallada: Búsqueda, Paginación y Exportación**
    const networkTable = document.getElementById('networkUsersTable');
    const searchInput = document.getElementById('searchNetworkTable');
    const exportBtn = document.getElementById('exportNetworkReportBtn');

    // Búsqueda en la tabla
    searchInput.addEventListener('input', function () {
        const searchText = this.value.toLowerCase();
        const rows = networkTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const rowData = row.innerText.toLowerCase();
            row.style.display = rowData.includes(searchText) ? '' : 'none';
        });
    });

    // Exportación de la tabla a CSV
    exportBtn.addEventListener('click', function () {
        const rows = networkTable.querySelectorAll('tr');
        let csvContent = '';

        rows.forEach(row => {
            const cells = row.querySelectorAll('th, td');
            const rowContent = Array.from(cells).map(cell => `"${cell.innerText}"`).join(',');
            csvContent += rowContent + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'network-report.csv';
        link.click();
    });

    // **3. Paginación**
    const rowsPerPage = 5;
    let currentPage = 1;

    function paginateTable() {
        const rows = networkTable.querySelectorAll('tbody tr');
        const totalRows = rows.length;
        const totalPages = Math.ceil(totalRows / rowsPerPage);

        // Mostrar solo las filas de la página actual
        rows.forEach((row, index) => {
            row.style.display = (index >= (currentPage - 1) * rowsPerPage &&
                index < currentPage * rowsPerPage) ? '' : 'none';
        });

        // Crear o actualizar la paginación
        let pagination = document.getElementById('pagination');
        if (!pagination) {
            pagination = document.createElement('div');
            pagination.id = 'pagination';
            pagination.classList.add('pagination', 'mt-3');
            networkTable.parentNode.appendChild(pagination);
        }

        pagination.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.className = 'btn btn-outline-primary btn-sm mx-1';
            if (i === currentPage) pageBtn.classList.add('active');
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                paginateTable();
            });
            pagination.appendChild(pageBtn);
        }
    }

    // Inicializar paginación
    paginateTable();
});
