const infos = document.querySelectorAll(".Animation-info");
const closeInfos = document.querySelectorAll(".Animation-closeInfo");
const fieldErrs = document.querySelectorAll(".fieldErr");
const fieldErrTexts = document.querySelectorAll(".fieldErrText");
const inputBox = document.querySelectorAll(".Input-box");
const labelDniCheck = document.getElementById("labelDniCheck");
var chageDni = false;
var chageName = false;
var chageLastname = false;
let optionForm = "";
var checkedNew = false;
const field = {
    dni: false,
    //scanner: false,
    name: false,
    lastname: false,
    //direction: false,
    //population: false,
    mobile: true,
    landline: true,
    email: true,
};

const expresiones = {
    dni: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
    name: /^[a-zA-ZÀ-ÿ\s]{4,40}$/, // Letras, numeros, guion y guion_bajo
    lastname: /^[a-zA-ZÀ-ÿ\s]{4,40}$/,// Letras y espacios, pueden llevar acentos.
    //password: /^.{5,20}$/, // 4 a 20 digitos.
    email: /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
    //email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    mobile: /^\(?([0-9]{3})\)?([0-9]{3})?([0-9]{3})$/,
};

const textError = {
    dni:
        "[ ERROR ] : The DNI must be written in full, with the initial [8] digits and the final letter, without spaces or hyphens. Example 73523821F and not 73523821-F.<br/>[ ERROR ] : The NIE must be written with the initial X or T, all the numbers and the final letter, without spaces or hyphens.Example: X0523821F.",
    name:
        "[ ERROR ] : Name field must be between 4 to 40 digits and can contain letters, accents and spaces, it cannot contain special characters or numbers.",
    lastname:
        "[ ERROR ] : Last Name field must be between 4 to 40 digits and can contain letters, accents and spaces, it cannot contain special characters or numbers.",
    email: 
        "[ ERROR ] : The format Email address is incorrect, the Email can only contain letters, numbers, periods, hyphens and underscores.",
    mobile:
        "[ ERROR ] : Mobile field cannot contain letters or special characters, it must only contain [ 9 ] digits or empty.",
    landline:
        "[ ERROR ] : Landline field cannot contain letters or special characters, it must only contain [ 9 ] digits or empty.",
    
};

//TODO ✅ VALIDAR DNI ESPAÑOL
async function checkElement(elemID) {
    var elem = document.getElementById(elemID);
    document
        .getElementById("infoDni")
        .addEventListener("click", () => {
            inputBox[0].classList.add("isActiveError");
            inputBox[1].classList.add("isActiveError");
            document.getElementById("validationDni").classList.add("isActive");
            document.getElementById("errorDni").innerHTML = textError.dni;
            document
                .getElementById("infoDni").classList.remove("isVisible");
            document
                .getElementById("closeInfoDni").classList.add("isVisible");
        });
    document
        .getElementById("closeInfoDni")
        .addEventListener("click", () => {
            inputBox[0].classList.remove("isActiveError");
            inputBox[1].classList.remove("isActiveError");            document.getElementById("validationDni").classList.remove("isActive");
            document.getElementById("errorDni").innerHTML = "";
            document
                .getElementById("closeInfoDni").classList.remove("isVisible");
            document
                .getElementById("infoDni").classList.add("isVisible");
        });
    if (validateDni(elem.value.trim(), elemID) || elem.value.trim() == "") {
        elem.classList.remove("isError");
        document.getElementById('infoDni').classList.remove("isVisible");
        field['dni'] = true;
        return true;
    } else {
        elem.classList.add("isError");
        document.getElementById('infoDni').classList.add("isVisible");
        field['dni'] = false;
        $('errorDni').innerHTML = textError.dni;
        return false;
    }
    
}
function validateDni(value, elemID) {

    if (elemID == "inputDni") {

        var validChars = 'TRWAGMYFPDXBNJZSQVHLCKET';
        var nifRexp = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
        var nieRexp = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
        var str = value.toString().toUpperCase();

        if (!nifRexp.test(str) && !nieRexp.test(str)) return false;

        var nie = str
            .replace(/^[X]/, '0')
            .replace(/^[Y]/, '1')
            .replace(/^[Z]/, '2');

        var letter = str.substr(-1);
        var charIndex = parseInt(nie.substr(0, 8)) % 23;

        if (validChars.charAt(charIndex) === letter) return true;

        return false;
    } else {
        return /^[a-z]{3}[0-9]{6}[a-z]?$/i.test(value);
    }
}

