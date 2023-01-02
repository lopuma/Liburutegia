const post = document.querySelector(".Modal-post");
const widget = document.querySelector(".Star-widget");
const btnCloseModal = document.getElementById("closeModal");
const modalInputPartnerID = document.getElementById("deliverPartnerID");
const modalInputBookID = document.getElementById("bookID");
const modalInputBookingID = document.getElementById("bookingID");
const formDeliver = document.getElementById("formDeliver");
const textarea = document.getElementById('mensaje');
const contador = document.getElementById('contador');

textarea.addEventListener('input', function (e) {
    const target = e.target;
    const longitudMax = target.getAttribute('maxlength');
    const longitudAct = target.value.length;
    contador.innerHTML = `${longitudAct} / ${longitudMax}`;
});

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

btnCloseModal.addEventListener('click', () => {
    $('#modalStar').modal('hide');
    resetRadioButtons("rate");
});

async function correctFormDeliver(e) {
    e.preventDefault();
    let activoFijo = $('input[name="rate"]:checked').val();
    const fecha = new Date();
    const idBook = $.trim($('#bookID').val());
    const idBooking = $.trim($('#bookingID').val());
    const score = activoFijo;
    const review = textarea.value;
    const urlDeliver = `/api/books/deliver/${idBook}`;
    let dateActual = new Date();
    dateActual = moment(dateActual).format("YYYY-MM-DD HH:mm");
    const data = {
        idBooking,
        score,
        review,
        deliver_date_review: dateActual
    }
    fetch(urlDeliver, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then((response) => response.json())
        .then((data) => responseDeliver(data));

}

async function responseDeliver(data) {
    console.log(data);
    const menssage = data.messageSuccess;

    const valuePartnerID = modalInputPartnerID.value;
    console.log({
        valuePartnerID,
        menssage
    });
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
    }).then((result) => { 
        widget.style.display = "none";
        post.style.display = "block";
        $('#modalStar').modal('hide');
        resetRadioButtons("rate");
        inforActive(valuePartnerID);
        contador.innerHTML = '0 / 100'
    });
}

document.addEventListener("DOMContentLoaded", function () {
    formDeliver.addEventListener("submit", correctFormDeliver);
});