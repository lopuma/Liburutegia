//CAPTURAR INPUTS
const formEmail = document.getElementById("email")
const formFirtname = document.getElementById("firstname")
const formLastname = document.getElementById("lastname")
const formPass = document.getElementById("newPass");
const formPassRepeat = document.getElementById("newPassRepeat");
// --------------------------------------------------------------------------

const btnAccept = document.querySelector("#btnAccept");
const btnShowPass = document.getElementById("icon-eye-rPassword");
const btnShowPassRepeat = document.getElementById("icon-eye-rRepeat");

// CAPTURAR ICONOS DE LOS INPUTS
const iconEmail = document.getElementById("iconEmail");
const iconFirtname = document.getElementById("iconFirtname");
const iconLastname = document.getElementById("iconLastname");
const iconPass = document.getElementById("iconPass");
const iconPassRepeat = document.getElementById("iconPassRepeat");
const iconRol = document.getElementById("iconRol");
// --------------------------------------------------------------------------

var active = false;
var activeRepeat = false;
const formulario = document.getElementById("formRegister");
const inputs = document.querySelectorAll("#formRegister input");

document.addEventListener("DOMContentLoaded", function() {
  document
    .getElementById("formRegister")
    .addEventListener("submit", validateForms);
});

const expresiones = {
  usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
  nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
  password: /^.{4,12}$/, // 4 a 12 digitos.
  correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  telefono: /^\d{7,14}$/ // 7 a 14 numeros.
};

function validatePassword() {
  if (formPass.value == "") {
    document
      .querySelector(`#grupo__password .Error-p`)
      .classList.remove("errorActivo");
    return;
  } else if (formPass.value != formPassRepeat.value) {
    document
      .querySelector(`#grupo__password .Error-p`)
      .classList.add("errorActivo");
    return;
  } else {
    document
      .querySelector(`#grupo__password .Error-p`)
      .classList.remove("errorActivo");
    document
      .querySelector(`#grupo__password2 .Error-p`)
      .classList.remove("errorActivo");
    return true;
  }
}

function validateRepeatPassword() {
  if (formPassRepeat.value == "") {
    document
      .querySelector(`#grupo__password2 .Error-p`)
      .classList.remove("errorActivo");
    return;
  } else if (formPass.value != formPassRepeat.value) {
    document
      .querySelector(`#grupo__password2 .Error-p`)
      .classList.add("errorActivo");
    return;
  } else {
    document
      .querySelector(`#grupo__password .Error-p`)
      .classList.remove("errorActivo");
    document
      .querySelector(`#grupo__password2 .Error-p`)
      .classList.remove("errorActivo");
    return true;
  }
}

function validateEmail() {
    if (formEmail.value == ""){
        iconEmail.style.color = "var(--background-forms)";
    }else{
        iconEmail.style.color = "var(--succes-element)";
    }
}

function validateFirtname() {
    if (formFirtname.value == ""){
        iconFirtname.style.color = "var(--background-forms)";
    }else{
        iconFirtname.style.color = "var(--succes-element)";
    }
}

function validateLastname() {
    if (formLastname.value == ""){
        iconLastname.style.color = "var(--background-forms)";
    }else{
        iconLastname.style.color = "var(--succes-element)";
    }
}

function validateFormPassword(){
    var valuePass = validatePassword()
    var valuePassRepeat = validateRepeatPassword()

    console.log("PASS ", valuePass, "PASS REPEAT ", valuePassRepeat)
    if(valuePass && valuePassRepeat){
        iconPass.style.color = "var(--succes-element)";
        iconPassRepeat.style.color = "var(--succes-element)";
    }else{
        iconPass.style.color = "var(--background-forms)";
        iconPassRepeat.style.color = "var(--background-forms)";
    }
}

function validateForms(evento) {
  evento.preventDefault();
  if (formPass.value == "") {
    console.log("vacio ==>", formPass)
    return;
  } else if (formPassRepeat.value == "") {
    console.log("vacio ==>", formPass)
    return;
  } else if (formPass.value != formPassRepeat.value) {
    console.log("diferentes ==>", formPass.value)
    console.log("diferentes ==>", formPassRepeat.value)
    document
      .querySelector(`#grupo__password`)
      .classList.add("errorActivo");
    return;
  } else {
    document
      .querySelector(`#grupo__password2`)
      .classList.remove("errorActivo");
    document
      .querySelector(`#grupo__password`)
      .classList.remove("errorActivo");
    this.submit();
  }
}

const validarFormulario = e => {
  switch (e.target.name) {
    case "email":
        validateEmail();
      // validarCampo(expresiones.usuario, e.target, 'usuario');
      break;
    case "firstname":
        validateFirtname();
      //validarCampo(expresiones.nombre, e.target, 'nombre');
      break;
    case "lastname":
        validateLastname();
      // validarCampo(expresiones.password, e.target, 'password');
      break;
    case "newPass":
      validatePassword();
      validateFormPassword();
      console.log("VALIDATE",validatePassword())
      break;
    case "newPassRepeat":
      validateRepeatPassword();
      validateFormPassword();
      console.log("VALIDATE REPEAT",validateRepeatPassword())
      break;
  }
};

inputs.forEach(input => {
  input.addEventListener("keyup", validarFormulario);
  input.addEventListener("blur", validarFormulario);
});

btnShowPass.addEventListener("click", e => {
  console.log("click");

  if (active == false) {
    formPass.type = "text";
    btnShowPass.classList.replace("fa-eye", "fa-eye-slash");
    active = true;
    setTimeout(() => {
      formPass.type = "password";
      btnShowPass.classList.replace("fa-eye-slash", "fa-eye");
      active = false;
    }, 15000);
  } else {
    formPass.type = "password";
    btnShowPass.classList.replace("fa-eye-slash", "fa-eye");
    active = false;
  }
  e.preventDefault();
});

btnShowPassRepeat.addEventListener("click", e => {
  console.log("click");
  if (activeRepeat == false) {
    formPassRepeat.type = "text";
    btnShowPassRepeat.classList.replace("fa-eye", "fa-eye-slash");
    activeRepeat = true;
    setTimeout(() => {
      formPassRepeat.type = "password";
      btnShowPassRepeat.classList.replace("fa-eye-slash", "fa-eye");
      activeRepeat = false;
    }, 15000);
  } else {
    formPassRepeat.type = "password";
    btnShowPassRepeat.classList.replace("fa-eye-slash", "fa-eye");
    activeRepeat = false;
  }
  e.preventDefault();
});