//TODO ACTIVE CHECK DESDE EL LABEL
labelDniCheck.addEventListener('click', () => {
    inputDniCheck.checked ? inputDniCheck.checked = false : inputDniCheck.checked = true;
    activeSelectDniFamily();
});


//TODO ACTIVAR CHECK SI ES VENTA NEW PARTNER
try {
    if ($('#stateNewPartner').val() === '') { // 
        checkedNew = true;
    }
} catch (error) { }
try {
    if ($('#modalEditPartner').val() === '') { // 
        checkedNew = false;
    }
} catch (error) { }

// TODO ✅ VALIDAR FORMULARIOS
async function correctForms(e) {
    e.preventDefault();
    if (checkedNew) {
        if (field.dni && field.name && field.lastname && field.email && field.mobile && field.landline) {
            optionForm = 'newPartner';
            dataPartner();
        } else {
            window.alert("There are items required your attention.");
            if (!field.dni) {
                document.getElementById("inputDni").focus();
                document.getElementById("inputDni").select();
                document.getElementById("inputDni").classList.add("isError");
                document.getElementById("infoDni").classList.add("isVisible");
                return;
            } else if (!field.name) {
                document.getElementById("inputName").focus();
                document.getElementById("inputName").select();
                document.getElementById("inputName").classList.add("isError");
                document.getElementById("infoName").classList.add("isVisible");
                return;
            } else if (!field.lastname) {
                document.getElementById("inputLastname").focus();
                document.getElementById("inputLastname").select();
                document.getElementById("inputLastname").classList.add("isError");
                document.getElementById("infoLastname").classList.add("isVisible");
                return;
            } else if (!field.email) {
                inputEmailPartner.classList.add("isError");
                document.getElementById("infoEmail").classList.add("isVisible");
                document.getElementById("inputEmail").focus();
                document.getElementById("inputEmail").select();
                return;
            } else if (!field.mobile) {
                inputPhone.classList.add("isError");
                document.getElementById("infoMobile").classList.add("isVisible");
                document.getElementById("inputPhone").focus();
                document.getElementById("inputPhone").select();
                return;
            } else if (!field.landline) {
                inputPhoneLandline.classList.add("isError");
                document.getElementById("infoPhoneLandline").classList.add("isVisible");
                document.getElementById("inputPhoneLandline").focus();
                document.getElementById("inputPhoneLandline").select();
                return;
            }
        }
    } else {
        $("#inputDni").on("change", () => {
            chageDni = true;
        });
        $("#inputName").on("change", () => {
            chageName = true;
        });
        $("#inputLastname").on("change", () => {
            chageLastname = true;
        });
        if (chageDni || chageName || chageLastname) {
            if (field.dni || field.name || field.lastname) {
                optionForm = 'updatePartner';
                dataPartner();
            } else {
                window.alert("There are items required your attention.");
                if (!field.dni) {
                    inputDni.focus();
                    inputDni.select();
                    inputDni.classList.add("isError");
                    document
                        .getElementById("infoDni")
                        .classList.add("isVisible");
                    return;
                } else if (!field.name) {
                    inputName.focus();
                    inputName.select();
                    inputName.classList.add("isError");
                    document
                        .getElementById("infoName")
                        .classList.add("isVisible");
                    return;
                } else if (!field.lastname) {
                    inputLastname.focus();
                    inputLastname.select();
                    inputLastname.classList.add("isError");
                    document
                        .getElementById("infoLastname")
                        .classList.add("isVisible");
                    return;
                }
            }
        } else {
            optionForm = 'updatePartner';
            dataPartner();
        }
    }
}

