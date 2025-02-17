document.addEventListener("DOMContentLoaded", function () {
    // Simulación de datos con fechas y puntos en banco
    const unilevelBonuses = [
        { id: 1, name: "Juan Pérez", bonus: "$1,500", points: 5000, date: "2025-02-10" },
        { id: 2, name: "María Gómez", bonus: "$1,200", points: 4500, date: "2025-02-09" },
        { id: 3, name: "Carlos López", bonus: "$900", points: 4000, date: "2025-02-08" }
    ];

    const binaryBonuses = [
        { id: 1, name: "María Gómez", bonus: "$2,000", shortLine: 8000, bankPoints: 15000, remainingPoints: 7000, date: "2025-02-10" },
        { id: 2, name: "Juan Pérez", bonus: "$1,700", shortLine: 7500, bankPoints: 14000, remainingPoints: 6500, date: "2025-02-09" },
        { id: 3, name: "Carlos López", bonus: "$1,400", shortLine: 7000, bankPoints: 13000, remainingPoints: 6000, date: "2025-02-08" }
    ];

    const pointsSummary = [
        { id: 1, name: "Carlos López", generated: 15000, used: 5000, accumulated: 10000, bankPoints: 7000, date: "2025-02-10" },
        { id: 2, name: "María Gómez", generated: 12000, used: 4000, accumulated: 8000, bankPoints: 6000, date: "2025-02-09" },
        { id: 3, name: "Juan Pérez", generated: 11000, used: 3000, accumulated: 8000, bankPoints: 5000, date: "2025-02-08" }
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

    // Poblar las tablas con datos simulados
    populateTable("bonosUnilevelTable", unilevelBonuses, ["id", "name", "bonus", "points", "date"]);
    populateTable("bonosBinariosTable", binaryBonuses, ["id", "name", "bonus", "shortLine", "bankPoints", "remainingPoints", "date"]);
    populateTable("puntosTable", pointsSummary, ["id", "name", "generated", "used", "accumulated", "bankPoints", "date"]);

    // Función de exportación CSV
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

    function exportTableToExcel(tableId, filename) {
        const table = document.getElementById(tableId);
        let tableHTML = table.outerHTML.replace(/ /g, "%20");
        
        const link = document.createElement("a");
        link.href = 'data:application/vnd.ms-excel,' + tableHTML;
        link.download = filename;
        link.click();
    }

    document.getElementById("exportCsvBtn").addEventListener("click", () => {
        exportTableToCSV("bonosUnilevelTable", "Bonos_Unilevel.csv");
        exportTableToCSV("bonosBinariosTable", "Bonos_Binarios.csv");
        exportTableToCSV("puntosTable", "Resumen_Puntos.csv");
    });

    document.getElementById("exportExcelBtn").addEventListener("click", () => {
        exportTableToExcel("bonosUnilevelTable", "Bonos_Unilevel.xls");
        exportTableToExcel("bonosBinariosTable", "Bonos_Binarios.xls");
        exportTableToExcel("puntosTable", "Resumen_Puntos.xls");
    });

    // Se pueden agregar más funciones de exportación para PDF aquí
});
