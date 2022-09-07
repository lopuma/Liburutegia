// </ ----Colorear ITEM MENU ---->

// Variables MENU
const btnBook = document.getElementById('btnBook');
const btnBooking = document.getElementById('btnBooking');
const btnPartner = document.getElementById('btnPartner');
const btnAdmin = document.getElementById('btnAdmin');
const btnRecord = document.getElementById('btnRecord');

//Variables SIDE MENU
const btnHomeSidemenu = document.getElementById('btnHomeSidemenu');
const btnAdminSidemenu = document.getElementById('btnAdminSidemenu');
const btnBookSidemenu = document.getElementById('btnBookSidemenu');
const btnBookingSidemenu = document.getElementById('btnBookingSidemenu');
const btnPartnerSidemenu = document.getElementById('btnPartnerSidemenu');
const btnLoginSidemenu = document.getElementById('btnLoginSidemenu');

window.onload = onLoad();

function onLoad() {

  try {
    // HOME
    if ($('#stateHome').val() === '') { // 
      btnHomeSidemenu.classList.add('Sidemenu--isSelected');
    } else {
      btnHomeSidemenu.classList.remove('Sidemenu--isSelected');
    }
  } catch { }

  try {
    // LOGIN
    if ($('#stateLogin').val() === '') { // 
      btnLoginSidemenu.classList.add('Sidemenu--isSelected');
    } else {
      btnLoginSidemenu.classList.remove('Sidemenu--isSelected');
    }
  } catch { }

  try {
    // BOOKS
    if ($('#stateBooks').val() === '') { // 
      btnBook.classList.add('isSelected');
      btnBookSidemenu.classList.add('Sidemenu--isSelected');
    } else {
      btnBook.classList.remove('isSelected');
      btnBookSidemenu.classList.remove('Sidemenu--isSelected');
    }
  } catch { }

  try {
    // BOOKINGS
    if ($('#stateBookings').val() === '') { // 
      btnBooking.classList.add('isSelected');
      btnBookingSidemenu.classList.add('Sidemenu--isSelected');
    } else {
      btnBooking.classList.remove('isSelected');
      btnBookingSidemenu.classList.remove('Sidemenu--isSelected');
    }
  } catch { }

  try {
    // ADMIN
    if ($('#stateAdmin').val() === '') { // 
      btnAdmin.classList.add('isSelected');
      btnAdminSidemenu.classList.add('Sidemenu--isSelected');
    } else {
      btnAdmin.classList.remove('isSelected');
      btnAdminSidemenu.classList.remove('Sidemenu--isSelected');
    }
  } catch { }

  try {
    // RECORD
    if ($('#stateRecord').val() === '') { // 
      btnRecord.classList.add('isSelected');
    } else {
      btnRecord.classList.remove('isSelected');
    }
  } catch { }

  try {
    //PARTNERS
    if ($('#statePartner').val() === '') { // 
      btnPartner.classList.add('isSelected');
      btnPartnerSidemenu.classList.add('Sidemenu--isSelected');
    } else {
      btnPartner.classList.remove('isSelected');
      btnPartnerSidemenu.classList.remove('Sidemenu--isSelected');
    }
  } catch { }

}

// </ ---- Mostrar MENU en modo responsive ---->
const btnToggle = document.querySelector('#btnToggle');
const navBar = document.querySelector('#navBar');
btnToggle.addEventListener('click', function () {
  navBar.classList.toggle('Header-nav__isActive');
  clickInterBar = true;
  if(actInterBar){
    menuBtnChange();
  }
});

// </ ---- Expandir Side Menu ---->
const btnSidemenu = document.getElementById("btnSidemenu");
const sideMenu = document.querySelector(".Sidemenu");
const Aside = document.querySelector(".Aside");

var i = document.getElementById('fa-bars');
var j = document.getElementById('fa-bars--toggle');
let actInterSide = false;
let clickInterSide = false;
let actInterBar = false;
let clickInterBar = false

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

btnSidemenu.addEventListener("click", () => {
  Aside.classList.toggle("menu-expanded");
  Aside.classList.toggle("menu-collapsed");
  sideMenu.classList.toggle("menu-expanded");
  sideMenu.classList.toggle("menu-collapsed");
  clickInterSide = true;
  if(actInterSide){
    menuBtnChangeSide();
  }
});

// following are the code to change sidebar button(optional)
function menuBtnChangeSide() {
  if(clickInterSide){
    try {
      i.className = i.classList.contains('fa-bars') ? 'fa-solid fa-bars-staggered' : i.getAttribute('data-original');
    } catch { }
  }
}
function menuBtnChange() {
  if(clickInterBar){
  try {
    j.className = j.classList.contains('fa-bars') ? 'fa-solid fa-bars-staggered' : j.getAttribute('data-original');
  } catch { }
}
}


// </ ---- Desaparecer y aparecer el MENU ---->
let ubicacionPrincipal = window.pageYOffset;

window.onscroll = function () {
  let Desplazamiento_Actual = window.pageYOffset;

  if (ubicacionPrincipal >= Desplazamiento_Actual) {
    document.getElementById('navbar').style.top = '0px';
    document.getElementById('navBar').style.top = 'var(--size-height-navBar)';
    document.getElementById('sidemenu').style.top = 'var(--size-height-navBar)';
  } else {
    document.getElementById('navbar').style.top = '-100px';
    document.getElementById('navBar').style.top = '0px';
    document.getElementById('sidemenu').style.top = '0px';
  }
  ubicacionPrincipal = Desplazamiento_Actual;
}

window.onresize = menuBtnChange();
