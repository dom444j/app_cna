document.addEventListener('DOMContentLoaded', function () {
    // Datos del árbol unilevel (ejemplo)
    const unilevelTreeData = {
        name: "Admin Principal",
        id: "A001",
        points: 5000,
        state: "Activo",
        rank: "Líder Principal",
        children: [
            {
                name: "Usuario A",
                id: "U100",
                points: 1200,
                state: "Activo",
                rank: "Consultor"
            },
            {
                name: "Usuario B",
                id: "U200",
                points: 1500,
                state: "Inactivo",
                rank: "Distribuidor"
            },
            {
                name: "Usuario C",
                id: "U300",
                points: 900,
                state: "Activo",
                rank: "Afiliado"
            }
        ]
    };

    // Configuración básica del contenedor
    const width = 1000;
    const height = 500;
    let scale = 1;

    // Crear la estructura del árbol unilevel usando D3.js
    const treeLayout = d3.tree().size([width, height - 400]);
    const root = d3.hierarchy(unilevelTreeData, d => d.children);

    treeLayout(root);

    // Crear el SVG para renderizar el árbol
    const svg = d3.select("#unilevel-tree")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(50, 50)");

    // Dibujar líneas de conexión
    svg.selectAll(".link-line")
        .data(root.links())
        .enter()
        .append("line")
        .attr("class", "link-line")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
        .style("stroke", "#ccc");

    // Dibujar nodos
    const nodes = svg.selectAll(".tree-node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", "tree-node")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    nodes.append("circle")
        .attr("r", 20)
        .attr("fill", d => d.data.state === "Activo" ? "#007bff" : "#e0e0e0");

    nodes.append("text")
        .attr("dy", -25)
        .attr("text-anchor", "middle")
        .text(d => d.data.name);

    nodes.append("text")
        .attr("dy", 10)
        .attr("text-anchor", "middle")
        .text(d => `Puntos: ${d.data.points}`);

    nodes.append("text")
        .attr("dy", 25)
        .attr("text-anchor", "middle")
        .text(d => `Rango: ${d.data.rank}`);

    // Tooltip al pasar sobre un nodo
    nodes.on('mouseenter', function (event, d) {
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.innerHTML = `
            <strong>${d.data.name}</strong><br>
            ID: ${d.data.id}<br>
            Estado: ${d.data.state}<br>
            Puntos: ${d.data.points}<br>
            Rango: ${d.data.rank}
        `;
        document.body.appendChild(tooltip);

        tooltip.style.display = 'block';
        tooltip.style.left = `${event.pageX + 10}px`;
        tooltip.style.top = `${event.pageY + 10}px`;

        nodes.on('mousemove', function (event) {
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY + 10}px`;
        });

        nodes.on('mouseleave', function () {
            tooltip.remove();
        });
    });

    // Función de búsqueda
    document.getElementById('searchUserBtn').addEventListener('click', function () {
        const searchText = document.getElementById('searchUnilevelTree').value.toLowerCase();
        nodes.selectAll('text')
            .filter(d => d.data.name.toLowerCase().includes(searchText))
            .attr("fill", "red")
            .attr("font-weight", "bold");
    });
});
