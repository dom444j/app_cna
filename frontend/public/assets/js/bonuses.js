
// Cargar y mostrar los bonos de los usuarios
document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/bonuses')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('bonusesTableBody');
            tableBody.innerHTML = ''; // Limpiar tabla antes de agregar datos

            data.forEach(bonus => {
                const row = `
                    <tr>
                        <td>${bonus.id}</td>
                        <td>${bonus.user_name}</td>
                        <td>${bonus.type}</td>
                        <td>${bonus.amount}</td>
                        <td>${bonus.date}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => console.error('Error al cargar los bonos:', error));
});
