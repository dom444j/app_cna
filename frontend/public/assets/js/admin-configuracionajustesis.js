document.addEventListener("DOMContentLoaded", function () {
    // Manejo de configuración general
    document.getElementById("generalSettingsForm").addEventListener("submit", function (event) {
        event.preventDefault();
        
        const systemName = document.getElementById("systemName").value;
        const systemEmail = document.getElementById("systemEmail").value;
        
        if (!systemName || !systemEmail) {
            alert("Por favor, complete todos los campos.");
            return;
        }
        
        alert("Configuración General Guardada: " + systemName + " - " + systemEmail);
    });

    // Manejo de configuración de seguridad
    document.getElementById("securitySettingsForm").addEventListener("submit", function (event) {
        event.preventDefault();
        
        const passwordPolicy = document.getElementById("passwordPolicy").value;
        const sessionTimeout = document.getElementById("sessionTimeout").value;
        
        if (!sessionTimeout) {
            alert("Ingrese un tiempo de expiración de sesión válido.");
            return;
        }
        
        alert("Seguridad Guardada: Política - " + passwordPolicy + ", Expiración: " + sessionTimeout + " min");
    });

    // Manejo de configuración de notificaciones
    document.getElementById("notificationsSettingsForm").addEventListener("submit", function (event) {
        event.preventDefault();
        
        const emailNotifications = document.getElementById("emailNotifications").checked;
        const platformNotifications = document.getElementById("platformNotifications").checked;
        
        alert("Notificaciones Guardadas: Email - " + (emailNotifications ? "Activadas" : "Desactivadas") + ", Plataforma - " + (platformNotifications ? "Activadas" : "Desactivadas"));
    });
});
