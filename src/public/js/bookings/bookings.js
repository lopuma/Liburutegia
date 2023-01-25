const spinner = document.getElementById("spinner");


//TODO ✅ ACTIVAR CHECK SI ESTA ACTIVA VENTANA BOOK
try {
    if ($('#stateBookings').val() === '') { // 
        _STATEBOOKINGS = true;
    }
} catch (error) { }

//TODO ✅ SHOW DATA IN THE TABLE BOOK
async function loadDataBookings(data) {
    dataTableBookings = $("#tableBookings").DataTable({
        data: data,
        deferRender: true,
        searching: true,
        "info": true,
        "paging": true,
        "orderClasses": false,
        destroy: true,
        language: {
            emptyTable: "No data available in table Bookings"
        },
        stateSave: true,
        responsive: true,
        order: [[6, "desc"]],
        lengthMenu: [[5, 10, 15, 25, 50, -1], [5, 10, 15, 25, 50, 'ALL']],
        pageLength: 15,
        select: true,
        autoWidth: false,
        columns: [
            {
                data: null,
                render: (data) => {
                    return (fillZeros(data.bookingID));
                }, visible: false
            },
            {
                data: null, visible: false,
                render: (data) => {
                    return (fillZeros(data.bookID));
                }
            },
            {
                data: null,
                render: (data) => {
                    const title = accentNeutralise(data.title);
                    return (`
                            <a class='Links' href='/workspace/books/info/${data.bookID}' style="margin-left: 1em">${title}</a>`
                    );
                }
            },
            {
                data: null,
                render: (data) => {
                    const partnerDni = data.partnerDni;
                    return (`
                            <a class='Links' href='/workspace/partners/info/${data.partnerID}' style="margin-left: .5em">${partnerDni}</a>`
                    );
                }
            },
            {
                data: "fullname",
                render: (data) => {
                    return (
                        accentNeutralise(data)
                    );
                }
            },
            {
                data: "reserveDate", "searchable": false,
                render: (data) => {
                    return (moment(data).format("MMMM Do, YYYY"));
                }
            },
            {
                data: "deliver_date_review", "searchable": false,
                render: (data) => {
                    if (data !== null) {
                        date = (moment(data).format("MMMM Do, YYYY HH:mm"));
                    } else {
                        date = "";
                    }
                    return date;
                }
            },
            {
                data: null,
                render: (data, type) => {
                    if (type === "display") {
                        if (data.cancelReserved) {
                            delivered =
                                    '<span class="badge rounded-pill" style="cursor: pointer; font-size: 1em; padding: .5em;background-color : #FF8B8B; color: #4C3A51; font-weight: 100; margin-left : .55em">Cancel Reserve</span>';
                        } else {
                            if (data.delivered === 0) {
                                delivered =
                                    '<span class="badge rounded-pill" style="cursor: pointer; font-size: 1em; padding: .5em;background-color : #FFB26B; color: #001253; font-weight: 100; margin-left : .55em">Active Reserve</span>';
                            } else {
                                delivered =
                                    '<span class="badge rounded-pill" style="cursor: pointer; font-size: 1em; padding: .5em;background-color : #A2CDCD; color: #000000; font-weight: 100; margin-left : .55em">Reservation Completed</span>';
                            }
                        }
                        return delivered;
                    }
                    return data;
                }
            },
            {
                data: null,
                render: (data, type) => {
                    if (type === "display") {
                        const starTotal = 5;
                        const starPercentage = data.score / starTotal * 100;
                        const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
                        if (data.cancelReserved) {
                            deliveredBook = `
                            <div class="Review-on">
                                Reason for cancel  :<div class="Review-data" style="color: #3D0000">${data.cancelReason}</div>
                            </div>
                            `;
                        } else {
                            if (data.delivered === 1) {
                                let dtScore = parseInt(starPercentageRounded);
                                let point = Math.round(dtScore / 20);
                                if (data.reviewOn === 1) {
                                    if (data.review === "") {
                                        deliveredBook = `
                                        <div class="Review-on">
                                            <div class="Review-data" style="color: #557C55">No review has been written, but if the qualifications.</div>
                                            <div class="stars-outer">
                                                <div class="stars-inner" style="width: ${starPercentageRounded}; cursor: pointer" title="score ${point} star">
                                                </div>
                                            </div>
                                        </div>
                                        `;
                                    } else {
                                        deliveredBook = `
                                        <div class="Review-on">
                                            <span style="font-weight: 600">Review  :</span>
                                            <div class="Review-data" style="color: #3D0000">${data.review}</div>
                                            <span style="font-weight: 600">Score  :</span>
                                            <div class="stars-outer">
                                                <div class="stars-inner" style="width: ${starPercentageRounded}; cursor: pointer" title="score ${point} star">
                                                </div>
                                            </div>
                                        </div>
                                        `
                                    }
                                } else {
                                    deliveredBook = `<div style="color: #E64848">There is no review or rating.</div>`;
                                }
                            } else {
                                deliveredBook = "";
                            }
                        }
                        return deliveredBook;
                    }
                    return data;
                }
            },
            {
                data: null,
                render: (data, type) => {
                    if (type === "display") {
                        const starTotal = 5;
                        const starPercentage = data.score / starTotal * 100;
                        const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
                        if (data.delivered === 0) {
                            deliveredBook = `
                            <button id="btnDeliver" onClick="deliverBooking(${data.bookID},${data.bookingID}, ${data.partnerID})" class="btn btn-warning text-dark" title="Deliver Book"><i class="fa-regular fa-handshake"></i>  Deliver Book</button>

                            <button id="btnDeliver" onClick="cancelReservation(${data.bookID},${data.bookingID})" class="btn btn-danger text-light" title="Cancel Reservation"><i class="fa-solid fa-calendar-xmark"></i>  Cancel Reservation</button>`
                        } else { 
                            deliveredBook = "";
                        }
                        return deliveredBook;
                    }
                    return data;
                }
            }
        ],
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
                        title: 'Liburutegia SAN MIGUEL: BOOKINGS',
                    },
                    //TODO CSV
                    {
                        extend: 'csv',
                        text: '<i class="fa-solid fa-file-csv"></i> CSV',
                        titleAttr: 'Export CSV',
                        className: "buttonCsv",
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7]
                        },
                        title: 'Liburutegia SAN MIGUEL: BOOKINGS',
                    },
                    //TODO EXCEL
                    {
                        extend: 'excel',
                        text: '<i class="fa fa-file-excel-o"></i> Excel',
                        titleAttr: 'Export Excel',
                        className: "buttonExcel",
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7]
                        },
                        title: 'Liburutegia SAN MIGUEL: BOOKINGS',
                    },
                    //TODO PDF
                    {
                        extend: 'pdfHtml5',
                        orientation: 'landscape',
                        pageSize: 'LEGAL',
                        text: '<i class="fa-solid fa-file-pdf"></i> PDF',
                        titleAttr: 'Export PDF',
                        className: "buttonPdf",
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7]
                        },
                        title: 'Liburutegia SAN MIGUEL: BOOKINGS',
                        customize: function (doc) {
                            doc.styles.title = {
                                width: '100',
                                color: 'black',
                                fontSize: '16',
                                background: '#CEEDC7',
                                alignment: 'center'
                            };
                        },
                    },
                    {
                        extend: 'print',
                        text: '<i class="fa-solid fa-print"></i> Print',
                        titleAttr: 'Print',
                        className: "buttonPrint",
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7]
                        },
                        title: 'Liburutegia SAN MIGUEL: BOOKINGS',
                    }
                ]
            },
        ],
    });
};

