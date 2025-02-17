document.addEventListener('DOMContentLoaded', function () {
    const tables = {
        leader: document.getElementById('topLeaderTable'),
        recruiter: document.getElementById('topRecruiterTable'),
        seller: document.getElementById('topSellerTable')
    };

    const spinners = {
        leader: document.getElementById('loadingSpinnerLeader'),
        recruiter: document.getElementById('loadingSpinnerRecruiter'),
        seller: document.getElementById('loadingSpinnerSeller')
    };

    // Función para mostrar el spinner
    function showSpinner(type) {
        spinners[type].classList.remove('d-none');
    }

    // Función para ocultar el spinner
    function hideSpinner(type) {
        spinners[type].classList.add('d-none');
    }

    // Simulación de carga inicial
    Object.keys(spinners).forEach(type => {
        showSpinner(type);
        setTimeout(() => hideSpinner(type), 1500); // Simulación de carga de 1.5 segundos
    });

    // Función de filtro de búsqueda
    function filterTableRows(tableId, searchText) {
        const rows = tables[tableId].querySelectorAll('tbody tr');
        rows.forEach(row => {
            const rowData = row.innerText.toLowerCase();
            row.style.display = rowData.includes(searchText) ? '' : 'none';
        });
    }

    // Eventos de búsqueda
    document.getElementById('searchTopLeaderTable').addEventListener('input', function () {
        filterTableRows('leader', this.value.toLowerCase());
    });
    document.getElementById('searchTopRecruiterTable').addEventListener('input', function () {
        filterTableRows('recruiter', this.value.toLowerCase());
    });
    document.getElementById('searchTopSellerTable').addEventListener('input', function () {
        filterTableRows('seller', this.value.toLowerCase());
    });

    // Paginación
    const rowsPerPage = 5;
    let currentPage = {
        leader: 1,
        recruiter: 1,
        seller: 1
    };

    function paginateTable(tableId) {
        const table = tables[tableId];
        const rows = table.querySelectorAll('tbody tr');
        const totalRows = rows.length;
        const totalPages = Math.ceil(totalRows / rowsPerPage);

        rows.forEach((row, index) => {
            row.style.display = (index >= (currentPage[tableId] - 1) * rowsPerPage &&
                index < currentPage[tableId] * rowsPerPage) ? '' : 'none';
        });

        const paginationContainerId = `pagination-${tableId}`;
        let pagination = document.getElementById(paginationContainerId);
        if (!pagination) {
            pagination = document.createElement('div');
            pagination.id = paginationContainerId;
            pagination.classList.add('pagination', 'mt-3');
            table.parentNode.appendChild(pagination);
        }

        pagination.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.className = 'btn btn-outline-primary btn-sm mx-1';
            if (i === currentPage[tableId]) pageBtn.classList.add('active');
            pageBtn.addEventListener('click', () => {
                currentPage[tableId] = i;
                paginateTable(tableId);
            });
            pagination.appendChild(pageBtn);
        }
    }

    // Paginación inicial
    Object.keys(tables).forEach(tableId => paginateTable(tableId));

    // Exportación a CSV
    function exportTableToCSV(tableId) {
        const table = tables[tableId];
        const rows = table.querySelectorAll('tr');
        let csvContent = '';

        rows.forEach(row => {
            const cells = row.querySelectorAll('th, td');
            const rowContent = Array.from(cells).map(cell => `"${cell.innerText}"`).join(',');
            csvContent += rowContent + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${tableId}-export.csv`;
        link.click();
    }

    // Eventos para exportar cada tabla
    document.getElementById('exportTopLeaderBtn').addEventListener('click', () => exportTableToCSV('leader'));
    document.getElementById('exportTopRecruiterBtn').addEventListener('click', () => exportTableToCSV('recruiter'));
    document.getElementById('exportTopSellerBtn').addEventListener('click', () => exportTableToCSV('seller'));
});
