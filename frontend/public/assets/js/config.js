
// Funciones globales para tablas y formularios

// Filtro de búsqueda en tablas
function filterTable(inputId, tableId, columnIndex = 1) {
    document.getElementById(inputId).addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll(`#${tableId} tbody tr`);
        rows.forEach(row => {
            const cellText = row.cells[columnIndex]?.textContent.toLowerCase() || "";
            row.style.display = cellText.includes(searchTerm) ? "" : "none";
        });
    });
}

// Exportar datos de tabla a CSV
function exportTableToCSV(tableId, filename = "export.csv") {
    const rows = document.querySelectorAll(`#${tableId} tr`);
    let csvContent = "";
    rows.forEach(row => {
        let rowData = [];
        row.querySelectorAll("td, th").forEach(cell => rowData.push(cell.innerText));
        csvContent += rowData.join(",") + "\n";
    });
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Validación de formularios antes de envío
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll("input[required], select[required], textarea[required]");
    for (const input of inputs) {
        if (!input.value.trim()) {
            alert(`Por favor, complete el campo: ${input.name}`);
            input.focus();
            return false;
        }
    }
    return true;
}