//TODO ✅ FETCH RELOAD DATA BOOKINGS
const reloadDataBookings = async () => {
    if (_STATEBOOKINGS) {
        const urlLoad = "/api/bookings/";
        const data = await fetch(urlLoad)
            .then((response) => response.json())
            .then((datos) => datos);
        loadDataBookings(data);
    }
};

//TODO ✅ FETCH LOAD DATA BOOKINGS
(async () => {
    await reloadDataBookings();
    try {
        spinner.style.display = "none";
    } catch (error) { }
})();

//TODO CANCELAR RESERVA
async function cancelReservation(idBook, idBooking) {
    const bookID = idBook;
    const bookingID = idBooking;
    console.log({
        bookID,
        bookingID,
    })
    const urlCancel = `/api/bookings/cancel/${bookID}`;
    Swal.fire({
        title: 'Submit your reason why the reservation is canceled',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        preConfirm: (cancelReason) => {
            if(cancelReason === "") {
                Swal.showValidationMessage(
                    `Request failed: Reason is required`
                )
            } else {
                //TODO AQIO EÑ FETCH
                const data = {
                    bookID,
                    bookingID,
                    cancelReason
                }
                return fetch(urlCancel, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {'Content-Type': 'application/json'
                }
                })
                .then((response) => response.json())
                .then((data) => console.log(data));
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
        }).then(async (result) => {
            if (result.isConfirmed) {
                console.log('Reservation', result);
                Swal.fire({
                title: `Cancelled reservation.`
                });
                await reloadDataBookings();
            }
        })
}

// TDDO DELIVER BOOK
async function deliverBooking(idBook, idBooking, idPartner) {
    const bookID = idBook;
    const bookingID = idBooking;
    const partnerID = idPartner;
    try {
        _PARTNERID = partnerID;
    } catch (error) { }
    await deliverBook(idBook, idBooking);
}