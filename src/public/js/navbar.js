// Variables MENU
const btnBook = document.getElementById('btnBook');
const btnHome = document.getElementById('btnHome');
const btnBooking = document.getElementById('btnBooking');
const btnPartner = document.getElementById('btnPartner');
const btnAdmin = document.getElementById('btnAdmin');
const btnRecord = document.getElementById('btnRecord');
const btnNavLogin = document.getElementById('btnNavLogin');
const btnHomeSidemenu = document.getElementById('btnHomeSidemenu');
const btnAdminSidemenu = document.getElementById('btnAdminSidemenu');
const btnBookSidemenu = document.getElementById('btnBookSidemenu');
const btnBookingSidemenu = document.getElementById('btnBookingSidemenu');
const btnPartnerSidemenu = document.getElementById('btnPartnerSidemenu');
const btnLoginSidemenu = document.getElementById('btnLoginSidemenu');
const btnLogout = document.getElementById('btnLogout');

try {
  btnLogout.addEventListener('click', (e) => {
    localStorage.removeItem('flip');
    localStorage.removeItem('emailLocal');
    localStorage.removeItem('emailLocalReset');
    localStorage.removeItem('DataTables_tablePartner_/workspace/partners');
    localStorage.clear();
  });
} catch (error) {}

// TODO CARGA FUNCION DE MARCADO DE PANTALLA
window.onload = onLoad();

function onLoad() {
  try {
    // HOME
    if ($('#stateHome').val() === '') { // 
      btnHome.classList.add('isSelected');
      btnHomeSidemenu.classList.add('isSelected');
    }
  } catch (error) { }

  try {
    // LOGIN
    if ($('#stateLogin').val() === '') { // 
      btnLoginSidemenu.classList.add('isSelect');
      btnNavLogin.classList.add('isSelect');
    }
  } catch (error) { }

  try {
    // BOOKS
    if ($('#stateBooks').val() === '') { // 
      btnBook.classList.add('isSelected');
      btnBookSidemenu.classList.add('isSelected');
    }
  } catch (error) { }

  try {
    // BOOKINGS
    if ($('#stateBookings').val() === '') { // 
      btnBooking.classList.add('isSelected');
      btnBookingSidemenu.classList.add('isSelected');
    }
  } catch (error) { }

  try {
    // ADMIN
    if ($('#stateAdmin').val() === '') { // 
      btnAdmin.classList.add('isSelected');
      btnAdminSidemenu.classList.add('isSelected');
    }
  } catch (error) { }

  try {
    // RECORD
    if ($('#stateRecord').val() === '') { // 
      btnRecord.classList.add('isSelected');
    }
  } catch (error) { }

  try {
    //PARTNERS
    if ($('#statePartners').val() === '') { // 
      btnPartner.classList.add('isSelected');
      btnPartnerSidemenu.classList.add('isSelected');
    }
  } catch (error) { }
}

// <---- Mostrar MENU en modo responsive ---->
const btnToggle = document.querySelector('#btnToggle');
const navBar = document.querySelector('#navBar');

// <---- Expandir Side Menu ---->
const btnSidemenu = document.getElementById("btnSidemenu");
const sideMenu = document.querySelector(".Sidemenu");
const Aside = document.querySelector(".Aside");
const mainCover = document.querySelector(".Main-cover");

var i = document.getElementById('fa-bars');
var j = document.getElementById('fa-bars--toggle');
let actInterSide = false;
let clickInterSide = false;
let actInterBar = false;
let clickInterBar = false

/* Intersection Observer, btnTogle / btnSidemenu */
const callback = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      actInterSide = true;
    }
  });
}
const observer = new IntersectionObserver(callback);
observer.observe(i);

const callbackToogle = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      actInterBar = true;
    }
  });
}
const observerToggle = new IntersectionObserver(callbackToogle);
observerToggle.observe(j);

/* Mostrar y Ocultar cover al desplegar menu */
function Cover() {
  if (Aside.classList.contains("menu-expanded")) {
    mainCover.style.visibility = "visible";
    mainCover.classList.toggle('isShow');

  }

  if (Aside.classList.contains("menu-collapsed")) {
    mainCover.style.visibility = "hidden";
    mainCover.classList.toggle('isShow');

  }
}

function addClassSideMenu() {
  Aside.classList.toggle("menu-expanded");
  Aside.classList.toggle("menu-collapsed");
  sideMenu.classList.toggle("menu-expanded");
  sideMenu.classList.toggle("menu-collapsed");
}

function showCloseCover(act, actFunct, Funct) {
  act = true;
  addClassSideMenu();
  Cover();
  if (actFunct) {
    Funct();
  }
};

// siguiente es el código para cambiar el botón de la barra lateral
function menuBtnChangeSide() {
  if (clickInterSide) {
    try {
      i.className = i.classList.contains('fa-bars') ? 'fa-solid fa-bars-staggered' : i.getAttribute('data-original');
    } catch { }
  }
}

function menuBtnChange() {
  if (clickInterBar) {
    try {
      j.className = j.classList.contains('fa-bars') ? 'fa-solid fa-bars-staggered' : j.getAttribute('data-original');
    } catch { }
  }
}

mainCover.addEventListener('click', () => {
  navBar.classList.toggle('Header-nav__isActive');
  showCloseCover(clickInterSide, actInterSide, menuBtnChangeSide);
  menuBtnChange();
});

btnSidemenu.addEventListener("click", () => {
  clickInterSide = true;
  showCloseCover(clickInterSide, actInterSide, menuBtnChangeSide);
});

btnToggle.addEventListener('click', function () {
  navBar.classList.toggle('Header-nav__isActive');
  clickInterBar = true;
  showCloseCover(clickInterBar, actInterBar, menuBtnChange);
});


// / ---- Desaparecer y aparecer el MENU BAR ---->
let ubicacionPrincipal = window.pageYOffset;

window.onscroll = function () {
  let Desplazamiento_Actual = window.pageYOffset;

  if (ubicacionPrincipal >= Desplazamiento_Actual) {
    document.getElementById('navbar').style.top = '0px';
    document.getElementById('navBar').style.top = 'var(--Size-height-navBar)';
    document.getElementById('sidemenu').style.top = 'var(--Size-height-navBar)';
  } else {
    document.getElementById('navbar').style.top = '-100px';
    document.getElementById('navBar').style.top = '0px';
    document.getElementById('sidemenu').style.top = '0px';
  }
  ubicacionPrincipal = Desplazamiento_Actual;
}

window.onresize = menuBtnChange();
