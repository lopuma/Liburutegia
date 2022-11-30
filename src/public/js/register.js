
let activeEyePassword = false;
let activeEyePasswordRepeat = false;
const url = '/register';
const inputPassNew          = document.getElementById  ( "inputPassNew"         );
const inputPassNewRepeat    = document.getElementById  ( "inputPassNewRepeat"   );
const btnAccept             = document.getElementById  ( "btnAccept"            );
const btnCancel             = document.getElementById  ( "btnCancel"            );
const btnEyePassword        = document.getElementById  ( "btnEyePassword"       );
const btnEyePasswordRepeat  = document.getElementById  ( "btnEyePasswordRepeat" );
const formRegister          = document.getElementById  ( "formRegister"         );
const inputEmailNew         = document.getElementById  ( 'inputEmailNew'        );
const inputUsername         = document.getElementById  ( 'inputUsername'        );
const inputFullName         = document.getElementById  ( 'inputFullName'        );
const inputs                = document.querySelectorAll( "#formRegister input"  );
const infos                 = document.querySelectorAll( ".Animation-info"      );
const closeInfos            = document.querySelectorAll( ".Animation-closeInfo" );
const fieldErrs             = document.querySelectorAll( ".fieldErr"            );
const fieldErrTexts         = document.querySelectorAll( ".fieldErrText"        );
const fields = {
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
    //email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    //phone: /^\d{7,14}$/ // 7 a 14 numeros.
};

const validarPassword = () => {
    if (inputPassNew.value !== inputPassNewRepeat.value) {
        document.getElementById('validationPassRepeat').classList.add('isActive');
        document.getElementById('errorPassRepeat').innerHTML = "Passwords do not match.";
        inputPassNewRepeat.classList.add('isError');
        fields['pass'] = false;
    } else {
        document.getElementById('validationPassRepeat').classList.remove('isActive');
        document.getElementById('errorPassRepeat').innerHTML = "";
        inputPassNewRepeat.classList.remove('isError');
        fields['pass'] = true;
    }
}

async function cancel() {
    window.location = '/workspace/admin'
}

async function responseRegister(data) {
    const exists = data.exists;
    const contentSwal = {
        text: data.message,
        backdrop: '#2C3333',
        timer: 5000,
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
    }
    if (!exists) {
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: data.message,
            backdrop: '#2C3333',
            timer: 5000,
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
            inputEmailNew.select();
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.message,
            backdrop: '#2C3333',
            timer: 5000,
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

async function validateField(expresion, input, fieldError, fieldErrorText, textError, field, info, closeInfo) {
    if (!expresion.test(input.value.trim())) {
        input.classList.add('isError');
        document.getElementById(info).classList.add('isVisible');
        fields[field] = false;
    } else {
        document.getElementById(fieldError).classList.remove('isActive');
        document.getElementById(fieldErrorText).innerHTML = "";
        input.classList.remove('isError');
        document.getElementById(info).classList.remove('isVisible');
        document.getElementById(closeInfo).classList.remove('isVisible');
        fields[field] = true;
    }
    infos.forEach((info, i) => {
        infos[i].addEventListener('click', () => {
            fieldErrs[i].classList.add('isActive');
            fieldErrTexts[i].innerHTML = textError;
            closeInfos[i].classList.add('isVisible');
        });
    });
    closeInfos.forEach((info, i) => {
        closeInfos[i].addEventListener('click', () => {
            fieldErrs[i].classList.remove('isActive');
            fieldErrTexts[i].innerHTML = "";
            closeInfos[i].classList.remove('isVisible');
        });
    });
}

async function fieldEmpty(expression, input, errorDivValidation, errorInputText, textEmailError, field, info, closeInfo) {
    if (input.value.trim() !== "") {
        await validateField(expression, input, errorDivValidation, errorInputText, textEmailError, field, info, closeInfo);
    } else {
        document.getElementById(errorDivValidation).classList.remove('isActive');
        document.getElementById(errorInputText).innerHTML = "";
        input.classList.remove('isError');
        document.getElementById(info).classList.remove('isVisible');
        document.getElementById(closeInfo).classList.remove('isVisible');
    }
    return;
}

const validateForms = async (e) => {
    switch (e.target.name) {
        case "inputEmailNew":
            let textEmailError = "Error: The format Email address is incorrect, the email can only contain letters, numbers, periods, hyphens and underscores.";
            await fieldEmpty(expresiones.email, e.target, 'validationEmailNew', 'errorEmailNew', textEmailError, 'email', 'infoEmail', 'closeInfoEmail');
            break;
        case "inputUsername":
            let textErrorUsername = "Error: The username must be between 4 and 16 digits and can only contain numbers, letters, and underscores and cannot contain spaces.";
            await fieldEmpty(expresiones.username, e.target, 'validationUserName', 'errorUserName', textErrorUsername, 'username', 'infoUsername', 'closeInfoUsername');
            break;
        case "inputFullName":
            let textErrorFullname = "Error: Full Name must have 4 to 40 digits and can contain letters, accents and spaces, cannot contain special characters.";
            await fieldEmpty(expresiones.fullname, e.target, 'validationFullName', 'errorFullName', textErrorFullname, 'fullname', 'infoFullname', 'closeInfoFullname');
            break;
        case "inputPassNew":
            let textErrorPassNew = "Error: The password does not meet the requirements of the password policy, it must be between 5 and 20 digits, it can contain letters, numbers and special characters.";
            await fieldEmpty(expresiones.password, e.target, 'validationPassNew', 'errorPassNew', textErrorPassNew, 'pass', 'infoPass', 'closeInfoPass');
            validarPassword();
            break;
        case "inputPassNewRepeat":
            validarPassword();
            break;
    }
};

inputs.forEach(input => {
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
    if (fields.email && fields.username && fields.fullname && fields.pass) {
        const data = {
            email: inputEmailNew.value,
            username: inputUsername.value,
            fullname: inputFullName.value,
            rol: document.getElementById("rol").value,
            pass: inputPassNew.value
        };
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }

        })
            .then((response) => response.json())
            .then((data) => responseRegister(data))
            .catch((error) => console.error(error));
    } else {
        window.alert("There are items required your attention.")
        if (!fields.email) {
            inputEmailNew.focus();
            inputEmailNew.select();
            inputEmailNew.classList.add('isError');
            document.getElementById('infoEmail').classList.add('isVisible');
            return;
        } else if (!fields.username) {
            inputUsername.focus();
            inputUsername.select();
            inputUsername.classList.add('isError');
            document.getElementById('infoUsername').classList.add('isVisible');
            return;
        } else if (!fields.fullname) {
            inputFullName.focus();
            inputFullName.select();
            inputFullName.classList.add('isError');
            document.getElementById('infoFullname').classList.add('isVisible');
            return;
        } else if (!fields.pass) {
            inputPassNew.focus();
            inputPassNew.select();
            inputPassNew.classList.add('isError');
            document.getElementById('infoPass').classList.add('isVisible');
            return;
        }
    }
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