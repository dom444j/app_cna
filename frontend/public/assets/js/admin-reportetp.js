document.addEventListener("DOMContentLoaded", function () {
    // Simulación de datos (estos vendrán de la base de datos en el futuro)
    const sellersData = [
        { id: 1, name: "Juan Pérez", sales: "$25,000" },
        { id: 2, name: "María Gómez", sales: "$20,500" },
        { id: 3, name: "Carlos López", sales: "$18,900" }
    ];

    const recruitersData = [
        { id: 1, name: "María Gómez", referrals: 30 },
        { id: 2, name: "Juan Pérez", referrals: 15 },
        { id: 3, name: "Carlos López", referrals: 10 }
    ];

    const leadersData = [
        { id: 1, name: "Carlos López", points: 15000 },
        { id: 2, name: "María Gómez", points: 9500 },
        { id: 3, name: "Juan Pérez", points: 10000 }
    ];

    function populateTable(tableId, data, columns) {
        const tableBody = document.querySelector(`#${tableId} tbody`);
        tableBody.innerHTML = "";

        data.forEach((row, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${index + 1}</td>` + columns.map(col => `<td>${row[col]}</td>`).join("");
            tableBody.appendChild(tr);
        });
    }

    // Poblar tablas con datos simulados
    populateTable("topSellersTable", sellersData, ["id", "name", "sales"]);
    populateTable("topRecruitersTable", recruitersData, ["id", "name", "referrals"]);
    populateTable("topLeadersTable", leadersData, ["id", "name", "points"]);

    // Funciones de exportación
    function exportTableToCSV(tableId, filename) {
        const table = document.getElementById(tableId);
        let csv = [];
        
        for (let row of table.rows) {
            let cols = [];
            for (let cell of row.cells) {
                cols.push(cell.innerText);
            }
            csv.push(cols.join(","));
        }
        
        const csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(csvFile);
        link.download = filename;
        link.click();
    }

    document.getElementById("exportCsvBtn").addEventListener("click", () => {
        exportTableToCSV("topSellersTable", "Top_Vendedores.csv");
        exportTableToCSV("topRecruitersTable", "Top_Reclutadores.csv");
        exportTableToCSV("topLeadersTable", "Top_Lideres.csv");
    });

    // Se pueden agregar más funciones de exportación para Excel y PDF aquí
});
