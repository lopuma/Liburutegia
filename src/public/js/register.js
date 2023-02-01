let activeEyePassword = false;
let activeEyePasswordRepeat = false;
const urlAddUser = '/register';
const inputPassNew = document.getElementById("inputPassNew");
const inputPassNewRepeat = document.getElementById("inputPassNewRepeat");
const btnAccept = document.getElementById("btnAccept");
const btnCancel = document.getElementById("btnCancel");
const btnEyePassword = document.getElementById("btnEyePassword");
const btnEyePasswordRepeat = document.getElementById("btnEyePasswordRepeat");
const formRegister = document.getElementById("formRegister");
const inputEmailNew = document.getElementById('inputEmailNew');
const inputUsername = document.getElementById('inputUsername');
const inputFullName = document.getElementById('inputFullName');
const inputs = document.querySelectorAll("#formRegister input");
const infos = document.querySelectorAll(".Animation-info");
const closeInfos = document.querySelectorAll(".Animation-closeInfo");
const fieldErrs = document.querySelectorAll(".fieldErr");
const fieldErrTexts = document.querySelectorAll(".fieldErrText");

const field = {
    email: false,
    username: false,
    fullname: false,
    pass: false
}

const expresiones = {
    username: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
    fullname: /^[a-zA-ZÀ-ÿ\s]{4,40}$/, // Letras y espacios, pueden llevar acentos.
    password: /^.{5,20}$/, // 4 a 20 digitos.
    email: /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
};

const textError = {
    username: 
        "[ ERROR ] : Username must be between 4 and 16 digits and can only contain numbers, letters, and underscores and cannot contain spaces.",
    fullname: 
        "[ ERROR ] : Full name field must be between 4 to 40 digits and can contain letters, accents and spaces, it cannot contain special characters or numbers.",
    password: 
        "[ ERROR ] : Password does not meet the requirements of the password policy, it must be between 5 and 20 digits, it can contain letters, numbers and special characters.",    
    email: 
        "[ ERROR ] : The format Email address is incorrect, the Email can only contain letters, numbers, periods, hyphens and underscores."
};

const validarPassword = () => {
    if (inputPassNew.value !== inputPassNewRepeat.value) {
        document.getElementById('validationPassRepeat').classList.add('isActive');
        document.getElementById('errorPassRepeat').innerHTML = "Passwords do not match.";
        inputPassNewRepeat.classList.add('isError');
        field['pass'] = false;
    } else {
        document.getElementById('validationPassRepeat').classList.remove('isActive');
        document.getElementById('errorPassRepeat').innerHTML = "";
        inputPassNewRepeat.classList.remove('isError');
        field['pass'] = true;
    }
}

async function cancel() {
    window.location = '/workspace/admin'
}

//TODO ✅ RESPONSE ADD USER
async function responseRegister(data) {
    const exists = data.exists;
    if (!exists) {
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: data.messageSuccess,
            backdrop: '#2C3333',
            timer: 2000,
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#474E68',
            confirmButtonText: 'OK',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        }).then(() => {
            formRegister.reset();
            inputEmailNew.focus();
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.messageError,
            backdrop: '#2C3333',
            timer: 2000,
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#474E68',
            confirmButtonText: 'OK',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        }).then(() => {
            inputEmailNew.focus();
            inputEmailNew.select();
        });
    }
}

//TODO ✅ VALIDAR FIELDS
async function validateField(
    expresion,
    input,
    fieldError,
    fieldErrorText,
    textError,
    inputField,
    info,
    closeInfo
) {
    if (!expresion.test(input.value.trim())) {
        input.classList.add("isError");
        document.getElementById(info).classList.add("isVisible");
        field[inputField] = false;
    } else {
        document.getElementById(fieldError).classList.remove("isActive");
        document.getElementById(fieldErrorText).innerHTML = "";
        input.classList.remove("isError");
        document.getElementById(info).classList.remove("isVisible");
        document.getElementById(closeInfo).classList.remove("isVisible");
        field[inputField] = true;
    }

    infos.forEach((_info, i) => {
        infos[i].addEventListener("click", () => {
            fieldErrs[i].classList.add("isActive");
            fieldErrTexts[i].innerHTML = textError;
            infos[i].classList.remove("isVisible");
            closeInfos[i].classList.add("isVisible");
        });
    });

    closeInfos.forEach((_info, i) => {
        closeInfos[i].addEventListener("click", () => {
            fieldErrs[i].classList.remove("isActive");
            fieldErrTexts[i].innerHTML = "";
            closeInfos[i].classList.remove("isVisible");
        });
    });
}

//TODO ✅ VALIDACIONES EXPRESSIONES
async function fieldEmpty(
    expression, // EXPRESION DEL INPUT
    input, // EL IMPUT
    errorDivValidation, //EL DIV DODE MUESTRA EL ERROR
    errorInputText, // EL LABEL DEL ERROR
    textError, // EL TEXTO DEL ERROR
    inputField, //SI EL FIELD INPUT SEA TRUE O FALSE
    info, //BOTON QUE MUESTRA EL ERROR
    closeInfo // BOTON QUE CIERRA EL ERROR
) {
    if (input.value.trim() !== "") {
        await validateField(
            expression,
            input,
            errorDivValidation,
            errorInputText,
            textError,
            inputField,
            info,
            closeInfo
        );
    } else {
        document.getElementById(errorDivValidation).classList.remove("isActive");
        document.getElementById(errorInputText).innerHTML = "";
        input.classList.remove("isError");
        document.getElementById(info).classList.remove("isVisible");
        document.getElementById(closeInfo).classList.remove("isVisible");
    }
    return;
}

