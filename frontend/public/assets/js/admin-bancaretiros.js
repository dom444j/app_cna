document.addEventListener('DOMContentLoaded', () => {
    const withdrawalResultsTable = document.getElementById('withdrawalResultsTable').querySelector('tbody');
    const withdrawalFilterForm = document.getElementById('withdrawalFilterForm');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const withdrawalDetailsModal = new bootstrap.Modal(document.getElementById('withdrawalDetailsModal'));
    const withdrawalIdDetail = document.getElementById('withdrawalIdDetail');
    const withdrawalUserDetail = document.getElementById('withdrawalUserDetail');
    const withdrawalTypeDetail = document.getElementById('withdrawalTypeDetail');
    const withdrawalAmountDetail = document.getElementById('withdrawalAmountDetail');
    const withdrawalStatusDetail = document.getElementById('withdrawalStatusDetail');
    const withdrawalDateDetail = document.getElementById('withdrawalDateDetail');
    const withdrawalNotes = document.getElementById('withdrawalNotes');

    let withdrawalsData = [
        { id: 'R001', user: 'Juan Pérez', type: 'Banco', amount: 1200, status: 'Pendiente', date: '2023-09-10' },
        { id: 'R002', user: 'Ana Gómez', type: 'Cripto', amount: 600, status: 'Completado', date: '2023-09-12' },
        { id: 'R003', user: 'Luis Torres', type: 'Wallet', amount: 450, status: 'Rechazado', date: '2023-09-13' },
    ];

    populateTable(withdrawalsData);
    updateSummaryCounts();

    withdrawalFilterForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const userSearch = document.getElementById('userSearch').value.toLowerCase();

        const filteredData = withdrawalsData.filter(withdrawal => {
            const withdrawalDate = new Date(withdrawal.date);
            const filterStartDate = new Date(startDate);
            const filterEndDate = new Date(endDate);

            const dateMatch = (!startDate || withdrawalDate >= filterStartDate) && (!endDate || withdrawalDate <= filterEndDate);
            const userMatch = withdrawal.user.toLowerCase().includes(userSearch);

            return dateMatch && userMatch;
        });

        populateTable(filteredData);
    });

    clearFiltersBtn.addEventListener('click', () => {
        withdrawalFilterForm.reset();
        populateTable(withdrawalsData);
    });

    function populateTable(data) {
        withdrawalResultsTable.innerHTML = '';

        data.forEach((withdrawal, index) => {
            const row = withdrawalResultsTable.insertRow();
            row.insertCell().textContent = index + 1;
            row.insertCell().textContent = withdrawal.id;
            row.insertCell().textContent = withdrawal.user;
            row.insertCell().textContent = withdrawal.type;
            row.insertCell().textContent = `$${withdrawal.amount.toFixed(2)}`;
            row.insertCell().innerHTML = `<span class="badge ${getStatusClass(withdrawal.status)}">${withdrawal.status}</span>`;
            row.insertCell().textContent = withdrawal.date;

            const actionsCell = row.insertCell();
            actionsCell.innerHTML = `
                <button class="btn btn-outline-info btn-sm">Ver Detalles</button>
                <button class="btn btn-outline-success btn-sm">Aprobar</button>
                <button class="btn btn-outline-danger btn-sm">Rechazar</button>
            `;

            actionsCell.querySelector('.btn-outline-info').addEventListener('click', () => showDetails(withdrawal));
        });
    }

    function showDetails(withdrawal) {
        withdrawalIdDetail.textContent = withdrawal.id;
        withdrawalUserDetail.textContent = withdrawal.user;
        withdrawalTypeDetail.textContent = withdrawal.type;
        withdrawalAmountDetail.textContent = `$${withdrawal.amount.toFixed(2)}`;
        withdrawalStatusDetail.textContent = withdrawal.status;
        withdrawalDateDetail.textContent = withdrawal.date;
        withdrawalNotes.value = '';

        withdrawalDetailsModal.show();
    }

    function getStatusClass(status) {
        switch (status) {
            case 'Pendiente':
                return 'bg-warning';
            case 'Completado':
                return 'bg-success';
            case 'Rechazado':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    }

    function updateSummaryCounts() {
        const pendingCount = withdrawalsData.filter(w => w.status === 'Pendiente').length;
        const completedCount = withdrawalsData.filter(w => w.status === 'Completado').length;
        const totalAmount = withdrawalsData.reduce((sum, w) => sum + w.amount, 0);

        document.getElementById('pendingWithdrawalsCount').textContent = pendingCount;
        document.getElementById('completedWithdrawalsCount').textContent = completedCount;
        document.getElementById('totalWithdrawalAmount').textContent = `$${totalAmount.toFixed(2)}`;
    }

    // Placeholder export functions
    exportCsvBtn.addEventListener('click', () => alert('Exportar a CSV no implementado.'));
    exportExcelBtn.addEventListener('click', () => alert('Exportar a Excel no implementado.'));
    exportPdfBtn.addEventListener('click', () => alert('Exportar a PDF no implementado.'));
});
