const drop = document.querySelector('.dropdown');

/**
 * Al pasar el raton me habre el menu contextual
 */
drop.addEventListener('mouseenter', () => {
    $this = '.dropdown';
    $($this).addClass('show');
    $($this).find('.dropdown-toggle').attr("aria-expanded", "true");
    $($this).find('.dropdown-menu').addClass('show');
})

/**
 * Al pasar el raton me cierra el menu contextual
 */
drop.addEventListener('mouseleave', () => {
    $this = '.dropdown';
    $($this).removeClass('show');
    $($this).find('.dropdown-toggle').attr("aria-expanded", "false");
    $($this).find('.dropdown-menu').removeClass('show');
})

const btnToggle = document.querySelector('#btnToggle');
const navBar = document.querySelector('#navBar');

btnToggle.addEventListener('click', function () {
  navBar.classList.toggle('Header-nav__isActive');
});


const btnSidemenu = document.querySelector("#btnSidemenu");
const sideMenu = document.querySelector("#sidemenu");

btnSidemenu.addEventListener("click", () => {
  document.querySelector('article').classList.toggle('body-expanded');
  sideMenu.classList.toggle("menu-expanded");
  sideMenu.classList.toggle("menu-collapsed");
});