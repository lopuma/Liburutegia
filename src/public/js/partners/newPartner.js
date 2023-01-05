const formAddPartner = document.getElementById  ( "formAddPartner"        );
const inputs         = document.querySelectorAll( "#formAddPartner input" );

// TODO ✅ EVENTO AL ENVIAR FORMULARIO
    try {
        document.addEventListener("DOMContentLoaded", function () {
            formAddPartner.addEventListener("submit", correctForms);
        });
    } catch (error) { }

//TODO ✅ RECORRER TODO LOS INPUTS DEL FORMULARIO
    try {
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
    } catch (error) { }