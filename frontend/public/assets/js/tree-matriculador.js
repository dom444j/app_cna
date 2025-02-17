document.addEventListener('DOMContentLoaded', function () {
    const data = {
      id: 1,
      name: "Líder",
      fullname: "Líder Principal",
      position: "N/A",
      matriculador: "N/A",
      sponsor: "N/A",
      image: "../assets/img/avatars/leader.png",
      children: [
        {
          id: 2,
          name: "Usuario A",
          fullname: "Usuario Apellido A",
          position: "Izquierda",
          matriculador: "Líder",
          sponsor: "Líder",
          image: "../assets/img/avatars/user-a.png",
          children: [
            {
              id: 4,
              name: "Usuario C",
              fullname: "Usuario Apellido C",
              position: "Izquierda",
              matriculador: "Usuario A",
              sponsor: "Usuario A",
              image: "../assets/img/avatars/user-c.png",
            },
          ],
        },
        {
          id: 3,
          name: "Usuario B",
          fullname: "Usuario Apellido B",
          position: "Derecha",
          matriculador: "Líder",
          sponsor: "Líder",
          image: "../assets/img/avatars/user-b.png",
        },
        {
          id: 5,
          name: "Usuario D",
          fullname: "Usuario Apellido D",
          position: "Derecha",
          matriculador: "Líder",
          sponsor: "Líder",
          image: "../assets/img/avatars/user-d.png",
          children: [
            {
              id: 6,
              name: "Usuario E",
              fullname: "Usuario Apellido E",
              position: "Izquierda",
              matriculador: "Usuario D",
              sponsor: "Usuario D",
              image: "../assets/img/avatars/user-e.png",
            },
          ],
        },
      ],
    };
  
    const width = 800;
    const height = 400;
    let scale = 1;
  
    const treeLayout = d3.tree().size([width - 200, height - 100]);
    const root = d3.hierarchy(data);
  
    treeLayout(root);
  
    const svg = d3.select("#treeContainer")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(100, 50)");
  
    svg.selectAll(".link-line")
      .data(root.links())
      .enter()
      .append("line")
      .attr("class", "link-line")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
  
    const nodes = svg.selectAll(".tree-node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "tree-node")
      .attr("transform", d => `translate(${d.x},${d.y})`);
  
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
  
    nodes.on('mouseenter', function (event, d) {
      const tooltip = document.createElement('div');
      tooltip.classList.add('tooltip');
      tooltip.innerHTML = `
        <strong>${d.data.name}</strong><br>
        Estado: Activo<br>
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
  
    document.getElementById('zoomInBtn').addEventListener('click', () => {
      scale = Math.min(scale + 0.1, 2);
      svg.attr('transform', `translate(100, 50) scale(${scale})`);
    });
  
    document.getElementById('zoomOutBtn').addEventListener('click', () => {
      scale = Math.max(scale - 0.1, 0.5);
      svg.attr('transform', `translate(100, 50) scale(${scale})`);
    });
  
    document.getElementById('centerTreeBtn').addEventListener('click', () => {
      scale = 1;
      svg.attr('transform', `translate(100, 50) scale(${scale})`);
    });
  
    const userList = document.getElementById("userList");
  
    function addUserToList(user) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.fullname}</td>
        <td>${user.position}</td>
        <td>${user.matriculador}</td>
        <td>${user.sponsor}</td>
        <td><button class="btn btn-sm btn-info">Detalles</button></td>
      `;
      userList.appendChild(row);
  
      if (user.children) {
        user.children.forEach(addUserToList);
      }
    }
  
    addUserToList(data);
  });
  