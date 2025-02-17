
// Cargar gráficos en el dashboard usando Chart.js
document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/dashboard/stats')
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('chartUsers').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Usuarios', 'Afiliados', 'Bonos Pagados'],
                    datasets: [{
                        label: 'Estadísticas Generales',
                        data: [data.users, data.affiliates, data.bonuses],
                        backgroundColor: ['blue', 'green', 'orange']
                    }]
                }
            });
        })
        .catch(error => console.error('Error al cargar las estadísticas:', error));
});
