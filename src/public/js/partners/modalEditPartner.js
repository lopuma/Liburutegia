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
                    focusElement();
                }
            } else {
                optionForm = 'updatePartner';
                dataPartner();
            }
        }); 
    } catch (error) { }

