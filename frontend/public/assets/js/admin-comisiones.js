document.addEventListener('DOMContentLoaded', () => {
    const commissionResultsTable = document.getElementById('commissionResultsTable').querySelector('tbody');
    const commissionFilterForm = document.getElementById('commissionFilterForm');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const commissionDetailsModal = new bootstrap.Modal(document.getElementById('commissionDetailsModal'));

    let commissionData = [];

    // Sample Data (Replace with actual API calls or database data)
    commissionData = [
        { id: 'C001', userId: 'U12345', userName: 'Juan Pérez', userRank: 'Rango Plata', type: 'Binario', amount: 500, status: 'Pendiente', date: '2023-09-10' },
        { id: 'C002', userId: 'U67890', userName: 'Ana Gómez', userRank: 'Rango Oro', type: 'Unilevel', amount: 1200, status: 'Pagada', date: '2023-09-09' },
        { id: 'C003', userId: 'U54321', userName: 'Carlos Ruiz', userRank: 'Rango Bronce', type: 'Binario', amount: 300, status: 'Pendiente', date: '2023-09-08' },
    ];

    populateTable(commissionData);

    commissionFilterForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const userSearch = document.getElementById('userSearch').value.toLowerCase();

        const filteredData = commissionData.filter(commission => {
            const commissionDate = new Date(commission.date);
            const filterStartDate = new Date(startDate);
            const filterEndDate = new Date(endDate);

            const dateMatch = (!startDate || commissionDate >= filterStartDate) && (!endDate || commissionDate <= filterEndDate);
            const userMatch = commission.userName.toLowerCase().includes(userSearch) || commission.userId.toLowerCase().includes(userSearch);

            return dateMatch && userMatch;
        });

        populateTable(filteredData);
    });

    clearFiltersBtn.addEventListener('click', () => {
        commissionFilterForm.reset();
        populateTable(commissionData);
    });

    function populateTable(data) {
        commissionResultsTable.innerHTML = ''; // Clear existing rows

        data.forEach((commission, index) => {
            const row = commissionResultsTable.insertRow();
            row.insertCell().textContent = index + 1;
            row.insertCell().textContent = commission.id;
            row.insertCell().textContent = commission.userId;
            row.insertCell().textContent = commission.userName;
            row.insertCell().textContent = commission.userRank;
            row.insertCell().textContent = commission.type;
            row.insertCell().textContent = `$${commission.amount.toFixed(2)}`;
            row.insertCell().innerHTML = `<span class="badge ${commission.status === 'Pendiente' ? 'bg-warning' : 'bg-success'}">${commission.status}</span>`;
            row.insertCell().textContent = commission.date;

            const actionsCell = row.insertCell();
            actionsCell.innerHTML = `
                <button class="btn btn-outline-info btn-sm view-details-btn" data-id="${commission.id}">Ver Detalles</button>
                ${commission.status === 'Pendiente' ? '<button class="btn btn-outline-success btn-sm mark-paid-btn" data-id="' + commission.id + '">Marcar como Pagada</button>' : ''}
            `;

            // Event listeners for buttons
            actionsCell.querySelector('.view-details-btn').addEventListener('click', () => openDetailsModal(commission));
            if (commission.status === 'Pendiente') {
                actionsCell.querySelector('.mark-paid-btn').addEventListener('click', () => markAsPaid(commission.id));
            }
        });
    }

    function openDetailsModal(commission) {
        document.getElementById('commissionIdDetail').textContent = commission.id;
        document.getElementById('commissionUserDetail').textContent = commission.userName;
        document.getElementById('commissionTypeDetail').textContent = commission.type;
        document.getElementById('commissionAmountDetail').textContent = `$${commission.amount.toFixed(2)}`;
        document.getElementById('commissionStatusDetail').textContent = commission.status;
        document.getElementById('commissionDateDetail').textContent = commission.date;

        commissionDetailsModal.show();
    }

    function markAsPaid(commissionId) {
        const commission = commissionData.find(c => c.id === commissionId);
        if (commission) {
            commission.status = 'Pagada';
            populateTable(commissionData);
            alert('La comisión ha sido marcada como pagada.');
        }
    }

    // Export buttons (Implement your own export logic)
    exportCsvBtn.addEventListener('click', () => {
        alert('Exportar CSV en proceso...');
    });

    exportExcelBtn.addEventListener('click', () => {
        alert('Exportar Excel en proceso...');
    });

    exportPdfBtn.addEventListener('click', () => {
        alert('Exportar PDF en proceso...');
    });
});
