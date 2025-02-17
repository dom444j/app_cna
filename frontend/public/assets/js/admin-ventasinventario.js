document.addEventListener('DOMContentLoaded', () => {
    const inventoryTable = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
    const recentMovementsTable = document.getElementById('recentInventoryMovementsTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('searchInventoryTable');
    const addProductBtn = document.getElementById('addInventoryProductBtn');
    const productModal = document.getElementById('inventoryProductModal');
    const productForm = document.getElementById('inventoryProductForm');
    const productNameInput = document.getElementById('inventoryProductName');
    const productCategorySelect = document.getElementById('inventoryProductCategory');
    const productPriceInput = document.getElementById('inventoryProductPrice');
    const productStockInput = document.getElementById('inventoryProductStock');
    const inventoryDistributionChartCanvas = document.getElementById('inventoryDistributionChart');
    const inventoryMovementsChartCanvas = document.getElementById('inventoryMovementsChart');


    // Sample Data (Replace with your actual data fetching)
    const inventoryData = [
        { id: 'I001', name: 'Producto Inventario A', category: 'Electrodomésticos', price: 150.00, stock: 10, status: 'Stock Crítico' },
        { id: 'I002', name: 'Producto Inventario B', category: 'Muebles', price: 250.00, stock: 50, status: 'En Stock' },
        // ... more data
    ];

    const movementsData = [
        { id: 'M001', product: 'Producto Inventario A', type: 'Entrada', quantity: 15, date: '2023-09-05', responsible: 'Juan Pérez' },
        { id: 'M002', product: 'Producto Inventario B', type: 'Salida', quantity: 5, date: '2023-09-06', responsible: 'Maria Gomez' },
        // ... more data
    ];

    // Function to populate the inventory table
    function populateInventoryTable(data) {
        inventoryTable.innerHTML = ''; // Clear existing rows
        data.forEach((item, index) => {
            const row = inventoryTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.stock}</td>
                <td><span class="badge ${item.stock < 20 ? 'bg-warning' : 'bg-success'}">${item.stock < 20 ? 'Stock Crítico' : 'En Stock'}</span></td>
                <td>
                    <button class="btn btn-outline-info btn-sm edit-btn" data-id="${item.id}">Editar</button>
                    <button class="btn btn-outline-success btn-sm adjust-btn" data-id="${item.id}">Ajustar Stock</button>
                    <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${item.id}">Eliminar</button>
                </td>
            `;

            // Add event listeners for the buttons in each row.
            const editButton = row.querySelector('.edit-btn');
            const adjustButton = row.querySelector('.adjust-btn');
            const deleteButton = row.querySelector('.delete-btn');

            editButton.addEventListener('click', () => {
                openModalForEdit(item);
            });

            adjustButton.addEventListener('click', () => {
                // Handle adjust stock logic here.
                console.log('Adjusting stock for product ID:', item.id);
            });

            deleteButton.addEventListener('click', () => {
                // Handle delete logic here
                console.log('Deleting product ID:', item.id);
            });
        });
    }


    // Function to populate the recent movements table
    function populateMovementsTable(data) {
        recentMovementsTable.innerHTML = ''; // Clear existing rows
        data.forEach((item, index) => {
            const row = recentMovementsTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.id}</td>
                <td>${item.product}</td>
                <td>${item.type}</td>
                <td>${item.quantity}</td>
                <td>${item.date}</td>
                <td>${item.responsible}</td>
            `;
        });
    }

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = inventoryData.filter(item => {
            return item.name.toLowerCase().includes(searchTerm) || item.id.toLowerCase().includes(searchTerm) || item.category.toLowerCase().includes(searchTerm);
        });
        populateInventoryTable(filteredData);
    });

    // Add Product Modal Functionality
    addProductBtn.addEventListener('click', () => {
        productForm.reset(); // Clear form fields
    });

    productForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        const newProduct = {
            id: generateNewId(), // Implement your ID generation logic
            name: productNameInput.value,
            category: productCategorySelect.value,
            price: parseFloat(productPriceInput.value),
            stock: parseInt(productStockInput.value),
            status: productStockInput.value < 20 ? 'Stock Crítico' : 'En Stock'
        };

        inventoryData.push(newProduct);
        populateInventoryTable(inventoryData);
        productModal.hide(); // Close the modal
        productForm.reset();
    });

    function generateNewId() {
        // Implement your logic to generate a unique ID.
        // This could be a simple counter or a more robust UUID.
        return 'I' + Date.now(); // Example: I + timestamp
    }

    function openModalForEdit(product) {
        productNameInput.value = product.name;
        productCategorySelect.value = product.category;
        productPriceInput.value = product.price;
        productStockInput.value = product.stock;

        // Set a data attribute on the form to identify it as an edit operation
        productForm.dataset.editId = product.id;
        // Optionally change the modal title or button text to indicate "Edit"

        // Show the modal
        const modal = new bootstrap.Modal(productModal); // Assuming you're using Bootstrap
        modal.show();
    }



    // Chart.js Example (Replace with your actual chart data)
    const inventoryDistributionChart = new Chart(inventoryDistributionChartCanvas, {
        type: 'bar', // or 'pie', 'doughnut', etc.
        data: {
            labels: ['Electrodomésticos', 'Muebles', 'Tecnología'], // Replace with your categories
            datasets: [{
                label: 'Number of Products',
                data: [100, 75, 50], // Replace with your data
                backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 206, 86, 0.2)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const inventoryMovementsChart = new Chart(inventoryMovementsChartCanvas, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'], // Replace with your months
            datasets: [{
                label: 'Inventory Movements',
                data: [65, 59, 80, 81, 56, 55], // Replace with your data
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.4
            }]
        },
        options: {
            // ... chart options
        }
    });

    // Initial population of the tables
    populateInventoryTable(inventoryData);
    populateMovementsTable(movementsData);


});
