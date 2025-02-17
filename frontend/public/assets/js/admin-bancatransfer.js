document.addEventListener('DOMContentLoaded', () => {
    const transferResultsTable = document.getElementById('transferResultsTable').querySelector('tbody');
    const transferFilterForm = document.getElementById('transferFilterForm');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const addTransferForm = document.getElementById('addTransferForm');
    const saveTransferBtn = document.getElementById('saveTransferBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');

    let transfersData = [];

    // Simulated data (replace with actual data fetching)
    transfersData = [
        { id: 'T001', date: '2023-09-05', sender: 'Juan Pérez', recipient: 'Maria Sanchez', amount: 2000, status: 'completed', description: 'Pago de servicios' },
        { id: 'T002', date: '2023-09-06', sender: 'Carlos Gómez', recipient: 'Ana Rodríguez', amount: 1500, status: 'pending', description: 'Transferencia pendiente' },
        { id: 'T003', date: '2023-09-07', sender: 'Luis Torres', recipient: 'Sofia López', amount: 2500, status: 'failed', description: 'Error en transferencia' },
    ];

    populateTable(transfersData);

    transferFilterForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const userSenderSearch = document.getElementById('userSenderSearch').value.toLowerCase();
        const userRecipientSearch = document.getElementById('userRecipientSearch').value.toLowerCase();
        const transferStatus = document.getElementById('transferStatus').value;

        const filteredData = transfersData.filter(transfer => {
            const transferDate = new Date(transfer.date);
            const filterStartDate = new Date(startDate);
            const filterEndDate = new Date(endDate);

            const dateMatch = (!startDate || transferDate >= filterStartDate) && (!endDate || transferDate <= filterEndDate);
            const senderMatch = transfer.sender.toLowerCase().includes(userSenderSearch);
            const recipientMatch = transfer.recipient.toLowerCase().includes(userRecipientSearch);
            const statusMatch = transferStatus === "" || transfer.status === transferStatus;

            return dateMatch && senderMatch && recipientMatch && statusMatch;
        });

        populateTable(filteredData);
    });

    clearFiltersBtn.addEventListener('click', () => {
        transferFilterForm.reset();
        populateTable(transfersData);
    });

    addTransferForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const newTransfer = {
            id: `T${String(Date.now()).slice(-6)}`,
            date: new Date().toISOString().split('T')[0],
            sender: document.getElementById('senderUserId').value,
            recipient: document.getElementById('recipientUserId').value,
            amount: parseFloat(document.getElementById('transferAmount').value),
            status: 'pending',
            description: document.getElementById('transferDescription').value,
        };

        transfersData.push(newTransfer);
        populateTable(transfersData);

        const addTransferModal = bootstrap.Modal.getInstance(document.getElementById('addTransferModal'));
        addTransferModal.hide();
        addTransferForm.reset();
    });

    function populateTable(data) {
        transferResultsTable.innerHTML = "";

        data.forEach((transfer, index) => {
            const row = transferResultsTable.insertRow();
            row.insertCell().textContent = index + 1;
            row.insertCell().textContent = transfer.id;
            row.insertCell().textContent = transfer.date;
            row.insertCell().textContent = transfer.sender;
            row.insertCell().textContent = transfer.recipient;
            row.insertCell().textContent = `$${transfer.amount.toFixed(2)}`;
            row.insertCell().innerHTML = `<span class="badge bg-${getStatusColor(transfer.status)}">${capitalize(transfer.status)}</span>`;
            row.insertCell().textContent = transfer.description;
            const actionsCell = row.insertCell();

            const detailsBtn = document.createElement('button');
            detailsBtn.className = 'btn btn-outline-info btn-sm me-2';
            detailsBtn.textContent = 'Ver Detalles';
            detailsBtn.addEventListener('click', () => {
                alert(`Detalles de la transferencia: ${transfer.description}`);
            });

            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'btn btn-outline-danger btn-sm';
            cancelBtn.textContent = 'Anular';
            cancelBtn.addEventListener('click', () => {
                if (confirm(`¿Desea anular la transferencia ${transfer.id}?`)) {
                    transfer.status = 'failed';
                    populateTable(transfersData);
                }
            });

            actionsCell.append(detailsBtn, cancelBtn);
        });
    }

    function getStatusColor(status) {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'failed': return 'danger';
            default: return 'secondary';
        }
    }

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Export functionality placeholders (implement as needed)
    exportCsvBtn.addEventListener('click', () => {
        alert('Exportar CSV no implementado aún.');
    });

    exportExcelBtn.addEventListener('click', () => {
        alert('Exportar Excel no implementado aún.');
    });

    exportPdfBtn.addEventListener('click', () => {
        alert('Exportar PDF no implementado aún.');
    });
});
