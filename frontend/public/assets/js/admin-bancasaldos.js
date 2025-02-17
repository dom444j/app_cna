document.addEventListener('DOMContentLoaded', () => {
    const balanceResultsTable = document.getElementById('balanceResultsTable').querySelector('tbody');
    const balanceFilterForm = document.getElementById('balanceFilterForm');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const addBalanceForm = document.getElementById('addBalanceForm');
    const transferForm = document.getElementById('transferForm');
    const saveBalanceBtn = document.getElementById('saveBalanceBtn');
    const addBalanceModal = new bootstrap.Modal('#addBalanceModal');
    const transferModal = new bootstrap.Modal('#transferModal');

    // Elementos del resumen
    const totalBalanceDisplay = document.querySelector('.row .card:nth-child(1) h4');
    const availableBalanceDisplay = document.querySelector('.row .card:nth-child(2) h4');
    const lockedBalanceDisplay = document.querySelector('.row .card:nth-child(3) h4');

    let balanceData = [];

    // Datos de ejemplo (reemplazar con datos reales)
    balanceData = [
        { id: 'U001', name: 'Juan Pérez', available: 2500, locked: 300 },
        { id: 'U002', name: 'Maria Sanchez', available: 3200, locked: 0 },
        { id: 'U003', name: 'Carlos Gómez', available: 1000, locked: 500 },
        { id: 'U004', name: 'Ana Rodríguez', available: 4500, locked: 200 },
    ];

    updateSummary(balanceData);
    populateTable(balanceData);

    balanceFilterForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const searchTerm = document.getElementById('userSearch').value.toLowerCase();

        const filteredData = balanceData.filter(balance => {
            const userMatch = balance.name.toLowerCase().includes(searchTerm) || balance.id.toLowerCase().includes(searchTerm);
            // Fecha filtrada (para datos futuros)
            return userMatch;
        });

        populateTable(filteredData);
    });

    clearFiltersBtn.addEventListener('click', () => {
        balanceFilterForm.reset();
        populateTable(balanceData);
    });

    saveBalanceBtn.addEventListener('click', () => {
        const userId = document.getElementById('balanceUserId').value;
        const amount = parseFloat(document.getElementById('balanceAmount').value);
        const description = document.getElementById('balanceDescription').value;

        if (userId && amount > 0 && description) {
            const user = balanceData.find(u => u.id === userId);
            if (user) {
                user.available += amount;
                updateSummary(balanceData);
                populateTable(balanceData);
            } else {
                alert('Usuario no encontrado.');
            }

            addBalanceModal.hide();
            addBalanceForm.reset();
        }
    });

    transferForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const recipientId = document.getElementById('transferRecipient').value;
        const transferAmount = parseFloat(document.getElementById('transferAmount').value);
        const transferDescription = document.getElementById('transferDescription').value;

        if (recipientId && transferAmount > 0) {
            const user = balanceData.find(u => u.id === recipientId);
            if (user) {
                user.available += transferAmount;
                updateSummary(balanceData);
                populateTable(balanceData);
                alert('Transferencia realizada con éxito.');
                transferModal.hide();
                transferForm.reset();
            } else {
                alert('Usuario destinatario no encontrado.');
            }
        }
    });

    function populateTable(data) {
        balanceResultsTable.innerHTML = ''; // Limpiar filas existentes

        data.forEach((balance, index) => {
            const row = balanceResultsTable.insertRow();
            row.insertCell().textContent = index + 1;
            row.insertCell().textContent = balance.id;
            row.insertCell().textContent = balance.name;
            row.insertCell().textContent = `$${balance.available.toFixed(2)}`;
            row.insertCell().textContent = `$${balance.locked.toFixed(2)}`;
            row.insertCell().textContent = `$${(balance.available + balance.locked).toFixed(2)}`;

            const actionsCell = row.insertCell();
            const detailsButton = document.createElement('button');
            detailsButton.className = 'btn btn-outline-info btn-sm';
            detailsButton.textContent = 'Ver Detalles';
            actionsCell.appendChild(detailsButton);

            const transferButton = document.createElement('button');
            transferButton.className = 'btn btn-outline-success btn-sm ms-2';
            transferButton.textContent = 'Transferir';
            transferButton.addEventListener('click', () => {
                openTransferModal(balance.id);
            });
            actionsCell.appendChild(transferButton);
        });
    }

    function updateSummary(data) {
        const totalBalance = data.reduce((sum, item) => sum + item.available + item.locked, 0);
        const availableBalance = data.reduce((sum, item) => sum + item.available, 0);
        const lockedBalance = data.reduce((sum, item) => sum + item.locked, 0);

        totalBalanceDisplay.textContent = `$${totalBalance.toFixed(2)}`;
        availableBalanceDisplay.textContent = `$${availableBalance.toFixed(2)}`;
        lockedBalanceDisplay.textContent = `$${lockedBalance.toFixed(2)}`;
    }

    function openTransferModal(userId) {
        document.getElementById('transferRecipient').value = userId;
        transferModal.show();
    }
});
