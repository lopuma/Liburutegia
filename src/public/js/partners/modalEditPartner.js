const formEditPartner = document.getElementById  ( "formEditPartner"        );
const inputs          = document.querySelectorAll( "#formEditPartner input" );

// TODO ✅ EVENTO AL ENVIAR FORMULARIO
    try {
        document.addEventListener("DOMContentLoaded", function () {
            formEditPartner.addEventListener("submit", correctForms);
        });
    } catch (error) { }

//TODO ✅ RECORRER TODO LOS INPUTS DEL FORMULARIO
    try {
        inputs.forEach((input, i) => {
            input.addEventListener("blur", validateForms);
            input.addEventListener("keyup", validateForms);
            input.addEventListener("keypress", e => {
                if (e.key === "Enter") {
                    validateForms;
                }
            });
        });
    } catch (error) { }

    try {
        document.getElementById("btnUpdate").addEventListener('click', async (e) => {
            e.preventDefault();
            if (fieldChange['dni'] || fieldChange['name'] || fieldChange['email'] || fieldChange['mobile'] || fieldChange['landline'] || fieldChange['lastname']) {
                if (field.dni && field.name && field.lastname && field.email && field.mobile && field.landline) {
                    optionForm = 'updatePartner';
                    await dataPartner();
                } else {
                    Swal.fire('There are items required your attention.')
                        .then(() => {
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
                        })
                }
            } else {
                optionForm = 'updatePartner';
                dataPartner();
            }
        }); 
    } catch (error) { }