
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