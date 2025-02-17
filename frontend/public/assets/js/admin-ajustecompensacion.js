document.addEventListener('DOMContentLoaded', () => {
    // TABLAS Y FORMULARIOS
    const unilevelLevelsTable = document.querySelector("#unilevelLevelsTable tbody");
    const unilevelBonusTable = document.querySelector("#unilevelBonusTable tbody");
    const binaryRanksTable = document.querySelector("#binaryRanksTable tbody");
    const binaryUnpaidAmountsTable = document.querySelector("#binaryUnpaidAmountsTable tbody");
    const binaryGlobalBonusTable = document.querySelector("#binaryGlobalBonusTable tbody");

    // BOTONES MODALES
    const addUnilevelLevelBtn = document.getElementById("addUnilevelLevelBtn");
    const saveNewLevelBtn = document.getElementById("saveNewLevelBtn");
    const addBinaryRankBtn = document.getElementById("addBinaryRankBtn");
    const saveNewBinaryRankBtn = document.getElementById("saveNewBinaryRankBtn");

    // FORMULARIOS MODALES
    const newLevelNumber = document.getElementById("newLevelNumber");
    const newLevelPercentage = document.getElementById("newLevelPercentage");
    const newBinaryRank = document.getElementById("newBinaryRank");
    const newBinaryPercentage = document.getElementById("newBinaryPercentage");
    const newBinaryMaxPairs = document.getElementById("newBinaryMaxPairs");

    // DATOS PREDEFINIDOS (pueden venir de API en el futuro)
    let unilevelLevels = [
        { nivel: 1, porcentaje: "20%" },
        { nivel: 2, porcentaje: "4%" },
    ];
    
    let binaryRanks = [
        { rango: "Rango 1", porcentaje: "15%", paresMax: 500 },
        { rango: "Rango 7", porcentaje: "20%", paresMax: 1026 },
    ];

    // === FUNCIONES PARA ACTUALIZAR TABLAS ===
    function updateUnilevelLevelsTable() {
        unilevelLevelsTable.innerHTML = "";
        unilevelLevels.forEach((nivel, index) => {
            let row = `
                <tr>
                    <td>Nivel ${nivel.nivel}</td>
                    <td>${nivel.porcentaje}</td>
                    <td>
                        <button class="btn btn-outline-warning btn-sm edit-level-btn" data-index="${index}">Modificar</button>
                        <button class="btn btn-outline-danger btn-sm delete-level-btn" data-index="${index}">Eliminar</button>
                    </td>
                </tr>`;
            unilevelLevelsTable.insertAdjacentHTML("beforeend", row);
        });
    }

    function updateBinaryRanksTable() {
        binaryRanksTable.innerHTML = "";
        binaryRanks.forEach((rango, index) => {
            let row = `
                <tr>
                    <td>${rango.rango}</td>
                    <td>${rango.porcentaje}</td>
                    <td>${rango.paresMax}</td>
                    <td>
                        <button class="btn btn-outline-warning btn-sm edit-rank-btn" data-index="${index}">Modificar</button>
                        <button class="btn btn-outline-danger btn-sm delete-rank-btn" data-index="${index}">Eliminar</button>
                    </td>
                </tr>`;
            binaryRanksTable.insertAdjacentHTML("beforeend", row);
        });
    }

    // === EVENTOS PARA AGREGAR NUEVOS DATOS ===
    saveNewLevelBtn.addEventListener("click", () => {
        if (newLevelNumber.value && newLevelPercentage.value) {
            unilevelLevels.push({
                nivel: newLevelNumber.value,
                porcentaje: newLevelPercentage.value + "%",
            });
            updateUnilevelLevelsTable();
            newLevelNumber.value = "";
            newLevelPercentage.value = "";
        }
    });

    saveNewBinaryRankBtn.addEventListener("click", () => {
        if (newBinaryRank.value && newBinaryPercentage.value && newBinaryMaxPairs.value) {
            binaryRanks.push({
                rango: newBinaryRank.value,
                porcentaje: newBinaryPercentage.value + "%",
                paresMax: newBinaryMaxPairs.value,
            });
            updateBinaryRanksTable();
            newBinaryRank.value = "";
            newBinaryPercentage.value = "";
            newBinaryMaxPairs.value = "";
        }
    });

    // === EVENTOS PARA ELIMINAR NIVELES O RANGOS ===
    unilevelLevelsTable.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-level-btn")) {
            let index = event.target.getAttribute("data-index");
            unilevelLevels.splice(index, 1);
            updateUnilevelLevelsTable();
        }
    });

    binaryRanksTable.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-rank-btn")) {
            let index = event.target.getAttribute("data-index");
            binaryRanks.splice(index, 1);
            updateBinaryRanksTable();
        }
    });

    // === EVENTO PARA EDITAR (Por ahora solo abre una alerta de prueba) ===
    unilevelLevelsTable.addEventListener("click", (event) => {
        if (event.target.classList.contains("edit-level-btn")) {
            let index = event.target.getAttribute("data-index");
            alert(`Editar nivel ${unilevelLevels[index].nivel}`);
        }
    });

    binaryRanksTable.addEventListener("click", (event) => {
        if (event.target.classList.contains("edit-rank-btn")) {
            let index = event.target.getAttribute("data-index");
            alert(`Editar rango ${binaryRanks[index].rango}`);
        }
    });

    // === EVENTO PARA VER DETALLES DE MONTO NO PAGADO ===
    binaryUnpaidAmountsTable.addEventListener("click", (event) => {
        if (event.target.classList.contains("view-unpaid-details-btn")) {
            let row = event.target.closest("tr");
            document.getElementById("unpaidUserIdDetail").textContent = row.cells[0].textContent;
            document.getElementById("unpaidUserNameDetail").textContent = row.cells[1].textContent;
            document.getElementById("unpaidAmountDetail").textContent = row.cells[2].textContent;
            document.getElementById("unpaidDateDetail").textContent = row.cells[3].textContent;
            document.getElementById("unpaidReasonDetail").textContent = "No alcanzó el rango requerido";
            new bootstrap.Modal(document.getElementById("unpaidDetailsModal")).show();
        }
    });

    // === INICIALIZAR TABLAS ===
    updateUnilevelLevelsTable();
    updateBinaryRanksTable();
});
