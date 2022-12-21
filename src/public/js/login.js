const url = '/reset';
const btnEyePassword = document.getElementById('btnEyePassword');
const btnEyePasswordNew = document.getElementById('btnEyePasswordNew');
const btnEyePasswordRepeat = document.getElementById('btnEyePasswordRepeat');
const inputPassword = document.getElementById('inputPassword');
const inputPasswordNew = document.getElementById('inputPasswordNew');
const inputPasswordRepeat = document.getElementById('inputPasswordRepeat');
const inputEmailReset = document.getElementById('inputEmailReset');
const formReset = document.getElementById('formReset');
const validationEmail = document.getElementById("validationEmail");
const inputEmailLogin = document.getElementById('inputEmailLogin');
const validationEmailReset = document.getElementById('validationEmailReset');
const validationPassword = document.getElementById("validationPassword");
const validationPasswordNew = document.getElementById('validationPasswordNew');
const validationPasswordRepeat = document.getElementById('validationPasswordRepeat');
const flip = document.getElementById('flip');
const inputsExists = document.getElementById('inputsExists');
const btnExists = document.getElementById('btnExists');
const btnReset = document.getElementById('btnReset');
const botonLogin = document.getElementById('botonLogin');
const linkForgot = document.getElementById('linkForgot');
const linkLogin = document.getElementById('linkLogin');
const alert2 = document.getElementById('alert2');
let messageValidation = document.getElementById('messageValidation');
let errorEmailReset = document.getElementById('errorEmailReset');
let errorPasswordNew = document.getElementById('errorPasswordNew');
let errorPasswordRepeat = document.getElementById('errorPasswordRepeat');
let valueCkeck = localStorage.getItem('flip');
let activeEyePassword = false;
let activeEyePasswordNew = false;
let activeEyePasswordRepeat = false;
let emailLocal = localStorage.getItem("emailLocal");
let emailLocalReset = localStorage.getItem("emailLocalReset");
const btnCloseAlert = document.getElementById('btnCloseAlert');
const alertReset = document.getElementById('alert2');


try {
    if (emailLocal) {
        inputEmailLogin.value = emailLocal;
        inputEmailLogin.focus();
        inputEmailLogin.select();
    } else if (emailLocalReset) {
        inputEmailLogin.value = emailLocalReset;
        inputEmailLogin.focus();
        inputEmailLogin.select();
    } else {
        inputEmailLogin.value = "";
    }
} catch (error) { }

try {
    if (emailLocalReset) {
        inputEmailReset.value = emailLocalReset;
        inputEmailReset.focus();
        inputEmailReset.select();
    } else {
        inputEmailReset.value = "";
    }
} catch (error) { }

//TODO CERRAR MENSAGE VALIDATIONS
function closeAlert() {
    try {
        alertReset.classList.remove('isEnable');
    } catch (error) { }
}
try {
    btnCloseAlert.addEventListener('click', () => {
        closeAlert();
    })
    setTimeout(() => {
        closeAlert();
    }, 5000);
} catch (error) { }


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

async function showPasswordNew(btnEye, elementInput) {
    if (activeEyePasswordNew === false) {
        elementInput.type = 'text';
        btnEye.classList.replace('fa-eye', 'fa-eye-slash');
        activeEyePasswordNew = true;
        setTimeout(() => {
            elementInput.type = 'password';
            btnEye.classList.replace('fa-eye-slash', 'fa-eye');
            activeEyePasswordNew = false;
        }, [1 * 60] * 1000);
    } else if (activeEyePasswordNew) {
        elementInput.type = 'password';
        btnEye.classList.replace('fa-eye-slash', 'fa-eye');
        activeEyePasswordNew = false;
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
        }, [1 * 60] * 1000); // 1 minuto
    } else if (activeEyePasswordRepeat) {
        elementInput.type = 'password';
        btnEye.classList.replace('fa-eye-slash', 'fa-eye');
        activeEyePasswordRepeat = false;
    }
}
// TODO CLEAR INPUST AND MESSAGES ERROR
function clearInputs() {
    inputEmailReset.value = '';
    inputPasswordNew.value = '';
    inputPasswordRepeat.value = '';
    inputsExists.classList.remove('isExists');
    validationEmailReset.classList.remove('isActive');
    inputEmailReset.classList.remove('isError');
    validationPasswordRepeat.classList.remove('isActive');
    validationPasswordNew.classList.remove('isActive');
    inputPasswordNew.classList.remove('isError');
    inputPasswordRepeat.classList.remove('isError');
    formReset.style.height = '24em';
}

function activeCheck() {
    valueCkeck = localStorage.getItem("flip");
    if (valueCkeck === "false") {
        btnExists.classList.remove("isEnable");
        btnExists.classList.add("isDisable");
        return resCheck = false;
    } else if (valueCkeck === "true") {
        btnExists.classList.add("isEnable");
        btnExists.classList.remove("isDisable");
        return resCheck = true;
    } else {
        return resCheck = null;
    }
}

