
// Conexión del Dashboard con la API

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('/api/users/profile', { credentials: 'include' });
        const data = await response.json();

        if (!response.ok) throw new Error();

        // Insertar datos en el dashboard
        document.getElementById('userEmail').textContent = data.email;
        document.getElementById('userRole').textContent = data.role === 'admin' ? 'Administrador' : 'Usuario';

        // Obtener estadísticas del sistema
        loadDashboardStats();

    } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
    }
});

async function loadDashboardStats() {
    try {
        const response = await fetch('/api/dashboard/stats', { credentials: 'include' });
        const stats = await response.json();

        if (!response.ok) throw new Error();

        // Actualizar estadísticas en la interfaz
        document.getElementById('totalUsers').textContent = stats.totalUsers;
        document.getElementById('totalSales').textContent = stats.totalSales;
        document.getElementById('totalEarnings').textContent = `$${stats.totalEarnings}`;

    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}
