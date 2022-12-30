const sliderCard = document.querySelectorAll(".Slider-card");
const sliderButton = document.querySelectorAll(".Slider-a");
const linesButton = document.querySelectorAll(".Slider-btn");
const bloque = document.querySelectorAll(".Info-bloque");
const tbodyHistory = document.getElementById("historyData");
const tbodyActive = document.getElementById("activeData");
const tbodyfamilyData = document.getElementById("familyData");
const infoBloqueHistory = document.getElementById("infoBloqueHistory");
const infoBloqueActive = document.getElementById("infoBloqueActive");
const bloqueInfo = document.getElementById("bloqueInfo");
let indice = 1;
var _PARTNERID = "";


// TODO ✅ DESVINCULAR PARTNER FAMILY
async function desvincular(familyID, familyDni, partnerDni) {
    const idFamily = familyID;
    const data = {
        familyDni,
        partnerDni
    };
    const urlDesvincular = `/api/familys/unbind/${idFamily}`;
    fetch(urlDesvincular, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8"
        }
    })
        .then((response) => response.json())
        .then((data) => {
            responseDesvincular(data);
        });
};
async function responseDesvincular(data) {
    const message = data.messageSuccess;
    const success = data.success;
    if (success) {
        Swal.fire({
            icon: "success",
            title: "Success",
            text: message,
            backdrop: "#2C3333",
            timer: 3000,
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
            location.reload();
        });
    }
};

//TODO ✅ CARGA DATA FAMILY
$(document).ready(function () {
    tablePartnerFamilys = $("#tablePartnerFamily").DataTable({
        'ordering': true,
        'destroy': true,
        'paging': true,
        'responsive': true,
        'order': [[0, "desc"]],
        'searching': true,
        'info': true,
        'lengthChange': true,
        'autoWidth': false,
        'select': true,
        'retrieve': true,
        //'dom': 'Bfrtip',
        lengthMenu: [[5, 10, 15], [5, 10, 15]],
        pageLength: 5,
        deferRender: true,
    });
});

//TODO ✅ INFORMATION
async function infor(partnerID) {
    idPartner = partnerID;
    indice = 1;
}

// DELIVER
// TODO ✅ ENTEGA DEL LIBRO
async function deliverBook(bookID, bookingID) {
    try {
        const idBook = bookID;
        const idBooking = bookingID;
        const urlDeliver = `/api/books/deliver/${idBook}`;
        let dateActual = new Date();
        dateActual = moment(dateActual).format("YYYY-MM-DD HH:mm");
        Swal.fire({
            title: 'Deliver',
            text: `Do you want to add a review, for the book : ${idBook} ?`,
            icon: 'warning',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#474E68',
            confirmButtonText: 'Yes',
            denyButtonText: `Don't review`,
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                $("#deliverPartnerID").val(_PARTNERID);
                $("#bookID").val(idBook);
                $("#bookingID").val(idBooking);
                $('#modalStar').modal('show');
            } else if (result.isDenied) {
                const data = {
                    idBooking,
                    score: 0,
                    review: null,
                    deliver_date_review: dateActual
                }
                fetch(urlDeliver, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8"
                    }
                })
                inforActive(_PARTNERID);
            }
        })
    } catch (error) {
        console.error(":error ", error)
    }
}

