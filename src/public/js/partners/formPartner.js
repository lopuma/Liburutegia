const infos         = document.querySelectorAll( ".Animation-btnInfo"       );
const closeInfos    = document.querySelectorAll( ".Animation-btnCloseInfo"  );
const fieldErrs     = document.querySelectorAll( ".divFieldErr"             );
const fieldErrTexts = document.querySelectorAll( ".divFieldErrText"         );
const labelDniCheck = document.getElementById("labelDniCheck");

var chageDni = false;
var chageName = false;
var chageLastname = false;
let optionForm = "";
var checkedNew = false;

const field = {
    dni: false,
    name: false,
    lastname: false,
    mobile: true,
    landline: true,
    email: true,
};

const activesInfos = {
    name: false,
    lastname: false,
    mobile: false,
    landline: false
}

const expresiones = {
    dni: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
    name: /^[a-zA-ZÀ-ÿ\s]{4,40}$/, // Letras, numeros, guion y guion_bajo
    lastname: /^[a-zA-ZÀ-ÿ\s]{4,40}$/,// Letras y espacios, pueden llevar acentos.
    email: /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
    //email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/,
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

const fieldChange = {
    dni: false,
    name: false,
    lastname: false,
    email: false,
    mobile: false,
    landline: false,
}

//TODO ✅ VALIDAR DNI ESPAÑOL
    async function checkElement(elemID) {
        var elem = document.getElementById(elemID);
        document
            .getElementById("infoDni")
            .addEventListener("click", () => {
                document.getElementById('inputBoxDni').classList.add("isActiveErrorDni");
                document.getElementById('inputBoxScanner').classList.add("isActiveErrorDni");
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
                document.getElementById('inputBoxDni').classList.remove("isActiveErrorDni");
                document.getElementById('inputBoxScanner').classList.remove("isActiveErrorDni");
                document.getElementById("validationDni").classList.remove("isActive");
                document.getElementById("errorDni").innerHTML = "";
                document
                    .getElementById("closeInfoDni").classList.remove("isVisible");
                document
                    .getElementById("infoDni").classList.add("isVisible");
            });
        
        if (validateDni(elem.value.trim(), elemID) || elem.value.trim() == "") {
            elem.classList.remove("isError");
            document.getElementById('infoDni').classList.remove("isVisible");
            document.getElementById('inputBoxDni').classList.remove("isActiveErrorDni");
            document.getElementById('inputBoxScanner').classList.remove("isActiveErrorDni");
            document.getElementById("validationDni").classList.remove("isActive");
            document.getElementById("errorDni").innerHTML = "";
            document
                .getElementById("closeInfoDni").classList.remove("isVisible");
            document
            field['dni'] = true;
            return true;
        } else {
            elem.classList.add("isError");
            document.getElementById('infoDni').classList.add("isVisible");
            field['dni'] = false;
            document.querySelector('#errorDni').innerHTML = textError.dni;
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

//TODO ✅ ACTIVE CHECK DESDE EL LABEL
    labelDniCheck.addEventListener('click', async () => {
        inputDniCheck.checked ? inputDniCheck.checked = false : inputDniCheck.checked = true;
        await activeSelectDniFamily();
    });


//TODO ✅ ACTIVAR CHECK SI ES VENTA NEW PARTNER
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
    if (!checkedNew) {
        field['dni'] = true;
        field['name'] = true;
        field['lastname'] = true;
    }

// TODO ✅ ACTIVA EL FOCU DEL ELEMENTO QUE TIENE ERROR
    function focusElement() {
        console.log('Please select', field.dni);
        if (field.dni === false) {
            document.getElementById("inputDni").focus();
            document.getElementById("inputDni").select();
        } else if (!field.name) {
            document.getElementById("inputName").focus();
            document.getElementById("inputName").select();
        } else if (!field.lastname) {
            document.getElementById("inputLastname").focus();
            document.getElementById("inputLastname").select();
        } else if (!field.email) {
            document.getElementById("inputEmail").focus();
            document.getElementById("inputEmail").select();
        } else if (!field.mobile) {
            document.getElementById("inputPhone").focus();
            document.getElementById("inputPhone").select();
        } else if (!field.landline) {
            document.getElementById("inputPhoneLandline").focus();
            document.getElementById("inputPhoneLandline").select();
        }
        Swal.fire('There are items required your attention.');
    }

// TODO ✅ VALIDAR FORMULARIOS
    async function correctForms(e) {
        e.preventDefault();
        if (checkedNew) {
            if (field.dni && field.name && field.lastname && field.email && field.mobile && field.landline) {
                optionForm = 'newPartner';
                await dataPartner();
            } else {
                focusElement();
            }
        }
    }

    // TODO ✅ OBTENER DATA FORMULARIOS PARA ADD
    async function dataPartner() {
        const index = selectDni.selectedIndex;
        const actualDate = new Date();
        const date = moment(actualDate).format("YYYY-MM-DD HH:mm");
        const mail = document.querySelector("#inputEmail").value.trim();
        const emailCorrect = mail.replace(/@([^.]+\.[^.]+)$/, (match, domain) => {
            return "@" + domain.toLowerCase();
        });
        const data = {
            partnerID: document.querySelector("#partnerID").value.trim(),
            dni: document.querySelector("#inputDni").value.toUpperCase().trim(),
            name: capitalizeWords(document.querySelector("#inputName").value.trim()),
            scanner: document.querySelector("#inputScanner").value.trim(),
            lastname: capitalizeWords(document.querySelector("#inputLastname").value.trim()),
            direction: capitalizeFirstLetter(document.querySelector("#inputDirection").value.trim()),
            population: capitalizeFirstLetter(document.querySelector("#inputPopulation").value.trim()),
            phone1: document.querySelector("#inputPhone").value.trim(),
            phone2: document.querySelector("#inputPhoneLandline").value.trim(),
            email: emailCorrect,
            date: date,
            updateDate: date
        };
        if (inputDniCheck.checked) {
            if (index === -1 || index === undefined) return false;
            if (index === 0) {
                document.querySelector("#selectDni").focus();
                document.querySelector(".select2-selection--single").classList.add("isSelectError");
                Swal.fire('Please select the DNI of the associated family member.');
                return false;
            }
            const opcionSeleccionada = selectDni.options[index];
            const partnerIDFamily = opcionSeleccionada.value;
            const partnerDniFamily = opcionSeleccionada.text;
            data.partnerIDFamily = partnerIDFamily;
            data.partnerDniFamily = partnerDniFamily;
            await addNewPartner(data);
            selectDni.focus();
        } else {
            const idPartnerFamily = null
            const dniPartner = partnerActiveCheck;
            data.partnerIDFamily = idPartnerFamily;
            data.partnerDniFamily = dniPartner;
            await addNewPartner(data);
        }
    }

    //TODO ✅ ADD / UPDATE PARTNER
    async function addNewPartner(data) {
        let idPartner = data.partnerID;
        if (optionForm === 'newPartner') {
            const urlAddPartner = `/api/partners/add/${idPartner}`;
            await fetch(urlAddPartner, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
                .then(response => response.json())
                .then(async data => await responseAddPartner(data))
                .catch(error => console.error(error));
        } else if (optionForm === 'updatePartner') {
            const realDate = document.getElementById("actualDate").value;
            const dateReal = moment(realDate).format("YYYY-MM-DD 00:00");
            const urlUpdate = `/api/partners/update/${idPartner}`;
            let partnerDataUpdate = [data];
            const updatedDataPartner = partnerDataUpdate.map(data => ({
                ...data,
                date: dateReal
            }));
            await fetch(urlUpdate, {
                method: "POST",
                body: JSON.stringify(updatedDataPartner),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
                .then(response => response.json())
                .then(async data => await responseAddPartner(data))
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
                timer: 2000,
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
                $("#selectDni").html("");
                try {
                    formAddPartner.reset();
                } catch (error) { }
                try {
                    formEditPartner.reset();
                } catch (error) { }
                familyLink.classList.remove("isEnable");
                if (optionForm !== "newPartner") {
                    try {
                        $('#modalEditPartner').hide();
                        $('.modal-backdrop').hide();
                        $('#modalEditPartner').modal('hide');
                        if ($('.modal:visible').length === 0) {
                            $('body').removeClass('modal-open');
                            document.querySelector('.Body').style = "";
                        }
                        _STATEPARTNER ?
                            reloadData() :
                            location.reload();
                        fieldChange['dni'] = false;
                        fieldChange['name'] = false;
                        fieldChange['lastname'] = false;
                    } catch (error) { }
                }
                document.getElementById("inputDni").focus();
                document.getElementById("inputDni").select();
            });
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

    //TODO ✅ FUNCIONA PARA CAMBIAR DE INPUT
    function changeField(e, fieldChage) {
        fieldChange[fieldChage] = true;
        field[fieldChage] = false;
        e.addEventListener("blur", validateForms);
        e.addEventListener("keyup", validateForms);
        e.addEventListener("keypress", k => {
            if (k.key === "Enter") {
                validateForms;
            }
        });
    };

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

    //TODO ✅ CERRAR VISTA NEW PARTNER
    function cerrar() {
        window.location.href = "/workspace/partners";
    };

