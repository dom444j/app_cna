document.addEventListener('DOMContentLoaded', function () {
    // Datos del árbol binario
    const data = {
      name: "Líder",
      points: 1000,
      state: "Activo",
      sponsor: "N/A",
      image: "../assets/img/avatars/leader.png",
      children: [
        {
          name: "Usuario A",
          points: 500,
          state: "Activo",
          sponsor: "Líder",
          image: "../assets/img/avatars/user-a.png",
          children: [
            { name: "Usuario C", points: 300, state: "Activo", sponsor: "Usuario A", image: "../assets/img/avatars/user-c.png" },
            { name: "Usuario D", points: 320, state: "Inactivo", sponsor: "Usuario A", image: "../assets/img/avatars/user-d.png" }
          ]
        },
        {
          name: "Usuario B",
          points: 450,
          state: "Activo",
          sponsor: "Líder",
          image: "../assets/img/avatars/user-b.png",
          children: [
            { name: "Usuario E", points: 280, state: "Activo", sponsor: "Usuario B", image: "../assets/img/avatars/user-e.png" },
            { name: "Usuario F", points: 310, state: "Inactivo", sponsor: "Usuario B", image: "../assets/img/avatars/user-f.png" }
          ]
        }
      ]
    };
  
    const width = 800;
    const height = 600;
    let scale = 1;
  
    // Configuración del árbol binario usando d3.js
    const treeLayout = d3.tree().size([width - 200, height - 200]);
    const root = d3.hierarchy(data);
  
    treeLayout(root);
  
    const svg = d3.select("#binary-tree")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, 50)`);
  
    // Dibujar líneas de conexión
    svg.selectAll(".link-line")
      .data(root.links())
      .enter()
      .append("line")
      .attr("class", "link-line")
      .attr("x1", d => d.source.x - width / 2)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x - width / 2)
      .attr("y2", d => d.target.y);
  
    // Dibujar nodos
    const nodes = svg.selectAll(".tree-node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "tree-node")
      .attr("transform", d => `translate(${d.x - width / 2},${d.y})`);
  
    nodes.append("image")
      .attr("xlink:href", d => d.data.image)
      .attr("x", -30)
      .attr("y", -30)
      .attr("width", 60)
      .attr("height", 60);
  
    nodes.append("text")
      .attr("dy", 50)
      .attr("text-anchor", "middle")
      .text(d => d.data.name);
  
    nodes.append("text")
      .attr("dy", 70)
      .attr("text-anchor", "middle")
      .text(d => `Puntos: ${d.data.points}`);
  
    nodes.on('mouseenter', function (event, d) {
      const tooltip = document.createElement('div');
      tooltip.classList.add('tooltip');
      tooltip.innerHTML = `
        <strong>${d.data.name}</strong><br>
        Estado: ${d.data.state}<br>
        Patrocinador: ${d.data.sponsor}
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
  
    // Controles de zoom
    document.getElementById('zoomInBtn').addEventListener('click', () => {
      scale = Math.min(scale + 0.1, 2);
      svg.attr('transform', `translate(${width / 2}, 50) scale(${scale})`);
    });
  
    document.getElementById('zoomOutBtn').addEventListener('click', () => {
      scale = Math.max(scale - 0.1, 0.5);
      svg.attr('transform', `translate(${width / 2}, 50) scale(${scale})`);
    });
  
    document.getElementById('centerTreeBtn').addEventListener('click', () => {
      scale = 1;
      svg.attr('transform', `translate(${width / 2}, 50) scale(${scale})`);
    });
  });
  