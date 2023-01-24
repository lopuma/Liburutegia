const post                  = document.querySelector ( ".Modal-post"        );
const widget                = document.querySelector ( ".Star-widget"       );
const btnCloseModal         = document.getElementById( "closeModal"         );
const modalInputPartnerID   = document.getElementById( "deliverPartnerID"   );
const modalInputBookID      = document.getElementById( "bookID"             );
const modalInputBookingID   = document.getElementById( "bookingID"          );
const formDeliver           = document.getElementById( "formDeliver"        );
const textarea              = document.getElementById( 'mensaje'            );
const contador              = document.getElementById( 'contador'           );

//TODO ✅ CONTADOR LINEAS
    textarea.addEventListener('input', function (e) {
        const target = e.target;
        const longitudMax = target.getAttribute('maxlength');
        const longitudAct = target.value.length;
        contador.innerHTML = `${longitudAct} / ${longitudMax}`;
    });

//TODO ✅ RESET DATA INPUTS DELIVER
    function resetRadioButtons(groupName) {
        var arRadioBtn = document.getElementsByName(groupName);
        for (var ii = 0; ii < arRadioBtn.length; ii++) {
            var radButton = arRadioBtn[ii];
            radButton.checked = false;
        }
        textarea.value = "";
        modalInputBookID.value = "";
        modalInputBookingID.value = "";
        widget.style.display = "block";
        post.style.display = "none";
    }

//TODO ✅ CLOSE MODAL
    btnCloseModal.addEventListener('click', async () => {
        resetRadioButtons("rate");
        $('#modalStar').modal('hide');
    });

//TODO ✅ VALIDAR FORMULARIO
    async function correctFormDeliver(e) {
        e.preventDefault();
        let activoFijo = $('input[name="rate"]:checked').val();
        const idBook = $('#bookID').val();
        const idBooking = $('#bookingID').val();
        const score = activoFijo;
        const review = textarea.value;
        const urlDeliver = `/api/books/deliver/${idBook}`;
        let dateActual = new Date();
        dateActual = moment(dateActual).format("YYYY-MM-DD HH:mm");
        const data = {
            idBooking,
            score,
            review,
            deliver_date_review: dateActual,
            reviewOn: 1
        }
        await fetch(urlDeliver, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then(async (data) => await responseDeliver(data));
    }

//TODO ✅ RESPUESTA DE LA ENTREGA DEL LIBRO
    async function responseDeliver(data) {
        const menssage = data.messageSuccess;
        const valuePartnerID = modalInputPartnerID.value;
        Swal.fire({
            icon: 'success',
            title: menssage,
            showConfirmButton: true,
            timer: 1500,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        }).then(async () => { 
            try {
                await inforActive(valuePartnerID);
            } catch (error) { }
            widget.style.display = "none";
            post.style.display = "block";
            contador.innerHTML = '0 / 100'
            resetRadioButtons("rate");
            await ClosePopup("#modalStar")
            location.reload(true);
        });
    }

//TODO ✅ EVENTO AL HACER SUBMIT
    document.addEventListener("DOMContentLoaded", function () {
        formDeliver.addEventListener("submit", correctFormDeliver);
    });