document.addEventListener('DOMContentLoaded', function () {
    // **1. Configuración de gráficos**: Asegura mantener las proporciones
    const creditSalesByCategoryCtx = document.getElementById('creditSalesByCategoryChart').getContext('2d');
    const monthlyCreditApprovalCtx = document.getElementById('monthlyCreditApprovalChart').getContext('2d');

    // Gráfico: Ventas por Categoría
    new Chart(creditSalesByCategoryCtx, {
        type: 'doughnut',
        data: {
            labels: ['Electrodomésticos', 'Muebles', 'Tecnología'],
            datasets: [{
                data: [30, 40, 20], // Datos de ejemplo
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Gráfico: Créditos Aprobados por Mes
    new Chart(monthlyCreditApprovalCtx, {
        type: 'line',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
            datasets: [{
                label: 'Créditos Aprobados',
                data: [5, 10, 8, 12, 15],
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: true
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
                        text: 'Cantidad de Créditos'
                    }
                }
            }
        }
    });

    // **2. Configuración de tabla de productos**
    const creditProductTable = document.getElementById('creditProductTable');
    const searchInput = document.getElementById('searchCreditProductTable');
    const addProductBtn = document.getElementById('addCreditProductBtn');
    const productForm = document.getElementById('creditProductForm');

    let editingProductRow = null;

    // Búsqueda en la tabla de productos
    searchInput.addEventListener('input', function () {
        const searchText = this.value.toLowerCase();
        const rows = creditProductTable.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const rowData = row.innerText.toLowerCase();
            row.style.display = rowData.includes(searchText) ? '' : 'none';
        });
    });

    // Abrir modal para añadir producto
    addProductBtn.addEventListener('click', function () {
        productForm.reset();
        editingProductRow = null;
    });

    // Guardar producto
    productForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const productData = {
            nombre: document.getElementById('creditProductName').value,
            categoria: document.getElementById('creditProductCategory').value,
            precio: document.getElementById('creditProductPrice').value,
            stock: document.getElementById('creditProductStock').value,
            descripcion: document.getElementById('creditProductDescription').value
        };

        if (editingProductRow) {
            // Actualizar la fila existente
            editingProductRow.querySelector('td:nth-child(3)').innerText = productData.nombre;
            editingProductRow.querySelector('td:nth-child(4)').innerText = productData.categoria;
            editingProductRow.querySelector('td:nth-child(5)').innerText = `${productData.precio} Puntos`;
            editingProductRow.querySelector('td:nth-child(6)').innerText = productData.stock;
        } else {
            // Añadir una nueva fila
            const newRow = `
                <tr>
                    <td>#</td>
                    <td>Nuevo</td>
                    <td>${productData.nombre}</td>
                    <td>${productData.categoria}</td>
                    <td>${productData.precio} Puntos</td>
                    <td>${productData.stock}</td>
                    <td><span class="badge bg-success">Disponible</span></td>
                    <td>
                        <button class="btn btn-outline-info btn-sm btn-edit">Editar</button>
                        <button class="btn btn-outline-danger btn-sm btn-delete">Eliminar</button>
                    </td>
                </tr>
            `;
            creditProductTable.querySelector('tbody').insertAdjacentHTML('beforeend', newRow);
        }

        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('creditProductModal'));
        modal.hide();

        // Reasignar eventos a los nuevos botones
        addTableActionEvents();
    });

    // **3. Eventos para los botones de la tabla**
    function addTableActionEvents() {
        creditProductTable.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function () {
                editingProductRow = this.closest('tr');

                // Cargar los datos en el formulario
                document.getElementById('creditProductName').value = editingProductRow.querySelector('td:nth-child(3)').innerText;
                document.getElementById('creditProductCategory').value = editingProductRow.querySelector('td:nth-child(4)').innerText;
                document.getElementById('creditProductPrice').value = editingProductRow.querySelector('td:nth-child(5)').innerText.replace(' Puntos', '');
                document.getElementById('creditProductStock').value = editingProductRow.querySelector('td:nth-child(6)').innerText;

                // Abrir el modal
                const modal = new bootstrap.Modal(document.getElementById('creditProductModal'));
                modal.show();
            });
        });

        creditProductTable.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function () {
                const row = this.closest('tr');
                row.remove();
            });
        });
    }

    // Inicializar eventos en las filas existentes
    addTableActionEvents();
});
