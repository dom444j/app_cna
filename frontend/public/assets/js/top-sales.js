document.addEventListener('DOMContentLoaded', function () {
    const salesTableBody = document.getElementById('salesTableBody');
    const filterBtn = document.getElementById('filterBtn');
    const searchSales = document.getElementById('searchSales');
    const startDateFilter = document.getElementById('startDateFilter');
    const endDateFilter = document.getElementById('endDateFilter');

    // Simulación de datos (Reemplazar con datos reales)
    const salesData = [
        { id: '001', name: 'Juan Pérez', personalSales: 1500, directSales: 1200, totalSales: 2700, lastSale: '2025-02-10', qualifies: true, benefit: 1000 },
        { id: '002', name: 'María Gómez', personalSales: 1200, directSales: 800, totalSales: 2000, lastSale: '2025-02-08', qualifies: false, benefit: 0 },
        { id: '003', name: 'Luis Martínez', personalSales: 2000, directSales: 1500, totalSales: 3500, lastSale: '2025-02-09', qualifies: true, benefit: 1500 }
    ];

    // Renderizar tabla
    function renderTable(data) {
        salesTableBody.innerHTML = '';
        data.forEach(sale => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sale.id}</td>
                <td>${sale.name}</td>
                <td>${sale.personalSales} PVP</td>
                <td>${sale.directSales} PVP</td>
                <td>${sale.totalSales} PVP</td>
                <td>${sale.lastSale}</td>
                <td class="${sale.qualifies ? 'text-success' : 'text-danger'}">${sale.qualifies ? 'Califica' : 'No Califica'}</td>
                <td>${sale.qualifies ? `$${sale.benefit} USD` : '-'}</td>
                <td><button class="btn btn-sm btn-outline-primary">Ver Detalles</button></td>
            `;
            salesTableBody.appendChild(row);
        });
    }

    // Filtrar datos
    filterBtn.addEventListener('click', function () {
        const query = searchSales.value.toLowerCase();
        const startDate = startDateFilter.value;
        const endDate = endDateFilter.value;

        let filteredData = salesData.filter(sale => sale.name.toLowerCase().includes(query));

        if (startDate) {
            filteredData = filteredData.filter(sale => new Date(sale.lastSale) >= new Date(startDate));
        }

        if (endDate) {
            filteredData = filteredData.filter(sale => new Date(sale.lastSale) <= new Date(endDate));
        }

        renderTable(filteredData);
    });

    // Inicializar tabla
    renderTable(salesData);

    // Botón para descargar informe (simulación)
    document.getElementById('downloadReportBtn').addEventListener('click', function () {
        alert('Informe descargado exitosamente.');
    });
});
