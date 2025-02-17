document.addEventListener('DOMContentLoaded', () => {
    const reportResultsTable = document.getElementById('reportResultsTable').querySelector('tbody');
    const reportFilterForm = document.getElementById('reportFilterForm');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const reportDetailsModal = new bootstrap.Modal(document.getElementById('reportDetailsModal'));

    let reportData = [];

    // Datos de ejemplo (Reemplazar con datos reales)
    reportData = [
        { id: 'R001', date: '2024-02-10', user: 'Juan Pérez', type: 'Compra', amount: '$500.00', status: 'Completado' },
        { id: 'R002', date: '2024-02-12', user: 'María López', type: 'Bono', amount: '$200.00', status: 'Pendiente' },
        { id: 'R003', date: '2024-02-15', user: 'Carlos Gómez', type: 'Retiro', amount: '$750.00', status: 'Rechazado' }
    ];

    populateTable(reportData);

    reportFilterForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const userSearch = document.getElementById('userSearch').value.toLowerCase();

        const filteredData = reportData.filter(report => {
            const reportDate = new Date(report.date);
            const filterStartDate = startDate ? new Date(startDate) : new Date('2000-01-01');
            const filterEndDate = endDate ? new Date(endDate) : new Date();

            const dateMatch = reportDate >= filterStartDate && reportDate <= filterEndDate;
            const userMatch = report.user.toLowerCase().includes(userSearch) || report.id.toLowerCase().includes(userSearch);

            return dateMatch && userMatch;
        });

        populateTable(filteredData);
    });

    clearFiltersBtn.addEventListener('click', () => {
        reportFilterForm.reset();
        populateTable(reportData);
    });

    function populateTable(data) {
        reportResultsTable.innerHTML = "";

        data.forEach((report, index) => {
            const row = reportResultsTable.insertRow();
            row.insertCell().textContent = index + 1;
            row.insertCell().textContent = report.id;
            row.insertCell().textContent = report.date;
            row.insertCell().textContent = report.user;
            row.insertCell().textContent = report.type;
            row.insertCell().textContent = report.amount;
            row.insertCell().textContent = report.status;

            const actionsCell = row.insertCell();
            const detailsButton = document.createElement('button');
            detailsButton.classList.add('btn', 'btn-outline-info', 'btn-sm');
            detailsButton.textContent = 'Ver Detalles';
            detailsButton.addEventListener('click', () => showDetails(report));
            actionsCell.appendChild(detailsButton);
        });
    }

    function showDetails(report) {
        document.getElementById('reportIdDetail').textContent = report.id;
        document.getElementById('reportDateDetail').textContent = report.date;
        document.getElementById('reportUserDetail').textContent = report.user;
        document.getElementById('reportTypeDetail').textContent = report.type;
        document.getElementById('reportAmountDetail').textContent = report.amount;
        document.getElementById('reportStatusDetail').textContent = report.status;
        reportDetailsModal.show();
    }

    // Función para exportar en CSV
    exportCsvBtn.addEventListener('click', () => exportTableToCSV('reporte_general.csv'));

    function exportTableToCSV(filename) {
        let csv = [];
        const rows = document.querySelectorAll("#reportResultsTable tr");

        for (let row of rows) {
            let rowData = [];
            const cols = row.querySelectorAll("td, th");
            for (let col of cols) {
                rowData.push(col.innerText);
            }
            csv.push(rowData.join(","));
        }

        const csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(csvFile);
        link.download = filename;
        link.click();
    }

    // Función para exportar en Excel (usando una librería como SheetJS)
    exportExcelBtn.addEventListener('click', () => {
        alert("Función de exportación a Excel en desarrollo.");
    });

    // Función para exportar en PDF (usando una librería como jsPDF)
    exportPdfBtn.addEventListener('click', () => {
        alert("Función de exportación a PDF en desarrollo.");
    });
});
