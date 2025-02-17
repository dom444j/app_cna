document.addEventListener('DOMContentLoaded', () => {
    const transactionResultsTable = document.getElementById('transactionResultsTable').querySelector('tbody');
    const transactionFilterForm = document.getElementById('transactionFilterForm');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const transactionDetailsModal = new bootstrap.Modal(document.getElementById('transactionDetailsModal'));
    
    const transactionDetailsFields = {
        transactionIdDetail: document.getElementById('transactionIdDetail'),
        transactionDateDetail: document.getElementById('transactionDateDetail'),
        transactionTypeDetail: document.getElementById('transactionTypeDetail'),
        transactionSenderDetail: document.getElementById('transactionSenderDetail'),
        transactionReceiverDetail: document.getElementById('transactionReceiverDetail'),
        transactionAmountDetail: document.getElementById('transactionAmountDetail'),
        transactionStatusDetail: document.getElementById('transactionStatusDetail'),
        transactionDescriptionDetail: document.getElementById('transactionDescriptionDetail')
    };

    let transactionsData = [];

    // Sample data (replace with actual data fetching)
    transactionsData = [
        { id: 'T001', date: '2023-09-10', type: 'Transferencia', sender: 'Juan Pérez', receiver: 'Maria Gomez', amount: 1200, status: 'Completado', description: 'Transferencia de saldo' },
        { id: 'T002', date: '2023-09-12', type: 'Compra', sender: 'Pedro Suarez', receiver: 'Sistema', amount: 500, status: 'Completado', description: 'Compra en tienda virtual' },
        { id: 'T003', date: '2023-09-15', type: 'Retiro', sender: 'Ana Martinez', receiver: 'Banco XYZ', amount: 300, status: 'Pendiente', description: 'Solicitud de retiro' },
        { id: 'T004', date: '2023-09-18', type: 'Ajuste', sender: 'Admin', receiver: 'Carlos Lopez', amount: 200, status: 'Completado', description: 'Ajuste manual por error de saldo' },
    ];

    populateTable(transactionsData);

    transactionFilterForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const userSearch = document.getElementById('userSearch').value.toLowerCase();
        const transactionType = document.getElementById('transactionType').value;

        const filteredData = transactionsData.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const filterStartDate = new Date(startDate);
            const filterEndDate = new Date(endDate);

            const dateMatch = (!startDate || transactionDate >= filterStartDate) && (!endDate || transactionDate <= filterEndDate);
            const userMatch = transaction.sender.toLowerCase().includes(userSearch) || transaction.receiver.toLowerCase().includes(userSearch);
            const typeMatch = transactionType === "" || transaction.type === transactionType;

            return dateMatch && userMatch && typeMatch;
        });

        populateTable(filteredData);
    });

    clearFiltersBtn.addEventListener('click', () => {
        transactionFilterForm.reset();
        populateTable(transactionsData);
    });

    function populateTable(data) {
        transactionResultsTable.innerHTML = "";

        data.forEach((transaction, index) => {
            const row = transactionResultsTable.insertRow();
            row.insertCell().textContent = index + 1;
            row.insertCell().textContent = transaction.id;
            row.insertCell().textContent = transaction.date;
            row.insertCell().textContent = transaction.type;
            row.insertCell().textContent = transaction.sender;
            row.insertCell().textContent = transaction.receiver;
            row.insertCell().textContent = `$${transaction.amount.toFixed(2)}`;
            row.insertCell().innerHTML = `<span class="badge ${transaction.status === 'Completado' ? 'bg-success' : 'bg-warning'}">${transaction.status}</span>`;

            const actionCell = row.insertCell();
            const detailsButton = document.createElement('button');
            detailsButton.className = 'btn btn-outline-info btn-sm';
            detailsButton.textContent = 'Ver Detalles';
            detailsButton.addEventListener('click', () => showTransactionDetails(transaction));
            actionCell.appendChild(detailsButton);
        });
    }

    function showTransactionDetails(transaction) {
        transactionDetailsFields.transactionIdDetail.textContent = transaction.id;
        transactionDetailsFields.transactionDateDetail.textContent = transaction.date;
        transactionDetailsFields.transactionTypeDetail.textContent = transaction.type;
        transactionDetailsFields.transactionSenderDetail.textContent = transaction.sender;
        transactionDetailsFields.transactionReceiverDetail.textContent = transaction.receiver;
        transactionDetailsFields.transactionAmountDetail.textContent = `$${transaction.amount.toFixed(2)}`;
        transactionDetailsFields.transactionStatusDetail.textContent = transaction.status;
        transactionDetailsFields.transactionDescriptionDetail.textContent = transaction.description;

        transactionDetailsModal.show();
    }

    // Export buttons functionality (dummy implementation)
    exportCsvBtn.addEventListener('click', () => {
        alert('Exportar a CSV no está implementado aún.');
    });

    exportExcelBtn.addEventListener('click', () => {
        alert('Exportar a Excel no está implementado aún.');
    });

    exportPdfBtn.addEventListener('click', () => {
        alert('Exportar a PDF no está implementado aún.');
    });
});
