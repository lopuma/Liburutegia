try {

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

} catch { }

let activeItemBooking = false;

console.log(activeItemBooking)
if (activeItemBooking) {
  console.log("activo")
}

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
      console.log('cargado')
      btnBook.classList.add('isSelected');

    } else {
      btnBook.classList.remove('isSelected');
    }

    // BOOKINGS
    if ($('#stateBookings').val() === '') { // 
      console.log('cargado')
      btnBooking.classList.add('isSelected');
    } else {
      btnBooking.classList.remove('isSelected');
    }

    
    // ADMIN
    if ($('#stateAdmin').val() === '') { // 
      console.log('cargado')
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
      console.log('cargado')
      btnPartner.classList.add('isSelected');
    
    } else {
      btnPartner.classList.remove('isSelected');
    }

  } catch { }
}

const btnToggle = document.querySelector('#btnToggle');
const navBar = document.querySelector('#navBar');

btnToggle.addEventListener('click', function () {
  navBar.classList.toggle('Header-nav__isActive');
});


const btnSidemenu = document.querySelector("#btnSidemenu");
const sideMenu = document.querySelector(".Sidemenu");
const Aside = document.querySelector(".Aside");
var active = false;
btnSidemenu.addEventListener("click", () => {

  // document.querySelector('.Footer').classList.toggle('body-expanded');
  // document.querySelector('.Main').classList.toggle('body-expanded');
  Aside.classList.toggle("menu-expanded");
  Aside.classList.toggle("menu-collapsed");
  sideMenu.classList.toggle("menu-expanded");
  sideMenu.classList.toggle("menu-collapsed");


});


let ubicacionPrincipal = window.pageYOffset;
console.log(ubicacionPrincipal);
window.onscroll = function () {
  console.log(ubicacionPrincipal);
  let Desplazamiento_Actual = window.pageYOffset;
  console.log(Desplazamiento_Actual);

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