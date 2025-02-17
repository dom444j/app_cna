document.addEventListener("DOMContentLoaded", function () {
    // Simulación de mensajes
    const messagesData = [
        { id: 1, userId: "USR00123", name: "Juan Pérez", email: "juanp@example.com", subject: "Aviso Importante", message: "No olvides completar tu perfil.", date: "2025-02-12", status: "No leído", priority: "Alta" },
        { id: 2, userId: "USR00456", name: "María Gómez", email: "mariag@example.com", subject: "Consulta", message: "¿Cuándo se procesa mi pago?", date: "2025-02-11", status: "Leído", priority: "Normal" }
    ];

    function populateMessages() {
        const messageList = document.getElementById("messageList");
        messageList.innerHTML = "";

        messagesData.forEach(msg => {
            const li = document.createElement("li");
            li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start");
            li.innerHTML = `
                <div class="me-2">
                    <h6 class="mb-1">${msg.name} (${msg.userId})</h6>
                    <small class="text-muted">Asunto: ${msg.subject}</small>
                </div>
                <span class="badge ${msg.status === "No leído" ? "bg-label-danger" : "bg-label-secondary"}">${msg.status}</span>
            `;
            messageList.appendChild(li);
        });
    }

    populateMessages();

    // Manejo de selección de destinatario
    document.getElementById("destinatario").addEventListener("change", function () {
        const userField = document.getElementById("codigoUsuario");
        if (this.value === "usuario") {
            userField.style.display = "block";
        } else {
            userField.style.display = "none";
        }
    });

    // Manejo del envío de mensajes
    document.getElementById("sendMessageForm").addEventListener("submit", function (event) {
        event.preventDefault();
        
        const userId = document.getElementById("userCode").value || "ADMIN";
        const name = document.getElementById("userName").value;
        const email = document.getElementById("userEmail").value;
        const subject = document.getElementById("asunto").value;
        const message = document.getElementById("mensaje").value;
        const priority = document.getElementById("prioridad").value;
        const date = new Date().toISOString().split("T")[0];
        
        if (!name || !email || !subject || !message) {
            alert("Por favor, complete todos los campos requeridos.");
            return;
        }

        // Simulación de guardar mensaje
        messagesData.unshift({
            id: messagesData.length + 1,
            userId,
            name,
            email,
            subject,
            message,
            date,
            status: "No leído",
            priority
        });

        populateMessages();
        alert("Mensaje enviado con éxito.");
        this.reset();
    });
});
