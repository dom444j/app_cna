document.addEventListener("DOMContentLoaded", function () {
    // Simulación de roles
    const rolesData = [
        { id: 1, name: "Administrador", permissions: ["Usuarios", "Contenido", "Configuración", "Supervisión"] },
        { id: 2, name: "Usuario", permissions: ["Contenido"] },
        { id: 3, name: "Supervisor", permissions: ["Supervisión"] }
    ];

    function populateRoles() {
        const tableBody = document.querySelector("#rolesTable tbody");
        tableBody.innerHTML = "";

        rolesData.forEach(role => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${role.id}</td>
                <td>${role.name}</td>
                <td>${role.permissions.join(", ")}</td>
                <td>
                    <button class="btn btn-sm btn-warning edit-role" data-id="${role.id}">Editar</button>
                    <button class="btn btn-sm btn-danger delete-role" data-id="${role.id}">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    populateRoles();

    // Manejo del formulario de roles
    document.getElementById("roleForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const roleName = document.getElementById("roleName").value;
        const permissions = [];
        if (document.getElementById("manageUsers").checked) permissions.push("Usuarios");
        if (document.getElementById("manageContent").checked) permissions.push("Contenido");
        if (document.getElementById("manageSettings").checked) permissions.push("Configuración");
        if (document.getElementById("superviseUsers").checked) permissions.push("Supervisión");

        if (!roleName) {
            alert("Ingrese un nombre para el rol.");
            return;
        }

        const newRole = {
            id: rolesData.length + 1,
            name: roleName,
            permissions
        };
        rolesData.push(newRole);
        populateRoles();
        alert("Rol guardado correctamente.");
        this.reset();
    });

    // Manejo de eliminación de roles
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-role")) {
            const roleId = parseInt(event.target.getAttribute("data-id"));
            const index = rolesData.findIndex(r => r.id === roleId);
            if (index !== -1) {
                rolesData.splice(index, 1);
                populateRoles();
                alert("Rol eliminado correctamente.");
            }
        }
    });
});