// TODO CALL FUNCTION ACTIVE CHECK
resCheck = activeCheck();

if (valueCkeck === null) {
    flip.checked = false;
    localStorage.setItem("flip", flip.checked);
}

flip.checked = resCheck;
flip.addEventListener("change", function (e) {
    localStorage.setItem("flip", this.checked);
});

// TODO CLICK LINKS FORGOT / LOGIN
linkLogin.addEventListener('click', () => {
    btnExists.classList.add('isEnable')
    btnExists.classList.remove('isDisable')
    inputEmailReset.focus();
});

linkForgot.addEventListener('click', () => {
    btnExists.classList.add('isDisable')
    btnExists.classList.remove('isEnable')
    btnReset.classList.remove('isEnable')
    btnReset.classList.add('isDisable')
    clearInputs();
    inputEmailLogin.value = "";
    inputEmailLogin.focus();
});

// TODO VALIDATE ALL INPUTS
function validationsInputs() {
    if (inputEmailReset.value.length === 0 && inputsExists.classList.contains('isExists')) {
        errorEmailReset.innerHTML = 'Email cannot be empty.';
        validationEmailReset.classList.add('isActive');
        inputEmailReset.classList.add('isError');
        validationPasswordRepeat.classList.remove('isActive');
        validationPasswordNew.classList.remove('isActive');
        inputPasswordNew.classList.remove('isError');
        inputPasswordRepeat.classList.remove('isError');
        formReset.style.height = '40em';
        inputEmailReset.focus();
        return false;
    }
    // TODO CHECK
    if (inputEmailReset.value.length === 0 && !inputsExists.classList.contains('isExists')) {
        errorEmailReset.innerHTML = 'Email cannot be empty.';
        validationEmailReset.classList.add('isActive');
        inputEmailReset.classList.add('isError');
        inputEmailReset.focus();
        formReset.style.height = '27em';
        return false;
    } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(inputEmailReset.value) && !inputsExists.classList.contains('isExists')) {
        messageValidation.innerHTML = 'The Format Email address is incorrect.';
        alert2.classList.add('isEnable');
        validationEmailReset.classList.remove('isActive');
        inputEmailReset.classList.remove('isError')
        return false;
    } else if (!inputsExists.classList.contains('isExists')) {
        return true;
    }
    // TODO RESET
    if (inputPasswordNew.value.length < 5) {
        errorInputLength();
        inputPasswordRepeat.classList.remove('isError');
        validationPasswordNew.classList.add('isActive');
        errorPasswordNew.innerHTML = 'Password must contain the following: Minimun 5 characters.';
        validationPasswordRepeat.classList.remove('isActive');
        inputPasswordNew.classList.add('isError');
        inputPasswordNew.focus();
        inputPasswordNew.select();
        return false;
    } else if (inputPasswordRepeat.value.length < 5) {
        errorInputLength();
        inputPasswordNew.classList.remove('isError');
        validationPasswordRepeat.classList.add('isActive');
        errorPasswordRepeat.innerHTML = 'Password must contain the following: Minimun 5 characters.';
        inputPasswordRepeat.classList.add('isError');
        validationPasswordNew.classList.remove('isActive');
        inputPasswordRepeat.focus();
        inputPasswordRepeat.select();
        return false;
    } else if (inputPasswordNew.value !== inputPasswordRepeat.value) {
        errorEmailReset.innerHTML = '';
        validationEmailReset.classList.remove('isActive');
        inputEmailReset.classList.remove('isError');
        errorPasswordNew.innerHTML = 'Passwords do not match.';
        errorPasswordRepeat.innerHTML = 'Passwords do not match.';
        validationPasswordNew.classList.add('isActive');
        validationPasswordRepeat.classList.add('isActive');
        inputPasswordNew.classList.add('isError');
        inputPasswordRepeat.classList.add('isError');
        formReset.style.height = '44em';
        inputPasswordRepeat.focus();
        inputPasswordRepeat.select();
        return false;
    } else {
        validationPasswordRepeat.classList.remove('isActive');
        validationPasswordNew.classList.remove('isActive');
        inputPasswordNew.classList.remove('isError');
        inputPasswordRepeat.classList.remove('isError');
        formReset.style.height = '38em';
        return true;
    }


    function errorInputLength() {
        errorEmailReset.innerHTML = '';
        validationEmailReset.classList.remove('isActive');
        inputEmailReset.classList.remove('isError');
        formReset.style.height = '42em';
    }
}

// TODO RESTORE PASSWORD
async function checkedUser() {
    try {
        const data = {
            emailReset: inputEmailReset.value.toLowerCase().trim()
        }
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
            .then((response) => response.json())
            .then((data) => resetResponse(data))
            .catch((error) => console.error(error))
    } catch (error) {
        throw error
    }
}

