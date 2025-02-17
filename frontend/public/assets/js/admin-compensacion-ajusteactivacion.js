document.addEventListener('DOMContentLoaded', () => {
    const activationResultsTable = document.getElementById('activationResultsTable').querySelector('tbody');
    const activationFilterForm = document.getElementById('activationFilterForm');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const adjustActivationSettingsBtn = document.getElementById('adjustActivationSettingsBtn');
    const saveConfigBtn = document.getElementById('saveConfigBtn');
    const configModal = new bootstrap.Modal(document.getElementById('configModal'));
    const activationDetailsModal = new bootstrap.Modal(document.getElementById('activationDetailsModal'));

    let activationData = [];

    // Datos de ejemplo (Se reemplazarán con la conexión a BD o API)
    activationData = [
        { id: 'A001', userCode: 'U001', name: 'Juan Pérez', status: 'activo', pointsUsed: 50, activationDate: '2024-02-01', expirationDate: '2024-03-01' },
        { id: 'A002', userCode: 'U002', name: 'Ana Rodríguez', status: 'inactivo', pointsUsed: 30, activationDate: '2024-01-15', expirationDate: '2024-02-15' },
        { id: 'A003', userCode: 'U003', name: 'Carlos Gómez', status: 'en_riesgo', pointsUsed: 45, activationDate: '2024-02-10', expirationDate: '2024-03-10' },
    ];

    populateTable(activationData);

    activationFilterForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const userSearch = document.getElementById('userSearch').value.toLowerCase();
        const statusFilter = document.getElementById('activationStatusFilter').value;
        const periodFilter = document.getElementById('activationPeriodFilter').value;

        const filteredData = activationData.filter(user => {
            const matchUser = user.name.toLowerCase().includes(userSearch) || user.userCode.toLowerCase().includes(userSearch);
            const matchStatus = statusFilter === "" || user.status === statusFilter;
            const matchPeriod = periodFilter === "" || user.activationDate.startsWith(periodFilter);

            return matchUser && matchStatus && matchPeriod;
        });

        populateTable(filteredData);
    });

    clearFiltersBtn.addEventListener('click', () => {
        activationFilterForm.reset();
        populateTable(activationData);
    });

    function populateTable(data) {
        activationResultsTable.innerHTML = "";

        data.forEach((activation, index) => {
            const row = activationResultsTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${activation.userCode}</td>
                <td>${activation.name}</td>
                <td><span class="badge ${getStatusBadge(activation.status)}">${activation.status}</span></td>
                <td>${activation.pointsUsed}</td>
                <td>${activation.activationDate}</td>
                <td>${activation.expirationDate}</td>
                <td>
                    <button class="btn btn-outline-info btn-sm view-details" data-id="${activation.id}">Ver Detalles</button>
                    <button class="btn btn-outline-warning btn-sm extend-activation" data-id="${activation.id}">Extender</button>
                    <button class="btn btn-outline-danger btn-sm deactivate-user" data-id="${activation.id}">Desactivar</button>
                </td>
            `;

            row.querySelector('.view-details').addEventListener('click', () => openDetailsModal(activation));
            row.querySelector('.extend-activation').addEventListener('click', () => extendActivation(activation.id));
            row.querySelector('.deactivate-user').addEventListener('click', () => deactivateUser(activation.id));
        });
    }

    function getStatusBadge(status) {
        switch (status) {
            case 'activo': return 'bg-success';
            case 'inactivo': return 'bg-warning';
            case 'en_riesgo': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    function openDetailsModal(activation) {
        document.getElementById('activationIdDetail').textContent = activation.id;
        document.getElementById('activationUserDetail').textContent = activation.name;
        document.getElementById('activationTypeDetail').textContent = 'Estándar'; // Puede ajustarse dinámicamente
        document.getElementById('activationPlanDetail').textContent = activation.userCode.startsWith('U') ? 'Unilevel' : 'Binario';
        document.getElementById('activationStatusDetail').textContent = activation.status;
        document.getElementById('activationLastPaymentDetail').textContent = activation.activationDate;
        document.getElementById('activationExpirationDetail').textContent = activation.expirationDate;

        activationDetailsModal.show();
    }

    function extendActivation(activationId) {
        alert(`Extender activación para el usuario con ID: ${activationId}`);
    }

    function deactivateUser(activationId) {
        alert(`Desactivar usuario con ID: ${activationId}`);
    }

    adjustActivationSettingsBtn.addEventListener('click', () => {
        configModal.show();
    });

    saveConfigBtn.addEventListener('click', () => {
        const planType = document.getElementById('planType').value;
        const activationPoints = document.getElementById('activationPoints').value;
        const revalidationPoints = document.getElementById('revalidationPoints').value;
        const activationPeriod = document.getElementById('activationPeriod').value;
        const bonusPercentage = document.getElementById('bonusPercentage').value;
        const activationStatus = document.getElementById('activationStatus').value;

        console.log('Configuración Guardada:', {
            planType,
            activationPoints,
            revalidationPoints,
            activationPeriod,
            bonusPercentage,
            activationStatus,
        });

        alert('Configuración guardada exitosamente');
        configModal.hide();
    });
});
