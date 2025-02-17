
// Cargar y mostrar la estructura del árbol binario con imágenes correctas
document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/tree/binary')
        .then(response => response.json())
        .then(data => {
            const treeContainer = document.getElementById('binaryTree');
            treeContainer.innerHTML = generateBinaryTreeHTML(data);
        })
        .catch(error => console.error('Error al cargar el árbol binario:', error));
});

function generateBinaryTreeHTML(treeData) {
    if (!treeData) return "<p>No hay datos disponibles</p>";
    
    let html = '<ul>';
    function buildTree(node) {
        if (!node) return "";
        const imageUrl = node.image ? node.image : '/assets/images/default-user.png';
        return `<li><img src="${imageUrl}" alt="${node.name}" width="50"> ${node.name}
            <ul>
                ${buildTree(node.left)}
                ${buildTree(node.right)}
            </ul>
        </li>`;
    }
    html += buildTree(treeData);
    html += '</ul>';
    return html;
}