//TODO ✅ VALIDACIONES INPUTS NEW USER
const validateForms = async (e) => {
    switch (e.target.name) {
        case "inputEmailNew":
            await fieldEmpty(expresiones.email, e.target, 'validationEmailNew', 'errorEmailNew', textError.email, 'email', 'infoEmail', 'closeInfoEmail');
            break;
        case "inputUsername":
            await fieldEmpty(expresiones.username, e.target, 'validationUserName', 'errorUserName', textError.username, 'username', 'infoUsername', 'closeInfoUsername');
            break;
        case "inputFullName":
            await fieldEmpty(expresiones.fullname, e.target, 'validationFullName', 'errorFullName', textError.fullname, 'fullname', 'infoFullname', 'closeInfoFullname');
            break;
        case "inputPassNew":
            await fieldEmpty(expresiones.password, e.target, 'validationPassNew', 'errorPassNew', textError.password, 'pass', 'infoPass', 'closeInfoPass');
            validarPassword();
            break;
        case "inputPassNewRepeat":
            validarPassword();
            break;
    }
};

//TODO ✅ RECORRER TODO LOS INPUTS DEL FORMULARIO
inputs.forEach(_input => {
    inputs.forEach(input => {
        input.addEventListener("blur", validateForms);
        input.addEventListener("keyup", validateForms);
        input.addEventListener("keypress", (e) => {
            if (e.key === 'Enter') {
                validateForms;
            }
        });
    });
});

async function correctForms(e) {
    e.preventDefault();
    if (field.email && field.username && field.fullname && field.pass) {
        const data = {
            email: inputEmailNew.value.trim(),
            username: inputUsername.value.toUpperCase().trim(),
            fullname: capitalizeWords(inputFullName.value.trim()),
            rol: document.getElementById("rol").value,
            pass: inputPassNew.value.trim()
        };
        addNewUser(data);
    } else {
        window.alert("There are items required your attention.")
        if (!field.email) {
            document.getElementById('inputEmailNew').classList.add('isError');
            document.getElementById('infoEmail').classList.add('isVisible');
            inputEmailNew.focus();
            inputEmailNew.select();
            return;
        } else if (!field.username) {
            inputUsername.focus();
            inputUsername.select();
            inputUsername.classList.add('isError');
            document.getElementById('infoUsername').classList.add('isVisible');
            return;
        } else if (!field.fullname) {
            inputFullName.focus();
            inputFullName.select();
            inputFullName.classList.add('isError');
            document.getElementById('infoFullname').classList.add('isVisible');
            return;
        } else if (!field.pass) {
            inputPassNew.focus();
            inputPassNew.select();
            inputPassNew.classList.add('isError');
            document.getElementById('infoPass').classList.add('isVisible');
            return;
        }
    }
}

//TODO ✅ ADD NEW USER
async function addNewUser(data) {
    fetch(urlAddUser, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then(response => response.json())
        .then(data => responseRegister(data))
        .catch(error => console.error(error));
}

// TODO FUNCION PARA MOSTRAR O OCULTAR PASSWORD
async function showPassword(btnEye, elementInput) {
    if (activeEyePassword === false) {
        elementInput.type = 'text';
        btnEye.classList.replace('fa-eye', 'fa-eye-slash');
        activeEyePassword = true;
        setTimeout(() => {
            elementInput.type = "password";
            btnEye.classList.replace("fa-eye-slash", "fa-eye");
            activeEyePassword = false;
        }, [1 * 60] * 1000);
    } else if (activeEyePassword) {
        elementInput.type = 'password';
        btnEye.classList.replace('fa-eye-slash', 'fa-eye');
        activeEyePassword = false;
    }
}

async function showPasswordRepeat(btnEye, elementInput) {
    if (activeEyePasswordRepeat === false) {
        elementInput.type = 'text';
        btnEye.classList.replace('fa-eye', 'fa-eye-slash');
        activeEyePasswordRepeat = true;
        setTimeout(() => {
            elementInput.type = 'password';
            btnEye.classList.replace('fa-eye-slash', 'fa-eye');
            activeEyePasswordRepeat = false;
        }, [1 * 60] * 1000);
    } else if (activeEyePasswordRepeat) {
        elementInput.type = 'password';
        btnEye.classList.replace('fa-eye-slash', 'fa-eye');
        activeEyePasswordRepeat = false;
    }
}

// TODO BUTTONS FOR SHOW / HIDDEN PASSWORD
btnEyePassword.addEventListener('click', () => {
    showPassword(btnEyePassword, inputPassNew);
});

btnEyePasswordRepeat.addEventListener('click', () => {
    showPasswordRepeat(btnEyePasswordRepeat, inputPassNewRepeat);
});

document.addEventListener("DOMContentLoaded", function () {
    formRegister.addEventListener("submit", correctForms);
});