// INFO ACTIVE
// TODO ✅ RESERVAS ACTIVAS
async function inforActive(partnerID) {
    _PARTNERID = partnerID;
    indice = 2;
    const idPartner = partnerID;
    const urlActive = `/api/partners/info/${idPartner}`;
    try {
        spinnerActive.style.display = "inline-block";
        tableActiveReserved.destroy();
        tbodyActive.innerHTML = "";
    } catch (error) { }
    fetch(urlActive)
        .then(response => response.json())
        .then((data) => {
            setTimeout(() => {
                obtenerPartner(data)
            }, 1200);
        });
}
// TODO ✅ OBTENER INFORMACION DEL PARTNER Y BOOKINGS
async function obtenerPartner(data) {
    if (data.success === true) {
        tbodyActive.innerHTML = "";
        let dataActive = [];
        for (let elemento of data.data) {
            const reserved = elemento.reserved;
            const idBookingReview = elemento.bookingID_review;
            let reservationDate = moment(elemento.reservation_date).format("MMMM Do, YYYY HH:mm A");
            if (reserved === 1 && idBookingReview === null) {
                let myActivesReserves = Object.create(elemento);
                myActivesReserves['bookID'] = elemento.bookID;
                myActivesReserves['bookingID'] = elemento.bookingID;
                myActivesReserves['title'] = elemento.title;
                myActivesReserves['isbn'] = elemento.isbn;
                myActivesReserves['author'] = elemento.author;
                myActivesReserves['reservation_date'] = reservationDate;
                dataActive.push(myActivesReserves);
            }
        }
        createdTableActive(dataActive);
        return true;
    }
    createdTableActive(data);
}
// TODO ✅ CREAR TABLA
async function createdTableActive(data) {
    $(document).ready(function () {
        tableActiveReserved = $("#tablePartnerActive").DataTable({
            language: {
                emptyTable: "No data available in table of Active Reserves"
            },
            stateSave: true,
            searching: true,
            ordering: true,
            info: true,
            responsive: true,
            order: [[3, "desc"]],
            lengthMenu: [[5, 10, 15], [5, 10, 15]],
            pageLength: 5,
            deferRender: true,
            colReorder: true,
            select: true,
            retrieve: true,
            destroy: true,
            data: data,
            columns: [
                { data: "title" },
                { data: "isbn" },
                { data: "author" },
                { data: "reservation_date" },
                {
                    data: null,
                    render: function (data) {
                        return (
                            `
                                    <button id="btnDeliver" onClick=deliverBook(` + data.bookID + `,` + data.bookingID + `) class="btn btn-warning" title="Deliver Book">
                                            <i class="fa-regular fa-handshake"></i> Deliver Book
                                    </button>
                                    `
                        );
                    }
                },
            ],
            'autoWidth': true,
            'dom': 'Bfrtip',
            buttons: [
                {
                    extend: 'pageLength',
                },
                {
                    extend: 'colvis',
                },
                {
                    extend: 'collection',
                    text: 'Export Data',
                    autoClose: true,
                    buttons: [
                        //TODO COPY

                        {
                            extend: 'copy',
                            text: '<i class="fa fa-files-o"></i> Copy',
                            titleAttr: 'Copy',
                            className: "buttonCopy",
                            exportOptions: {
                                columns: [0, ':visible']
                            },
                            title: 'Liburutegia SAN MIGUEL: Active Reserves',
                        },
                        //TODO CSV
                        {
                            extend: 'csv',
                            text: '<i class="fa-solid fa-file-csv"></i> CSV',
                            titleAttr: 'Export CSV',
                            className: "buttonCsv",
                            exportOptions: {
                                columns: [0, 1, 2, 3]
                            },
                            title: 'Liburutegia SAN MIGUEL: Active Reserves',
                        },
                        //TODO EXCEL
                        {
                            extend: 'excel',
                            text: '<i class="fa fa-file-excel-o"></i> Excel',
                            titleAttr: 'Export Excel',
                            className: "buttonExcel",
                            exportOptions: {
                                columns: [0, 1, 2, 3]
                            },
                            title: 'Liburutegia SAN MIGUEL: Active Reserves',
                        },
                        //TODO PDF
                        {
                            extend: 'pdfHtml5',
                            text: '<i class="fa-solid fa-file-pdf"></i> PDF',
                            customize: function (doc) {
                                doc.defaultStyle =
                                {
                                    font: 'Cairo',
                                };
                            },
                            titleAttr: 'Export PDF',
                            className: "buttonPdf",
                            exportOptions: {
                                columns: [0, 1, 2, 3]
                            },
                            title: 'Liburutegia SAN MIGUEL: Active Reserves',
                            customize: function (doc) {
                                doc.styles.title = {
                                    width: '100',
                                    color: 'black',
                                    fontSize: '16',
                                    background: '#CEEDC7',
                                    alignment: 'center'
                                }
                            },
                        },
                        {
                            extend: 'print',
                            text: '<i class="fa-solid fa-print"></i> Print',
                            titleAttr: 'Print',
                            className: "buttonPrint",
                            exportOptions: {
                                columns: [0, 1, 2, 3]
                            },
                            title: 'Liburutegia SAN MIGUEL: Active Reserves',
                        }
                    ]
                },
            ],
        });
    });
    spinnerActive.style.display = "none";
}

