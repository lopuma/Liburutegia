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
        order: [[0, "desc"]],
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
                            <a class='Links' href='/workspace/books/info/${data.bookID}'>${title}</a>`
                    );
                }
            },
            {
                data: "partnerDni",
                render: (data) => {
                    const partnerDni = data;
                    return (`
                            <a class='Links' href='/workspace/partners/info/${data}'>${partnerDni}</a>`
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
                data: "delivered",
                render: function (data, type) {
                    if (type === "display") {
                        if (data === 0) {
                            delivered =
                                '<span class="badge rounded-pill bg-light  text-danger" style="cursor: pointer; color: black; font-size: 1em; padding: 0.5em 1em;">Active Reserve</span>';
                        } else {
                            delivered =
                                '<span class="badge rounded-pill bg-success text-body" style="cursor: pointer; font-size: 1em; padding: 0.5em 1em;">Reservation Completed</span>';
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
                        console.log(data.delivered);
                        const starTotal = 5;
                        const starPercentage = data.score / starTotal * 100;
                        const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
                        if (data.delivered === 0) {
                            deliveredBook = `
                            <button id="btnDeliver" onClick="deliverBooking(${data.bookID},${data.bookingID}, ${data.partnerID})" class="btn btn-warning text-dark" title="Deliver Book"><i class="fa-regular fa-handshake"></i>  Deliver Book</button>

                            <button id="btnDeliver" onClick=cancelReservation(` + data.bookID + `,` + data.bookingID + `) class="btn btn-danger text-light" title="Cancel Reservation"><i class="fa-solid fa-calendar-xmark"></i>  Cancel Reservation</button>`
                        } else if (data.delivered === 1) {
                            let dtScore = parseInt(starPercentageRounded);
                            let point = Math.round(dtScore / 20);
                            console.log({
                                dtScore,
                                point,
                                starPercentageRounded
                            })
                            if (data.reviewOn === 1) {
                                deliveredBook = `
                                <div class="Review-on">
                                    <div class="Review-data">${data.review}</div>
                                    <div class="stars-outer">
                                        <div class="stars-inner" style="width: ${starPercentageRounded}; cursor: pointer" title="score ${point} star">
                                        </div>
                                    </div>
                                </div>
                                `
                            } else {
                                deliveredBook = `<div>There is no review</div>`;
                                
                            }
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
                            columns: [0, 1, 2, 3]
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
                            columns: [0, 1, 2, 3]
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
                            columns: [0, 1, 2, 3]
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
                            columns: [0, 1, 2, 3]
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
        bookingID
    })
}

// TDDO DELIVER BOOK
async function deliverBooking(idBook, idBooking, idPartner) {
    const bookID = idBook;
    const bookingID = idBooking;
    const partnerID = idPartner;
    window.location.href = "" + "#deliver-book";
    console.log({
        bookID,
        bookingID,
        partnerID
    })
    try {
        _PARTNERID = partnerID;
    } catch (error) { }
    await deliverBook(idBook, idBooking);
    
}