// TODO ✅ OBTENER DATA FORMULARIOS PARA ADD
async function dataPartner() {
    const index = selectDni.selectedIndex;
    const actualDate = new Date();
    const date = moment(actualDate).format("YYYY-MM-DD HH:mm");
    const data = {
        inputPartnerID: $.trim($("#partnerID").val().trim()),
        inputDni: $.trim($("#inputDni").val().toUpperCase().trim()),
        inputName: $.trim($("#inputName").val().trim()),
        inputScanner: $.trim($("#inputScanner").val().trim()),
        inputLastname: $.trim($("#inputLastname").val().trim()),
        inputDirection: $.trim($("#inputDirection").val().trim()),
        inputPopulation: $.trim($("#inputPopulation").val().trim()),
        inputPhone: $.trim($("#inputPhone").val().trim()),
        inputPhoneLandline: $.trim($("#inputPhoneLandline").val().trim()),
        inputEmail: $.trim($("#inputEmail").val().toLowerCase().trim()),
        actualDate: date,
        updateDate: date
    };
    if (inputDniCheck.checked) {
        if (index === -1 || index === undefined) return;
        if (index === 0) {
            window.alert("Please select the DNI of the associated family member.");
            return;
        }
        const opcionSeleccionada = selectDni.options[index];
        const idPartnerFamily = opcionSeleccionada.value;
        const dniPartner = opcionSeleccionada.text;
        data.partnerID = idPartnerFamily;
        data.partnerDni = dniPartner;
        addNewPartner(data);
        selectDni.focus();
    } else {
        const idPartnerFamily = null
        const dniPartner = partnerActiveCheck;
        data.partnerID = idPartnerFamily;
        data.partnerDni = dniPartner;
        addNewPartner(data);
    }
}

