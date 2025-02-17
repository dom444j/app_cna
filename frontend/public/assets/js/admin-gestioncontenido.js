document.addEventListener("DOMContentLoaded", function () {
    // Simulación de contenidos disponibles
    const contentData = [
        { id: 1, title: "Guía de Uso", description: "Manual para el uso de la plataforma.", date: "2025-02-12", file: "guia_uso.pdf" },
        { id: 2, title: "Reglamento Interno", description: "Normas y directrices de la comunidad.", date: "2025-02-10", file: "reglamento.pdf" }
    ];

    function populateContentTable() {
        const tableBody = document.querySelector("#contentTable tbody");
        tableBody.innerHTML = "";

        contentData.forEach(content => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${content.id}</td>
                <td>${content.title}</td>
                <td>${content.description}</td>
                <td>${content.date}</td>
                <td><a href="uploads/${content.file}" download class="btn btn-sm btn-success">Descargar</a></td>
                <td>
                    <button class="btn btn-sm btn-danger delete-content" data-id="${content.id}">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    populateContentTable();

    // Manejo del formulario de subida de contenido
    document.getElementById("uploadContentForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const contentTitle = document.getElementById("contentTitle").value;
        const contentDescription = document.getElementById("contentDescription").value;
        const contentFile = document.getElementById("contentFile").files[0];
        const date = new Date().toISOString().split("T")[0];

        if (!contentTitle || !contentDescription || !contentFile) {
            alert("Por favor, complete todos los campos y seleccione un archivo.");
            return;
        }

        const newContent = {
            id: contentData.length + 1,
            title: contentTitle,
            description: contentDescription,
            date,
            file: contentFile.name
        };
        contentData.push(newContent);
        populateContentTable();
        alert("Contenido subido correctamente.");
        this.reset();
    });

    // Manejo de eliminación de contenido
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-content")) {
            const contentId = parseInt(event.target.getAttribute("data-id"));
            const index = contentData.findIndex(c => c.id === contentId);
            if (index !== -1) {
                contentData.splice(index, 1);
                populateContentTable();
                alert("Contenido eliminado correctamente.");
            }
        }
    });
});
