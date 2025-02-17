document.addEventListener("DOMContentLoaded", function () {
    // Simulación de datos para el Informe de Pagos
    const paymentsData = [
        { id: 1, name: "Juan Pérez", amount: "$1,500", method: "Transferencia", status: "Pagado", date: "2025-02-10", commission: "$50", total: "$1,450" },
        { id: 2, name: "María Gómez", amount: "$1,200", method: "PayPal", status: "Pendiente", date: "2025-02-09", commission: "$40", total: "$1,160" },
        { id: 3, name: "Carlos López", amount: "$900", method: "Criptomoneda", status: "Pagado", date: "2025-02-08", commission: "$30", total: "$870" }
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

    // Poblar la tabla con datos simulados
    populateTable("paymentsReportTable", paymentsData, ["id", "name", "amount", "method", "status", "date", "commission", "total"]);

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
        exportTableToCSV("paymentsReportTable", "Informe_Pagos.csv");
    });

    document.getElementById("exportExcelBtn").addEventListener("click", () => {
        exportTableToExcel("paymentsReportTable", "Informe_Pagos.xls");
    });

    // Se pueden agregar más funciones de exportación para PDF aquí
});