//TODO ✅ ADD / UPDATE PARTNER
async function addNewPartner(data) {
    let idPartner = data.idPartnerFamily;
    let partnerID = data.inputPartnerID;
    if (optionForm === 'newPartner') {
        const urlAddPartner = `/api/partners/add/${idPartner}`;
        fetch(urlAddPartner, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(data => responseAddPartner(data))
            .catch(error => console.error(error));
    } else if (optionForm === 'updatePartner') {
        const realDate = document.getElementById("actualDate").value;
        const dateReal = moment(realDate).format("YYYY-MM-DD 00:00");
        const urlUpdate = `/api/partners/update/${partnerID}`;
        let partnerDataUpdate = [data];
        const updatedDataPartner = partnerDataUpdate.map(data => ({
            ...data,
            actualDate: dateReal
        }));
        fetch(urlUpdate, {
            method: "POST",
            body: JSON.stringify(updatedDataPartner),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
            })
            .then(response => response.json())
            .then(data => responseAddPartner(data))
            .catch(error => console.error(error));
    }
}

//TODO ✅ RESPONSE ADD PARTNER
async function responseAddPartner(data) {
    const success = data.success;
    if (success) {
        Swal.fire({
            icon: "success",
            title: "Success",
            text: data.messageSuccess,
            backdrop: "#2C3333",
            timer: 1500,
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#474E68",
            confirmButtonText: "OK",
            showClass: {
                popup: "animate__animated animate__fadeInDown"
            },
            hideClass: {
                popup: "animate__animated animate__fadeOutUp"
            }
        }).then(response => {
            
            $("#selectDni").html("");
            try {
                formAddPartner.reset();
            } catch (error) { }
            try {
                formEditPartner.reset();
            } catch (error) { }
            familyLink.classList.remove("isEnable");
            inputDni.focus();
        });
        try {
            setTimeout(() => {
                $('#modalEditPartner').hide();
                $('.modal-backdrop').hide();
                $('#modalEditPartner').modal('hide');
                dataTablePartners.ajax.reload();
                if ($('.modal:visible').length === 0) {
                    $('body').removeClass('modal-open');
                    document.querySelector('.Body').style = "";
                }
                if (!statePartner){
                    location.reload();
                }
            }, 1000);
        } catch (error) { }
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.errorMessage,
            backdrop: "#2C3333",
            timer: 5000,
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#474E68",
            confirmButtonText: "OK",
            showClass: {
                popup: "animate__animated animate__fadeInDown"
            },
            hideClass: {
                popup: "animate__animated animate__fadeOutUp"
            }
        }).then(() => {
            inputDni.focus();
            inputDni.select();
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


    infos.forEach((info, i) => {
        if (infos[i].getAttribute('id') !== 'infoDni') {
            infos[i].addEventListener("click", () => {
                inputBox[i].classList.add("isActiveError");
                try {
                    inputBox[i + 1].classList.add("isActiveError");
                } catch (error) { }
                // try {
                //     inputBox[i - 1].classList.add("isActiveError");
                // } catch (error) { }
                fieldErrs[i].classList.add("isActive");
                fieldErrTexts[i].innerHTML = textError;
                infos[i].classList.remove("isVisible");
                closeInfos[i].classList.add("isVisible");
            });
        }
    });

    closeInfos.forEach((info, i) => {
        if (closeInfos[i].getAttribute('id') !== 'closeInfoDni') {
            closeInfos[i].addEventListener("click", () => {
                inputBox[i].classList.remove("isActiveError");
                try {
                    inputBox[i + 1].classList.remove("isActiveError");
                } catch (error) { }
                // try {
                //     inputBox[i - 1].classList.remove("isActiveError");
                // } catch (error) { }
                fieldErrs[i].classList.remove("isActive");
                fieldErrTexts[i].innerHTML = "";
                closeInfos[i].classList.remove("isVisible");
            });
        }
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
        field[inputField] = true;
    }
    return;
}

//TODO ✅ VALIDACIONES INPUTS PARTNERS
const validateForms = async e => {
    switch (e.target.name) {
        case "inputDni":
            await checkElement('inputDni');
            break;
        case "inputName":
            await fieldEmpty(
                expresiones.name,
                e.target,
                "validationName",
                "errorName",
                textError.name,
                "name",
                "infoName",
                "closeInfoName"
            );
            break;
        case "inputLastname":
            await fieldEmpty(
                expresiones.lastname,
                e.target,
                "validationLastname",
                "errorLastname",
                textError.lastname,
                "lastname",
                "infoLastname",
                "closeInfoLastname"
            );
            break;
        case "inputEmail":
            await fieldEmpty(
                expresiones.email,
                e.target,
                "validationEmail",
                "errorEmail",
                textError.email,
                "email",
                "infoEmail",
                "closeInfoEmail"
            );
            break;
        case "inputPhone":
            await fieldEmpty(
                expresiones.mobile,
                e.target,
                "validationMobile",
                "errorMobile",
                textError.mobile,
                "mobile",
                "infoMobile",
                "closeInfoMobile"
            );
            break;
        case "inputPhoneLandline":
            await fieldEmpty(
                expresiones.mobile,
                e.target,
                "validationLandline",
                "errorLandline",
                textError.landline,
                "landline",
                "infoPhoneLandline",
                "closeInfoPhoneLandline"
            );
            break;
        }
};

//TODO ✅ RECORRER TODO LOS INPUTS DEL FORMULARIO
inputs.forEach((input, i) => {
    inputs.forEach((input, i) => {
        input.addEventListener("blur", validateForms);
        input.addEventListener("keyup", validateForms);
        input.addEventListener("keypress", e => {
            if (e.key === "Enter") {
                validateForms;
            }
        });
    });
});

function cerrar() {
    window.location.href = "/workspace/partners";
}

