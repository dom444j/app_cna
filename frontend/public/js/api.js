const API_BASE_URL = "http://localhost:5000"; // URL del backend

// Función genérica para hacer solicitudes a la API con cookies
const apiRequest = async (endpoint, method = "GET", data = null, authRequired = false) => {
    const headers = { "Content-Type": "application/json" };
    const options = { method, headers, credentials: "include" };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Error en la API");
        }

        return result;
    } catch (error) {
        console.error("API Request Error:", error.message);
        return { error: error.message };
    }
};

// 🔹 **Autenticación con Cookies Seguras**
const login = async (email, password) => {
    const response = await apiRequest("/login", "POST", { email, password });
    if (response.error) {
        Swal.fire("Error", response.error, "error"); // Manejo con SweetAlert2
    } else {
        Swal.fire("Éxito", "Inicio de sesión exitoso", "success");
        setTimeout(() => { window.location.href = "/dashboard.html"; }, 1000);
    }
};

const logout = async () => {
    await apiRequest("/logout", "POST");
    Swal.fire("Sesión cerrada", "Has salido del sistema", "info");
    setTimeout(() => { window.location.href = "/login.html"; }, 1000);
};

// Verificación automática de sesión al cargar la página
const checkAuth = async () => {
    const response = await apiRequest("/profile", "GET", null, true);
    if (response.error) {
        window.location.href = "/login.html";
    }
};