// INFO HISTORY
//TODO ✅ INFORMATION HISTORY RESERVED
async function inforHistory(partnerID) {
    //_PARTNERID = partnerID;
    indice = 3;
    const idPartner = partnerID;
    const urlHistory = `/api/partners/info/${idPartner}`;
    try {
        spinnerHistory.style.display = "inline-block";
        tableHistoryReserved.destroy();
        tbodyHistory.innerHTML = "";
    } catch (error) { }
    fetch(urlHistory)
        .then(response => response.json())
        .then((data) => {
            setTimeout(() => {
                obtenerHistory(data)
            }, 1200);
        });
}
// TODO ✅ OBTENER HISTORY
async function obtenerHistory(data) {
    if (data.success === true) {
        tbodyHistory.innerHTML = "";
        let dataHistory = [];
        for (let elemento of data.data) {
            const starTotal = 5;
            const reserved = elemento.reserved;
            const idBookingReview = elemento.bookingID_review;
            let reservationDate = moment(elemento.reservation_date).format("MMMM Do, YYYY HH:mm A");
            let deliverDateReview = moment(elemento.deliver_date_review).format("MMMM Do, YYYY HH:mm A");
            const starPercentage = elemento.score / starTotal * 100;
            const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
            if (reserved === 0 || (reserved === 1 && idBookingReview !== null)) {
                let myHistoryReserves = Object.create(elemento);
                myHistoryReserves['bookID'] = elemento.bookID;
                myHistoryReserves['bookingID'] = elemento.bookingID;
                myHistoryReserves['title'] = elemento.title;
                myHistoryReserves['isbn'] = elemento.isbn;
                myHistoryReserves['author'] = elemento.author;
                myHistoryReserves['reservation_date'] = reservationDate;
                myHistoryReserves['deliver_date_review'] = deliverDateReview;
                myHistoryReserves['score'] = starPercentageRounded;
                myHistoryReserves['review'] = elemento.review
                dataHistory.push(myHistoryReserves);
            }
        }
        createdTableHistory(dataHistory);
        return true;
    }
    createdTableHistory(data);
}
// TODO ✅ CREAR TABLA HISTORY
async function createdTableHistory(data) {
    $(document).ready(function () {
        tableHistoryReserved = $("#tablePartnerHistory").DataTable({
            language: {
                emptyTable: "No data available in table of Reservation History"
            },
            stateSave: true,
            searching: true,
            ordering: true,
            info: true,
            responsive: true,
            order: [[4, "desc"]],
            lengthMenu: [[5, 10, 15], [5, 10, 15]],
            pageLength: 5,
            deferRender: true,
            colReorder: true,
            select: true,
            retrieve: true,
            destroy: true,
            data: data,
            dataSrc: "data",
            columns: [
                { data: "title" },
                { data: "isbn" },
                { data: "author" },
                { data: "reservation_date" },
                { data: "deliver_date_review" },
                {
                    data: null,
                    render: (data) => {
                        let dtScore = parseInt(data.score);
                        let point = Math.round(dtScore / 20);
                        return (
                            `<div class="stars-outer">
                                            <div class="stars-inner" style="width: ${data.score}; cursor: pointer" title="score ${point} star">
                                            </div>
                                        </div>
                                        `
                        );
                    }
                },
                { data: "review" },
            ],
            'autoWidth': true,
            'dom': 'Bfrtip',
            buttons: [
                {
                    extend: 'pageLength',
                },
                {
                    extend: 'colvis',
                },
                {
                    extend: 'collection',
                    text: 'Export Data',
                    autoClose: true,
                    buttons: [
                        //TODO COPY
                        {
                            extend: 'copy',
                            text: '<i class="fa fa-files-o"></i> Copy',
                            titleAttr: 'Copy',
                            className: "buttonCopy",
                            exportOptions: {
                                columns: [0, ':visible']
                            },
                            title: 'Liburutegia SAN MIGUEL: Reservation History',
                        },
                        //TODO CSV
                        {
                            extend: 'csv',
                            text: '<i class="fa-solid fa-file-csv"></i> CSV',
                            titleAttr: 'Export CSV',
                            className: "buttonCsv",
                            exportOptions: {
                                columns: [0, 1, 2, 3, 4, 5, 6]
                            },
                            title: 'Liburutegia SAN MIGUEL: Reservation History',
                        },
                        //TODO EXCEL
                        {
                            extend: 'excel',
                            text: '<i class="fa fa-file-excel-o"></i> Excel',
                            titleAttr: 'Export Excel',
                            className: "buttonExcel",
                            exportOptions: {
                                columns: [0, 1, 2, 3, 4, 5, 6]
                            },
                            title: 'Liburutegia SAN MIGUEL: Reservation History',
                        },
                        //TODO PDF
                        {
                            extend: 'pdfHtml5',
                            text: '<i class="fa-solid fa-file-pdf"></i> PDF',
                            customize: function (doc) {
                                doc.defaultStyle =
                                {
                                    font: 'Cairo',
                                };
                            },
                            titleAttr: 'Export PDF',
                            className: "buttonPdf",
                            exportOptions: {
                                columns: [0, 1, 2, 3, 4, 5, 6]
                            },
                            title: 'Liburutegia SAN MIGUEL: Reservation History',
                            customize: function (doc) {
                                doc.styles.title = {
                                    width: '100',
                                    color: 'black',
                                    fontSize: '16',
                                    background: '#CEEDC7',
                                    alignment: 'center'
                                }
                            },
                        },
                        {
                            extend: 'print',
                            text: '<i class="fa-solid fa-print"></i> Print',
                            titleAttr: 'Print',
                            className: "buttonPrint",
                            exportOptions: {
                                columns: [0, 1, 2, 3, 4, 5, 6]
                            },
                            title: 'Liburutegia SAN MIGUEL: Reservation History',
                        }
                    ]
                },
            ],
        });
    });
    spinnerHistory.style.display = "none";
}