// TODO CHECK USER EXISTS
async function checkUserExists() {
    let auth = validationsInputs();
    emailErrorReset = inputEmailReset.value;
    localStorage.setItem("emailLocalReset", emailErrorReset);
    if (auth) {
        await checkedUser();
    }
};

// TODO RESTORE PASSWORD
async function resetPassword() {
    try {
        const data = {
            emailReset: inputEmailReset.value,
            passReset: inputPasswordNew.value
        }
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
            .then((response) => response.json())
            .then((data) => resetResponse(data))
            .catch((error) => console.error(error))
    } catch (error) {
        throw error
    }
};

// TODO IT'S OK, RESET THE PASSWORD
async function resetUserPassword() {
    let auth = validationsInputs();
    emailErrorReset = inputEmailReset.value;
    localStorage.setItem("emailLocalReset", emailErrorReset);
    if (auth) {
        await resetPassword();
    }
};

// TODO DON'T EXISTS THE USER
async function userNoExists() {
    errorEmailReset.innerHTML = 'Your account could not be found in Liburutegia.';
    validationEmailReset.classList.add('isActive');
    inputEmailReset.classList.add('isError');
    btnExists.classList.add('isEnable')
    btnExists.classList.remove('isDisable');
    btnReset.classList.remove('isEnable');
    btnReset.classList.add('isDisable');
    alert2.classList.remove('isEnable');
    inputsExists.classList.remove('isExists');
    formReset.style.height = '27em';
    inputEmailReset.focus();
    inputEmailReset.select();
    return;
};

// TODO RESPONSE FOR USER RESET PASSWORD
async function resetResponse(data) {
    const { exists, inputs } = data;
    if (!exists && !inputs) {
        userNoExists();
    } else if (exists === true && inputs === true) {
        errorEmailReset.innerHTML = '';
        validationEmailReset.classList.remove('isActive');
        inputEmailReset.classList.remove('isError');
        btnExists.classList.add('isDisable');
        btnExists.classList.remove('isEnable');
        btnReset.classList.add('isEnable');
        btnReset.classList.remove('isDisable');
        validationPasswordNew.classList.remove('isActive');
        inputPasswordNew.value = '';
        inputPasswordNew.classList.remove('isError');
        validationPasswordRepeat.classList.remove('isActive');
        inputPasswordRepeat.value = '';
        inputPasswordRepeat.classList.remove('isError');
        inputsExists.classList.add('isExists');
        formReset.style.height = '38em';
        inputEmailReset.focus();
        inputEmailReset.select();
        if (data.errorValidation !== undefined) {
            alert2.classList.add('isEnable');
            messageValidation.innerHTML = data.errorValidation;
        }
        return;
    } else if (exists && !inputs) {
        btnExists.classList.remove('isDisable')
        btnExists.classList.remove('isEnable')
        btnReset.classList.remove('isEnable')
        btnReset.classList.add('isDisable')
        clearInputs();
        flip.checked = false;
        localStorage.setItem("flip", flip.checked);
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: data.successValidation,
            showConfirmButton: false,
            timer: 1000
        })
        try {
            validationEmail.classList.remove("isActive");
            inputEmailLogin.classList.remove("isError");
        } catch (error) { }
        try {
            validationPassword.classList.remove("isActive");
            inputPassword.classList.remove("isError");
        } catch (error) { }
        inputEmailLogin.value = emailLocalReset;
        inputEmailLogin.focus();
        inputEmailLogin.select();
        return;
    }
};

// TODO CLICK RESET PASSWORD
btnExists.addEventListener('click', async (e) => {
    e.preventDefault();
    await checkUserExists();
})

btnReset.addEventListener('click', async (e) => {
    e.preventDefault();
    await resetUserPassword();
});

botonLogin.addEventListener('click', (e) => {
    emailError = inputEmailLogin.value;
    localStorage.setItem("emailLocal", emailError);
});

// TODO ENTER RESET PASSWORD
document.addEventListener('keyup', async function (e) {
    if (e.key === 'Enter') {
        if (btnExists.classList.contains('isEnable')) {
            await checkUserExists();
        } else if (btnReset.classList.contains('isEnable')) {
            await resetUserPassword();
        }
    }
});

// TODO BUTTONS FOR SHOW / HIDDEN PASSWORD
btnEyePassword.addEventListener('click', () => {
    showPassword(btnEyePassword, inputPassword);
});

btnEyePasswordNew.addEventListener('click', () => {
    showPasswordNew(btnEyePasswordNew, inputPasswordNew);
});

btnEyePasswordRepeat.addEventListener('click', () => {
    showPasswordRepeat(btnEyePasswordRepeat, inputPasswordRepeat);
});