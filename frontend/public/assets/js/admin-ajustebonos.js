document.addEventListener('DOMContentLoaded', () => {
    // Tablas de bonos
    const fastActivationTable = document.getElementById('fastActivationTable').querySelector('tbody');
    const leadershipBonusTable = document.getElementById('leadershipBonusTable').querySelector('tbody');
    const globalBonusTable = document.getElementById('globalBonusTable').querySelector('tbody');

    // Formularios
    const fastActivationForm = document.getElementById('fastActivationForm');
    const leadershipBonusForm = document.getElementById('leadershipBonusForm');
    const globalBonusForm = document.getElementById('globalBonusForm');

    // Datos de prueba (pueden ser reemplazados con datos de una API)
    let fastActivationBonuses = [
        { id: "BA001", percentage: 20, duration: 30, status: "Activo" }
    ];
    
    let leadershipBonuses = [
        { id: "BL002", rank: "Rango 3", percentage: 5, status: "Activo" }
    ];
    
    let globalBonuses = [
        { id: "BG003", percentage: 2, status: "Pendiente" }
    ];

    // Función para actualizar la tabla de bonos de activación rápida
    function updateFastActivationTable() {
        fastActivationTable.innerHTML = "";
        fastActivationBonuses.forEach((bonus, index) => {
            const row = fastActivationTable.insertRow();
            row.innerHTML = `
                <td>${bonus.id}</td>
                <td>${bonus.percentage}%</td>
                <td>${bonus.duration} días</td>
                <td><span class="badge ${bonus.status === 'Activo' ? 'bg-success' : 'bg-warning'}">${bonus.status}</span></td>
                <td>
                    <button class="btn btn-outline-warning btn-sm edit-bonus" data-index="${index}" data-type="fast">Modificar</button>
                    <button class="btn btn-outline-danger btn-sm delete-bonus" data-index="${index}" data-type="fast">Eliminar</button>
                </td>
            `;
        });
    }

    // Función para actualizar la tabla de bonos de liderazgo
    function updateLeadershipBonusTable() {
        leadershipBonusTable.innerHTML = "";
        leadershipBonuses.forEach((bonus, index) => {
            const row = leadershipBonusTable.insertRow();
            row.innerHTML = `
                <td>${bonus.id}</td>
                <td>${bonus.rank}</td>
                <td>${bonus.percentage}%</td>
                <td><span class="badge ${bonus.status === 'Activo' ? 'bg-success' : 'bg-warning'}">${bonus.status}</span></td>
                <td>
                    <button class="btn btn-outline-warning btn-sm edit-bonus" data-index="${index}" data-type="leadership">Modificar</button>
                    <button class="btn btn-outline-danger btn-sm delete-bonus" data-index="${index}" data-type="leadership">Eliminar</button>
                </td>
            `;
        });
    }

    // Función para actualizar la tabla de bonos globales
    function updateGlobalBonusTable() {
        globalBonusTable.innerHTML = "";
        globalBonuses.forEach((bonus, index) => {
            const row = globalBonusTable.insertRow();
            row.innerHTML = `
                <td>${bonus.id}</td>
                <td>${bonus.percentage}%</td>
                <td><span class="badge ${bonus.status === 'Activo' ? 'bg-success' : 'bg-warning'}">${bonus.status}</span></td>
                <td>
                    <button class="btn btn-outline-warning btn-sm edit-bonus" data-index="${index}" data-type="global">Modificar</button>
                    <button class="btn btn-outline-danger btn-sm delete-bonus" data-index="${index}" data-type="global">Eliminar</button>
                </td>
            `;
        });
    }

    // Agregar nuevo bono de activación rápida
    fastActivationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const percentage = document.getElementById('fastActivationPercentage').value;
        const duration = document.getElementById('fastActivationDuration').value;

        if (percentage && duration) {
            fastActivationBonuses.push({
                id: `BA00${fastActivationBonuses.length + 1}`,
                percentage: parseInt(percentage),
                duration: parseInt(duration),
                status: "Activo"
            });
            updateFastActivationTable();
            fastActivationForm.reset();
        }
    });

    // Agregar nuevo bono de liderazgo
    leadershipBonusForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const rank = document.getElementById('leadershipBonusRank').value;
        const percentage = document.getElementById('leadershipBonusPercentage').value;

        if (rank && percentage) {
            leadershipBonuses.push({
                id: `BL00${leadershipBonuses.length + 1}`,
                rank,
                percentage: parseInt(percentage),
                status: "Activo"
            });
            updateLeadershipBonusTable();
            leadershipBonusForm.reset();
        }
    });

    // Agregar nuevo bono global
    globalBonusForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const percentage = document.getElementById('globalBonusPercentage').value;

        if (percentage) {
            globalBonuses.push({
                id: `BG00${globalBonuses.length + 1}`,
                percentage: parseInt(percentage),
                status: "Pendiente"
            });
            updateGlobalBonusTable();
            globalBonusForm.reset();
        }
    });

    // Evento de eliminación y edición de bonos
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-bonus')) {
            const index = event.target.getAttribute('data-index');
            const type = event.target.getAttribute('data-type');

            if (confirm("¿Seguro que quieres eliminar este bono?")) {
                if (type === "fast") {
                    fastActivationBonuses.splice(index, 1);
                    updateFastActivationTable();
                } else if (type === "leadership") {
                    leadershipBonuses.splice(index, 1);
                    updateLeadershipBonusTable();
                } else if (type === "global") {
                    globalBonuses.splice(index, 1);
                    updateGlobalBonusTable();
                }
            }
        }

        if (event.target.classList.contains('edit-bonus')) {
            const index = event.target.getAttribute('data-index');
            const type = event.target.getAttribute('data-type');
            let newPercentage = prompt("Ingrese el nuevo porcentaje:");

            if (newPercentage !== null && !isNaN(newPercentage)) {
                if (type === "fast") {
                    fastActivationBonuses[index].percentage = parseInt(newPercentage);
                    updateFastActivationTable();
                } else if (type === "leadership") {
                    leadershipBonuses[index].percentage = parseInt(newPercentage);
                    updateLeadershipBonusTable();
                } else if (type === "global") {
                    globalBonuses[index].percentage = parseInt(newPercentage);
                    updateGlobalBonusTable();
                }
            }
        }
    });

    // Inicializar las tablas con datos
    updateFastActivationTable();
    updateLeadershipBonusTable();
    updateGlobalBonusTable();
});
