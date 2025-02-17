
// Protección de rutas en el frontend

document.addEventListener('DOMContentLoaded', function () {
    const protectedRoutes = [
        { path: '/user-tablero.html', role: 'user' },
        { path: '/user-saldowallet.html', role: 'user' },
        { path: '/user-retiros.html', role: 'user' },
        { path: '/admin-gestionuser.html', role: 'admin' },
        { path: '/admin-banca-retiros.html', role: 'admin' }
    ];

    async function checkAuth() {
        try {
            const response = await fetch('/api/auth/verify', { credentials: 'include' });
            const data = await response.json();

            if (!response.ok) throw new Error();

            const userRole = data.user.role;
            const currentPath = window.location.pathname;

            // Verificar si la ruta es protegida y si el usuario tiene permisos
            const route = protectedRoutes.find(r => r.path === currentPath);
            if (route && route.role !== userRole) {
                alert('Acceso denegado');
                window.location.href = '/auth-login-basic.html';
            }
        } catch (error) {
            // Si no está autenticado, redirigir al login
            if (!window.location.pathname.includes('auth-login')) {
                window.location.href = '/auth-login-basic.html';
            }
        }
    }

    checkAuth();
});
