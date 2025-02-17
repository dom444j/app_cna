document.addEventListener('DOMContentLoaded', function () {
    // Volver a la lista de usuarios
    document.getElementById('backToUserListBtn').addEventListener('click', function () {
        alert('Regresando a la lista de usuarios');
        // Aquí puedes redirigir o mostrar la sección correspondiente
    });

    // Simulación de cambiar avatar
    document.getElementById('changeAvatarBtn').addEventListener('click', function () {
        alert('Abrir diálogo para cambiar avatar');
    });

    // Guardar cambios en el perfil
    document.getElementById('userProfileForm').addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Perfil actualizado con éxito');
        // Aquí puedes enviar los datos al servidor o actualizar la información
    });
});
