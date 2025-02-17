document.addEventListener('DOMContentLoaded', function () {
  // Datos del árbol binario (ejemplo para pruebas)
  const adminTreeData = {
    name: 'Admin Principal',
    id: 'A001',
    points: 2000,
    state: 'Activo',
    rank: 'Administrador',
    registrationDate: '2022-01-01',
    children: [
      {
        name: 'Usuario A',
        id: 'U100',
        points: 1200,
        state: 'Activo',
        rank: 'Consultor',
        registrationDate: '2022-03-15',
        children: [
          {
            name: 'Usuario C',
            id: 'U101',
            points: 800,
            state: 'Activo',
            rank: 'Afiliado',
            registrationDate: '2022-05-20'
          },
          {
            name: 'Usuario D',
            id: 'U102',
            points: 600,
            state: 'Inactivo',
            rank: 'Distribuidor',
            registrationDate: '2022-06-12'
          }
        ]
      },
      {
        name: 'Usuario B',
        id: 'U200',
        points: 1100,
        state: 'Activo',
        rank: 'Distribuidor',
        registrationDate: '2022-04-01',
        children: [
          { name: 'Usuario E', id: 'U201', points: 700, state: 'Activo', rank: 'Consultor' },
          { name: 'Usuario F', id: 'U202', points: 550, state: 'Inactivo', rank: 'Afiliado' }
        ]
      }
    ]
  };

  // Configuración del contenedor y escala
  const width = 1000;
  const height = 600;
  let scale = 1;

  // Configuración del árbol binario usando D3
  const treeLayout = d3.tree().size([width - 200, height - 200]);
  const root = d3.hierarchy(adminTreeData);

  treeLayout(root);

  // Crear SVG para el árbol
  const svg = d3
    .select('#binary-tree')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .call(
      d3
        .zoom()
        .scaleExtent([0.5, 2])
        .on('zoom', function (event) {
          svg.attr('transform', event.transform);
        })
    )
    .append('g')
    .attr('transform', `translate(${width / 2}, 50)`);

  // Dibujar líneas de conexión entre nodos
  svg
    .selectAll('.link-line')
    .data(root.links())
    .enter()
    .append('line')
    .attr('class', 'link-line')
    .attr('x1', d => d.source.x - width / 2)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x - width / 2)
    .attr('y2', d => d.target.y);

  // Dibujar nodos
  const nodes = svg
    .selectAll('.tree-node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', 'tree-node')
    .attr('transform', d => `translate(${d.x - width / 2},${d.y})`);

  nodes
    .append('image')
    .attr('xlink:href', d =>
      d.data.state === 'Activo' ? '../assets/img/active-user-icon.png' : '../assets/img/inactive-user-icon.png'
    )
    .attr('x', -20)
    .attr('y', -60)
    .attr('width', 40)
    .attr('height', 40);

  nodes
    .append('circle')
    .attr('r', 30)
    .attr('fill', d => (d.data.state === 'Activo' ? '#007bff' : '#e0e0e0'));

  nodes
    .append('text')
    .attr('dy', -35)
    .attr('text-anchor', 'middle')
    .text(d => d.data.name);

  nodes
    .append('text')
    .attr('dy', -15)
    .attr('text-anchor', 'middle')
    .attr('class', 'node-text')
    .text(d => `Puntos: ${d.data.points}`);

  nodes
    .append('text')
    .attr('dy', 10)
    .attr('text-anchor', 'middle')
    .attr('class', 'node-text')
    .text(d => `Rango: ${d.data.rank || 'N/A'}`);

  nodes
    .append('text')
    .attr('dy', 35)
    .attr('text-anchor', 'middle')
    .attr('class', 'node-text')
    .text(d => `Estado: ${d.data.state}`);

  // Tooltip al pasar el mouse sobre un nodo
  nodes.on('mouseenter', function (event, d) {
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.innerHTML = `
        <strong>${d.data.name}</strong><br>
        ID: ${d.data.id}<br>
        Estado: ${d.data.state}<br>
        Puntos: ${d.data.points}<br>
        Rango: ${d.data.rank || 'N/A'}<br>
        Fecha de inscripción: ${d.data.registrationDate || 'No disponible'}
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

  // Controles de expansión y colapso
  document.getElementById('expandTreeBtn').addEventListener('click', () => {
    nodes.selectAll('g').style('display', 'block');
  });

  document.getElementById('collapseTreeBtn').addEventListener('click', () => {
    nodes.filter(d => d.depth > 1).style('display', 'none');
  });
});
