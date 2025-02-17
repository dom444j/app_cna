document.addEventListener('DOMContentLoaded', () => {
    const salesResultsTable = document.getElementById('salesResultsTable').querySelector('tbody');
    const salesPeriodFilterForm = document.getElementById('salesPeriodFilterForm');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const salesByCategoryCtx = document.getElementById('salesByCategoryChart').getContext('2d');
    const salesEvolutionCtx = document.getElementById('salesEvolutionChart').getContext('2d');

    let salesData = [];
    let salesByCategoryChart, salesEvolutionChart;

    // Sample Data (Replace with your actual data fetching)
    salesData = [
        { id: 'V001', date: '2023-09-05', product: 'Laptop', category: 'tecnologia', quantity: 2, unitPrice: 1200, total: 2400, client: 'Juan Perez' },
        { id: 'V002', date: '2023-09-05', product: 'Mouse', category: 'tecnologia', quantity: 5, unitPrice: 25, total: 125, client: 'Maria Sanchez' },
        { id: 'V003', date: '2023-09-06', product: 'Sofa', category: 'muebles', quantity: 1, unitPrice: 800, total: 800, client: 'Carlos Gomez' },
        { id: 'V004', date: '2023-09-07', product: 'Refrigerator', category: 'electrodomesticos', quantity: 1, unitPrice: 600, total: 600, client: 'Ana Rodriguez' },
        { id: 'V005', date: '2023-09-08', product: 'TV', category: 'electrodomesticos', quantity: 2, unitPrice: 400, total: 800, client: 'Luis Torres' },
        { id: 'V006', date: '2023-09-09', product: 'Chair', category: 'muebles', quantity: 4, unitPrice: 100, total: 400, client: 'Sofia Lopez' },
    ];

    populateTable(salesData);
    createCharts(salesData);

    salesPeriodFilterForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const category = document.getElementById('productCategory').value;
        const searchTerm = document.getElementById('productSearch').value.toLowerCase();

        const filteredData = salesData.filter(sale => {
            const saleDate = new Date(sale.date);
            const filterStartDate = new Date(startDate);
            const filterEndDate = new Date(endDate);

            const dateMatch = saleDate >= filterStartDate && saleDate <= filterEndDate;
            const categoryMatch = category === "" || sale.category === category;
            const searchMatch = sale.product.toLowerCase().includes(searchTerm) || sale.id.toLowerCase().includes(searchTerm);

            return dateMatch && categoryMatch && searchMatch;
        });

        populateTable(filteredData);
        createCharts(filteredData);
    });

    clearFiltersBtn.addEventListener('click', () => {
        salesPeriodFilterForm.reset();
        populateTable(salesData);
        createCharts(salesData);
    });

    function populateTable(data) {
        salesResultsTable.innerHTML = ""; // Clear existing rows

        data.forEach((sale, index) => {
            const row = salesResultsTable.insertRow();
            row.insertCell().textContent = index + 1;
            row.insertCell().textContent = sale.id;
            row.insertCell().textContent = sale.date;
            row.insertCell().textContent = sale.product;
            row.insertCell().textContent = sale.category;
            row.insertCell().textContent = sale.quantity;
            row.insertCell().textContent = `$${sale.unitPrice.toFixed(2)}`; // Format as currency
            row.insertCell().textContent = `$${sale.total.toFixed(2)}`;       // Format as currency
            row.insertCell().textContent = sale.client;
        });
    }

    function createCharts(data) {
        const salesByCategory = {};
        const salesEvolution = {};

        data.forEach(sale => {
            salesByCategory[sale.category] = (salesByCategory[sale.category] || 0) + sale.total;
            salesEvolution[sale.date] = (salesEvolution[sale.date] || 0) + sale.total;
        });

        const categoryLabels = Object.keys(salesByCategory);
        const categoryData = Object.values(salesByCategory);

        const evolutionLabels = Object.keys(salesEvolution);
        const evolutionData = Object.values(salesEvolution);

        // Sales by Category Chart
        if (salesByCategoryChart) {
            salesByCategoryChart.destroy(); // Destroy previous chart instance
        }
        salesByCategoryChart = new Chart(salesByCategoryCtx, {
            type: 'bar',
            data: {
                labels: categoryLabels,
                datasets: [{
                    label: 'Total Sales',
                    data: categoryData,
                    backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
                    borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Sales Evolution Chart
        if (salesEvolutionChart) {
            salesEvolutionChart.destroy(); // Destroy previous chart instance
        }
        salesEvolutionChart = new Chart(salesEvolutionCtx, {
            type: 'line',
            data: {
                labels: evolutionLabels,
                datasets: [{
                    label: 'Total Sales',
                    data: evolutionData,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }


});