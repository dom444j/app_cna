document.addEventListener('DOMContentLoaded', function () {
    const downloadBtn = document.getElementById('downloadLeaderboardBtn');
    const filterPeriod = document.getElementById('filterPeriod');
    const filterRegion = document.getElementById('filterRegion');
    const profileButtons = document.querySelectorAll('.view-profile-btn');
  
    // Función para descargar el ranking en formato CSV
    downloadBtn.addEventListener('click', () => {
      alert('Descargando el ranking en formato CSV...');
      // Aquí se puede implementar la lógica para generar y descargar el archivo CSV
    });
  
    // Función para manejar los filtros
    filterPeriod.addEventListener('change', applyFilters);
    filterRegion.addEventListener('change', applyFilters);
  
    function applyFilters() {
      const period = filterPeriod.value;
      const region = filterRegion.value;
      console.log(`Aplicando filtros: Periodo=${period}, Región=${region}`);
      // Aquí se puede implementar la lógica de filtrado dinámico
    }
  
    // Función para ver detalles del perfil
    profileButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const username = event.target.dataset.username;
        alert(`Mostrando perfil del usuario: ${username}`);
        // Aquí se puede redirigir o cargar más detalles sobre el usuario
      });
    });
  });
  