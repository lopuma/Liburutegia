const btnBook = document.getElementById('btnBook');
const btnBooking = document.getElementById('btnBooking');
const btnPartner = document.getElementById('btnPartner');
const btnAdmin = document.getElementById('btnAdmin');
const btnAdminSidemenu = document.getElementById('btnAdminSidemenu');
const btnRecord = document.getElementById('btnRecord');

window.onload = onLoad();

function onLoad() {
  try {

    // BOOKS
    if ($('#stateBooks').val() === '') { // 
      btnBook.classList.add('isSelected');

    } else {
      btnBook.classList.remove('isSelected');
    }

    // BOOKINGS
    if ($('#stateBookings').val() === '') { // 
      btnBooking.classList.add('isSelected');
    } else {
      btnBooking.classList.remove('isSelected');
    }

    
    // ADMIN
    if ($('#stateAdmin').val() === '') { // 
      btnAdmin.classList.add('isSelected');
      btnAdminSidemenu.classList.add('Sidemenu--isSelected');
      
    } else {
      btnAdmin.classList.remove('isSelected');
      btnAdminSidemenu.classList.remove('Sidemenu--isSelected');
    }
    
    // RECORD
    if ($('#stateRecord').val() === '') { // 
      btnRecord.classList.add('isSelected');
    } else {
      btnRecord.classList.remove('isSelected');
    }

    //PARTNERS
    if ($('#statePartner').val() === '') { // 
      btnPartner.classList.add('isSelected');
    } else {
      btnPartner.classList.remove('isSelected');
    }

  } catch { }
}

// Mostrar MENU en modo responsive
const btnToggle = document.querySelector('#btnToggle');
const navBar = document.querySelector('#navBar');
btnToggle.addEventListener('click', function () {
  navBar.classList.toggle('Header-nav__isActive');
});

// Expandir Side Menu
const btnSidemenu = document.querySelector("#btnSidemenu");
const sideMenu = document.querySelector(".Sidemenu");
const Aside = document.querySelector(".Aside");
btnSidemenu.addEventListener("click", () => {
  // document.querySelector('.Footer').classList.toggle('body-expanded');
  // document.querySelector('.Main').classList.toggle('body-expanded');
  Aside.classList.toggle("menu-expanded");
  Aside.classList.toggle("menu-collapsed");
  sideMenu.classList.toggle("menu-expanded");
  sideMenu.classList.toggle("menu-collapsed");
});

// Desaparecer y aparecer el MENU
let ubicacionPrincipal = window.pageYOffset;
window.onscroll = function () {
  let Desplazamiento_Actual = window.pageYOffset;

  if (ubicacionPrincipal >= Desplazamiento_Actual) {
    document.getElementById('navbar').style.top = '0';
    document.getElementById('navBar').style.top = 'var(--size-height-navBar)';
    document.getElementById('sidemenu').style.top = 'var(--size-height-navBar)';
  } else {
    document.getElementById('navbar').style.top = '-100px';
    document.getElementById('navBar').style.top = '0';
    document.getElementById('sidemenu').style.top = '0px';
  }
}