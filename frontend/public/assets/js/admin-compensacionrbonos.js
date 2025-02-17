document.addEventListener('DOMContentLoaded', () => {
    const bonusResultsTable = document.getElementById('bonusResultsTable').querySelector('tbody');
    const bonusFilterForm = document.getElementById('bonusFilterForm');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const assignBonusBtn = document.getElementById('assignBonusBtn');
    const bonusDetailsModal = new bootstrap.Modal(document.getElementById('bonusDetailsModal'));
    const bonusIdDetail = document.getElementById('bonusIdDetail');
    const bonusUserDetail = document.getElementById('bonusUserDetail');
    const bonusTypeDetail = document.getElementById('bonusTypeDetail');
    const bonusAmountDetail = document.getElementById('bonusAmountDetail');
    const bonusStatusDetail = document.getElementById('bonusStatusDetail');
    const bonusDateDetail = document.getElementById('bonusDateDetail');
    const bonusNotes = document.getElementById('bonusNotes');

    let bonusesData = [];

    // Sample Data (Replace with actual data fetching)
    bonusesData = [
        { id: 'B001', user: 'Juan Pérez', type: 'Activación Rápida', amount: 500, status: 'Pendiente', date: '2023-09-10' },
        { id: 'B002', user: 'María Sánchez', type: 'Liderazgo', amount: 300, status: 'Completado', date: '2023-09-12' },
        { id: 'B003', user: 'Carlos Gómez', type: 'Especial', amount: 400, status: 'Asignado', date: '2023-09-15' },
    ];

    populateTable(bonusesData);

    bonusFilterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const typeFilter = document.getElementById('bonusTypeFilter').value;
        const userSearch = document.getElementById('userSearch').value.toLowerCase();
        const statusFilter = document.getElementById('bonusStatusFilter').value;

        const filteredData = bonusesData.filter(bonus => {
            const typeMatch = !typeFilter || bonus.type.toLowerCase() === typeFilter.toLowerCase();
            const userMatch = !userSearch || bonus.user.toLowerCase().includes(userSearch);
            const statusMatch = !statusFilter || bonus.status.toLowerCase() === statusFilter.toLowerCase();
            return typeMatch && userMatch && statusMatch;
        });

        populateTable(filteredData);
    });

    clearFiltersBtn.addEventListener('click', () => {
        bonusFilterForm.reset();
        populateTable(bonusesData);
    });

    exportCsvBtn.addEventListener('click', () => exportData('csv'));
    exportExcelBtn.addEventListener('click', () => exportData('excel'));
    exportPdfBtn.addEventListener('click', () => exportData('pdf'));

    function populateTable(data) {
        bonusResultsTable.innerHTML = '';
        data.forEach((bonus, index) => {
            const row = bonusResultsTable.insertRow();
            row.insertCell().textContent = index + 1;
            row.insertCell().textContent = bonus.id;
            row.insertCell().textContent = bonus.user;
            row.insertCell().textContent = bonus.type;
            row.insertCell().textContent = `$${bonus.amount.toFixed(2)}`;
            row.insertCell().innerHTML = `<span class="badge ${getStatusBadgeClass(bonus.status)}">${bonus.status}</span>`;
            row.insertCell().textContent = bonus.date;
            const actionsCell = row.insertCell();

            const viewDetailsBtn = document.createElement('button');
            viewDetailsBtn.className = 'btn btn-outline-info btn-sm';
            viewDetailsBtn.textContent = 'Ver Detalles';
            viewDetailsBtn.addEventListener('click', () => viewBonusDetails(bonus));
            actionsCell.appendChild(viewDetailsBtn);

            const completeBtn = document.createElement('button');
            completeBtn.className = 'btn btn-outline-success btn-sm ms-2';
            completeBtn.textContent = 'Completar';
            completeBtn.addEventListener('click', () => completeBonus(bonus.id));
            actionsCell.appendChild(completeBtn);

            const modifyBtn = document.createElement('button');
            modifyBtn.className = 'btn btn-outline-danger btn-sm ms-2';
            modifyBtn.textContent = 'Modificar';
            actionsCell.appendChild(modifyBtn);
        });
    }

    function getStatusBadgeClass(status) {
        switch (status.toLowerCase()) {
            case 'pendiente': return 'bg-warning';
            case 'asignado': return 'bg-primary';
            case 'completado': return 'bg-success';
            default: return 'bg-secondary';
        }
    }

    function viewBonusDetails(bonus) {
        bonusIdDetail.textContent = bonus.id;
        bonusUserDetail.textContent = bonus.user;
        bonusTypeDetail.textContent = bonus.type;
        bonusAmountDetail.textContent = `$${bonus.amount.toFixed(2)}`;
        bonusStatusDetail.textContent = bonus.status;
        bonusDateDetail.textContent = bonus.date;
        bonusNotes.value = '';
        bonusDetailsModal.show();
    }

    function completeBonus(bonusId) {
        const bonus = bonusesData.find(b => b.id === bonusId);
        if (bonus) {
            bonus.status = 'Completado';
            populateTable(bonusesData);
        }
    }

    function exportData(format) {
        console.log(`Exporting data to ${format.toUpperCase()}...`);
        // Implement export functionality as needed
    }

    assignBonusBtn.addEventListener('click', () => {
        console.log('Asignar Bono Manualmente');
        // Implement manual bonus assignment
    });
});