// ACTIVAR BUTTON / SLIDER
// TODO ✅ ACTIVA EL SLIDER ACTUAL
async function muestraSlides(n) {
    let i;
    if (n > sliderButton.length) {
        indice = 1;
    }
    if (n < 1) {
        indice = sliderButton.length;
    }
    if (n === 4) {
        n = 1;
        indice = 1;
    }

    for (i = 0; i < sliderButton.length; i++) {
        //sliderButton[i].style.display = "none";
        sliderButton[i].classList.remove("isActivo");
        linesButton[i].classList.remove("isActive");
        sliderCard[i].classList.remove("isActive");
        bloque[i].classList.remove("isActivo");
        bloque[i].classList.remove("isAuto");
    }
    sliderButton[indice - 1].style.display = "flex";
    sliderButton[indice - 1].classList.add("isActivo");
    linesButton[indice - 1].classList.add("isActive");
    sliderCard[indice - 1].classList.add("isActive");
    bloque[indice - 1].classList.add("isActivo");
    bloque[indice - 1].classList.add("isAuto");

}
// TODO ✅ AVANZAR ENTRE LOS SLIDERS
async function avanzaSlide(n, idPartner) {
    muestraSlides((indice += n));
    try {
        if (indice === 1) {
            infor(idPartner)
        } else if (indice === 2) {
            inforActive(idPartner)
        } else if (indice === 3) {
            inforHistory(idPartner)
        }
    } catch (error) {
        console.error(error);
    }
}
//TODO ✅ ACTIVAR BUTTONS
sliderButton.forEach((cadaLi, i) => {
    sliderButton[i].addEventListener("click", () => {
        sliderButton.forEach((cadaLi, i) => {
            sliderButton[i].classList.remove("isActivo");
            linesButton[i].classList.remove("isActive");
            sliderCard[i].classList.remove("isActive");
            bloque[i].classList.remove("isActivo");
            bloque[i].classList.remove("isAuto");
        });
        sliderButton[i].classList.add("isActivo");
        linesButton[i].classList.add("isActive");
        sliderCard[i].classList.add("isActive");
        bloque[i].classList.add("isActivo");
        bloque[i].classList.add("isAuto");
    });
});

// TODO ✅ ACTIVAR BUTTON LOW
linesButton.forEach((cadaLi, i) => {
    linesButton[i].addEventListener("click", () => {
        linesButton.forEach((cadaLi, i) => {
            sliderButton[i].classList.remove("isActivo");
            linesButton[i].classList.remove("isActive");
            sliderCard[i].classList.remove("isActive");
            bloque[i].classList.remove("isActivo");
            bloque[i].classList.remove("isAuto");
        });
        sliderButton[i].classList.add("isActivo");
        linesButton[i].classList.add("isActive");
        sliderCard[i].classList.add("isActive");
        bloque[i].classList.add("isActivo");
        bloque[i].classList.add("isAuto");
    });
});

async function reservedBook(partnerID) {
    const idPartner = partnerID;
    console.log("SE VA A RESERVAR ESTE LIBRO ==> ", idPartner);
};