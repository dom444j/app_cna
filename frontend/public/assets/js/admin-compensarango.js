document.addEventListener('DOMContentLoaded', () => {
    const addRankBtn = document.getElementById('addRankBtn');
    const rankFilterForm = document.getElementById('rankFilterForm');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const rankResultsTable = document.getElementById('rankResultsTable').querySelector('tbody');
    const addRankModal = new bootstrap.Modal(document.getElementById('addRankModal')); // Initialize Bootstrap Modal
    const addRankForm = document.getElementById('addRankForm');
    const totalRanksCount = document.getElementById('totalRanksCount');
    const usersPerRankCount = document.getElementById('usersPerRankCount');
    const highestRankName = document.getElementById('highestRankName');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');


    let ranksData = []; // Array to store rank data (replace with actual data fetching)

    // Sample rank data (replace with actual data from backend)
    ranksData = [
        { id: 1, name: 'Director Nacional', type: 'binario', users: 12, requiredPoints: 20000, currentPoints: 18500, revalidationDate: '2023-09-15' },
        { id: 2, name: 'Gerente Regional', type: 'unilevel', users: 8, requiredPoints: 10000, currentPoints: 9500, revalidationDate: '2023-10-20' },
        { id: 3, name: 'Supervisor', type: 'binario', users: 5, requiredPoints: 5000, currentPoints: 5000, revalidationDate: '2023-11-10' },
        { id: 4, name: 'Asociado', type: 'unilevel', users: 2, requiredPoints: 1000, currentPoints: 1200, revalidationDate: '2023-12-05' },
        { id: 5, name: 'Embajador', type: 'binario', users: 20, requiredPoints: 30000, currentPoints: 35000, revalidationDate: '2024-01-15' },
        { id: 6, name: 'Presidente', type: 'unilevel', users: 30, requiredPoints: 50000, currentPoints: 60000, revalidationDate: '2024-02-20' },
    ];

    populateTable(ranksData);
    updateSummaryStats(ranksData);

    // Event listener for the "Agregar Nuevo Rango" button
    addRankBtn.addEventListener('click', () => {
        addRankForm.reset(); // Clear the form fields
    });

    // Event listener for form submission
    addRankForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        const rankName = document.getElementById('rankName').value;
        const rankType = document.getElementById('rankType').value;
        const rankRequiredPoints = document.getElementById('rankRequiredPoints').value;

        // Create a new rank object
        const newRank = {
            id: ranksData.length + 1, // Generate a new ID (replace with your logic)
            name: rankName,
            type: rankType,
            users: 0, // Initial number of users
            requiredPoints: parseInt(rankRequiredPoints),
            currentPoints: 0,
            revalidationDate: '2024-01-01' // Set a default revalidation date
        };

        ranksData.push(newRank); // Add the new rank to the array

        populateTable(ranksData); // Update the table
        updateSummaryStats(ranksData); // Update summary statistics
        addRankModal.hide(); // Hide the modal
        addRankForm.reset(); // Reset the form
    });


    rankFilterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const typeFilter = document.getElementById('rankTypeFilter').value;
        const userSearch = document.getElementById('userSearch').value.toLowerCase();
        const statusFilter = document.getElementById('rankStatusFilter').value;

        const filteredData = ranksData.filter(rank => {
            const typeMatch = typeFilter === "" || rank.type === typeFilter;
            const userMatch = rank.name.toLowerCase().includes(userSearch);
            const statusMatch = statusFilter === "" || getRankStatus(rank) === statusFilter; // Use the function

            return typeMatch && userMatch && statusMatch;
        });

        populateTable(filteredData);
        updateSummaryStats(filteredData);
    });

    clearFiltersBtn.addEventListener('click', () => {
        rankFilterForm.reset();
        populateTable(ranksData);
        updateSummaryStats(ranksData);
    });

    function populateTable(data) {
        rankResultsTable.innerHTML = ""; // Clear existing rows
        data.forEach(rank => {
            const row = rankResultsTable.insertRow();
            row.insertCell().textContent = rank.id;
            row.insertCell().textContent = rank.name;
            row.insertCell().textContent = rank.type;
            row.insertCell().textContent = rank.users;
            row.insertCell().textContent = rank.requiredPoints;
            row.insertCell().textContent = rank.currentPoints;
            row.insertCell().textContent = rank.revalidationDate;

            const actionsCell = row.insertCell();
            actionsCell.innerHTML = `
                <button class="btn btn-outline-info btn-sm">Ver Detalles</button>
                <button class="btn btn-outline-success btn-sm">Actualizar</button>
                <button class="btn btn-outline-danger btn-sm">Eliminar</button>
            `;
        });
    }

    function updateSummaryStats(data) {
        totalRanksCount.textContent = data.length;
        usersPerRankCount.textContent = data.reduce((sum, rank) => sum + rank.users, 0);

        const highestRank = data.reduce((maxRank, currentRank) => {
            return currentRank.requiredPoints > maxRank.requiredPoints ? currentRank : maxRank;
        }, { requiredPoints: -1 }); // Initialize with a minimum value

        highestRankName.textContent = highestRank.name || "No Ranks Yet"; // Handle empty data case
    }


    function getRankStatus(rank) {
        if (rank.currentPoints >= rank.requiredPoints) {
            return "activo";
        } else if (rank.revalidationDate < new Date().toLocaleDateString()) { // Check if revalidation date has passed
            return "expirado";
        } else {
            return "revalidado";
        }
    }

    // Export functions (CSV, Excel, PDF) - Implement these as needed

    exportCsvBtn.addEventListener('click', () => {
        // Implement CSV export logic
        console.log("Exporting to CSV");
    });

    exportExcelBtn.addEventListener('click', () => {
        // Implement Excel export logic
        console.log("Exporting to Excel");
    });

    exportPdfBtn.addEventListener('click', () => {
        // Implement PDF export logic
        console.log("Exporting to PDF");
    });

});