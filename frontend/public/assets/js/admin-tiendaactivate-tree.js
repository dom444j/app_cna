document.addEventListener('DOMContentLoaded', function () {
    // **1. Configuración de Gráficos**
    const setCanvasSize = (canvas) => {
        canvas.parentElement.style.height = '400px'; // Tamaño fijo para mantener consistencia
    };

    // Gráfico: Ventas por Categoría
    const salesByCategoryCanvas = document.getElementById('salesByCategoryChart');
    setCanvasSize(salesByCategoryCanvas);
    new Chart(salesByCategoryCanvas.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Suplementos', 'Ropa', 'Accesorios'],
            datasets: [{
                data: [50, 25, 15],
                backgroundColor: ['#28a745', '#007bff', '#ffc107']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Gráfico: Ingresos Mensuales
    const monthlyRevenueCanvas = document.getElementById('monthlyRevenueChart');
    setCanvasSize(monthlyRevenueCanvas);
    new Chart(monthlyRevenueCanvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
            datasets: [{
                label: 'Ingresos',
                data: [4500, 5200, 6100, 7200, 8400],
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Meses'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Ingresos (USD)'
                    }
                }
            }
        }
    });

    // **2. Tabla de Productos**
    const productTable = document.getElementById('productTable');
    const searchInput = document.getElementById('searchProductTable');
    const productForm = document.getElementById('productFormExtended');
    const addProductBtn = document.getElementById('addProductBtn');
    let editingProductRow = null;

    // Búsqueda en la tabla de productos
    searchInput.addEventListener('input', function () {
        const searchText = this.value.toLowerCase();
        const rows = productTable.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const rowData = row.innerText.toLowerCase();
            row.style.display = rowData.includes(searchText) ? '' : 'none';
        });
    });

    // **3. Funcionalidad de productos (Añadir, Editar y Eliminar)**

    // Abrir modal para añadir producto
    addProductBtn.addEventListener('click', function () {
        productForm.reset();
        editingProductRow = null;
    });

    // Guardar producto
    productForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const productData = {
            nombre: document.getElementById('productNameExtended').value,
            categoria: document.getElementById('productCategoryExtended').value,
            precio: document.getElementById('productPriceExtended').value,
            puntos: document.getElementById('productPointsExtended').value,
            stock: document.getElementById('productStockExtended').value,
            descripcion: document.getElementById('productDescriptionExtended').value
        };

        if (editingProductRow) {
            // Actualizar la fila existente
            editingProductRow.querySelector('td:nth-child(3)').innerText = productData.nombre;
            editingProductRow.querySelector('td:nth-child(4)').innerText = productData.categoria;
            editingProductRow.querySelector('td:nth-child(5)').innerText = `$${productData.precio}`;
            editingProductRow.querySelector('td:nth-child(6)').innerText = productData.puntos;
            editingProductRow.querySelector('td:nth-child(7)').innerText = productData.stock;
        } else {
            // Añadir nueva fila a la tabla
            const newRow = `
                <tr>
                    <td>#</td>
                    <td>Nuevo</td>
                    <td>${productData.nombre}</td>
                    <td>${productData.categoria}</td>
                    <td>$${productData.precio}</td>
                    <td>${productData.puntos}</td>
                    <td>${productData.stock}</td>
                    <td><span class="badge bg-success">En Stock</span></td>
                    <td>
                        <button class="btn btn-outline-info btn-sm btn-edit">Editar</button>
                        <button class="btn btn-outline-danger btn-sm btn-delete">Eliminar</button>
                    </td>
                </tr>
            `;
            productTable.querySelector('tbody').insertAdjacentHTML('beforeend', newRow);
        }

        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
        modal.hide();

        // Actualizar eventos de los botones
        addTableActionEvents();
    });

    // Añadir eventos a los botones de la tabla
    function addTableActionEvents() {
        productTable.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function () {
                editingProductRow = this.closest('tr');
                document.getElementById('productNameExtended').value = editingProductRow.querySelector('td:nth-child(3)').innerText;
                document.getElementById('productCategoryExtended').value = editingProductRow.querySelector('td:nth-child(4)').innerText;
                document.getElementById('productPriceExtended').value = editingProductRow.querySelector('td:nth-child(5)').innerText.replace('$', '');
                document.getElementById('productPointsExtended').value = editingProductRow.querySelector('td:nth-child(6)').innerText;
                document.getElementById('productStockExtended').value = editingProductRow.querySelector('td:nth-child(7)').innerText;

                const modal = new bootstrap.Modal(document.getElementById('productModal'));
                modal.show();
            });
        });

        productTable.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function () {
                const row = this.closest('tr');
                row.remove();
            });
        });
    }

    // Inicializar los eventos en las filas existentes
    addTableActionEvents();
});


