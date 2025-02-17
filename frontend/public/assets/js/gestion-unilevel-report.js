document.addEventListener('DOMContentLoaded', function () {
    const reportData = [
        { id: "U100", name: "Usuario A", rank: "Consultor", points: 1200, registrationDate: "2022-03-15", state: "Activo", sponsor: "Admin Principal", level: 1 },
        { id: "U200", name: "Usuario B", rank: "Distribuidor", points: 1500, registrationDate: "2022-05-22", state: "Inactivo", sponsor: "Admin Principal", level: 1 },
        { id: "U300", name: "Usuario C", rank: "Afiliado", points: 900, registrationDate: "2023-01-05", state: "Activo", sponsor: "Admin Principal", level: 1 },
        { id: "U400", name: "Usuario D", rank: "Afiliado", points: 600, registrationDate: "2023-04-10", state: "Activo", sponsor: "Usuario A", level: 2 },
        { id: "U500", name: "Usuario E", rank: "Distribuidor", points: 1400, registrationDate: "2023-03-25", state: "Inactivo", sponsor: "Usuario B", level: 2 },
        // Agrega más datos si es necesario
    ];

    const tableBody = document.getElementById('reportTableBody');
    const rowsPerPage = 5;
    let currentPage = 1;

    function generateTableRows(data) {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

        tableBody.innerHTML = '';
        paginatedData.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.rank}</td>
                <td>${user.points}</td>
                <td>${user.registrationDate}</td>
                <td><span class="badge bg-${user.state === 'Activo' ? 'success' : 'secondary'}">${user.state}</span></td>
                <td>${user.sponsor}</td>
                <td>${user.level}</td>
                <td>
                    <button class="btn btn-outline-info btn-sm view-details-btn" data-id="${user.id}">Ver Detalles</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        updatePaginationControls(data.length);
    }

    function updatePaginationControls(totalRows) {
        const totalPages = Math.ceil(totalRows / rowsPerPage);
        const paginationContainer = document.getElementById('paginationControls');

        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-outline-secondary'}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', function () {
                currentPage = i;
                generateTableRows(reportData);
            });
            paginationContainer.appendChild(pageBtn);
        }
    }

    // Inicializar tabla
    generateTableRows(reportData);

    // Función de búsqueda
    document.getElementById('filterUserBtn').addEventListener('click', function () {
        const searchText = document.getElementById('searchUserReport').value.toLowerCase();
        const filteredData = reportData.filter(user =>
            user.name.toLowerCase().includes(searchText) || user.id.toLowerCase().includes(searchText)
        );
        currentPage = 1;
        generateTableRows(filteredData);
    });

    // Filtros de rango y estado
    document.getElementById('filterRank').addEventListener('change', function () {
        const selectedRank = this.value;
        const filteredData = reportData.filter(user => !selectedRank || user.rank === selectedRank);
        currentPage = 1;
        generateTableRows(filteredData);
    });

    document.getElementById('filterStatus').addEventListener('change', function () {
        const selectedStatus = this.value;
        const filteredData = reportData.filter(user => !selectedStatus || user.state === selectedStatus);
        currentPage = 1;
        generateTableRows(filteredData);
    });
});
