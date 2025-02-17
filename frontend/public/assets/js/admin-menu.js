document.addEventListener('DOMContentLoaded', function () {
  const menuItems = document.querySelectorAll('.menu-toggle');

  // Evento para abrir y cerrar submenús correctamente
  menuItems.forEach(item => {
      item.addEventListener('click', function (e) {
          e.preventDefault();

          // Identificar el elemento del menú correspondiente
          const parentMenuItem = this.closest('.menu-item');

          // Alternar la clase 'open' en el menú actual
          parentMenuItem.classList.toggle('open');
      });
  });

  // Mantener el estado activo según la URL actual
  const currentUrl = window.location.pathname;
  document.querySelectorAll('.menu-link').forEach(link => {
      const linkUrl = new URL(link.href, window.location.origin).pathname;

      if (linkUrl === currentUrl) {
          // Marcar el enlace actual como activo
          const activeItem = link.closest('.menu-item');
          activeItem.classList.add('active');

          // Asegurar que todos los padres se mantengan abiertos
          let parentMenu = activeItem.closest('.menu-sub');
          while (parentMenu) {
              const parentItem = parentMenu.closest('.menu-item');
              if (parentItem) {
                  parentItem.classList.add('open');
              }
              parentMenu = parentItem?.closest('.menu-sub');
          }
      }
  });

  // Soporte para responsive: asegurar que abra en pantallas pequeñas
  const menuToggle = document.querySelector('.layout-menu-toggle');
  if (menuToggle) {
      menuToggle.addEventListener('click', function () {
          document.querySelector('#layout-menu').classList.toggle('menu-open');
      });
  }
});
