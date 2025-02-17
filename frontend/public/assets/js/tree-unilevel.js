
// Cargar y mostrar la estructura del árbol unilevel con imágenes correctas
document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/tree/unilevel')
        .then(response => response.json())
        .then(data => {
            const treeContainer = document.getElementById('unilevelTree');
            treeContainer.innerHTML = generateUnilevelTreeHTML(data);
        })
        .catch(error => console.error('Error al cargar el árbol unilevel:', error));
});

function generateUnilevelTreeHTML(treeData) {
    if (!treeData) return "<p>No hay datos disponibles</p>";
    
    let html = '<ul>';
    function buildTree(node) {
        if (!node) return "";
        const imageUrl = node.image ? node.image : '/assets/images/default-user.png';
        let childrenHTML = "";
        if (node.children) {
            childrenHTML = "<ul>";
            node.children.forEach(child => {
                childrenHTML += buildTree(child);
            });
            childrenHTML += "</ul>";
        }
        return `<li><img src="${imageUrl}" alt="${node.name}" width="50"> ${node.name}${childrenHTML}</li>`;
    }
    html += buildTree(treeData);
    html += '</ul>';
    return html;
}
