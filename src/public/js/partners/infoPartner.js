const sliderCard        = document.querySelectorAll( ".Slider-card"      );
const sliderButton      = document.querySelectorAll( ".Slider-a"         );
const linesButton       = document.querySelectorAll( ".Slider-btn"       );
const bloque            = document.querySelectorAll( ".Info-bloque"      );
const tbodyHistory      = document.getElementById  ( "historyData"       );
const tbodyActive       = document.getElementById  ( "activeData"        );
const tbodyfamilyData   = document.getElementById  ( "familyData"        );
const infoBloqueHistory = document.getElementById  ( "infoBloqueHistory" );
const infoBloqueActive  = document.getElementById  ( "infoBloqueActive"  );
const bloqueInfo        = document.getElementById  ( "bloqueInfo"        );
let indice = 1;
var _PARTNERID = "";


// TODO ✅ DESVINCULAR PARTNER FAMILY
    async function desvincular(familyID, familyDni, partnerDni) {
        const idFamily = familyID;

        const data = {
            familyDni,
            partnerDni
        };

        const urlDesvincular = `/api/familys/unlink/${idFamily}`;
        
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, unlink it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await fetch(urlDesvincular, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json; charset=utf-8"
                    }
                })
                    .then((response) => response.json())
                    .then(async (data) => {
                        await responseDesvincular(data);
                    });
            }
        })
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
                timer: 2000,
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#474E68",
                confirmButtonText: "OK",
            }).then(() => {
                location.reload();
            });
        }
    };



//TODO ✅ INFORMATION
    async function infor(partnerID) {
        _PARTNERID = partnerID;
        idPartner = partnerID;
        indice = 1;
    }

// TODO ✅ RESERVAS ACTIVAS
    async function reloadDataActive(idPartner) {
        const urlActive = `/api/partners/info/${idPartner}`;
        const data = await fetch(urlActive)
            .then((response) => response.json())
            .then((datos) => datos);
        if (indice === 2) {
            await obtenerPartner(data);
            spinnerActive.style.display = "none";
        } else {
            await obtenerHistory(data);
            spinnerHistory.style.display = "none";
        }
    }
    async function inforActive(partnerID) {
        _PARTNERID = partnerID;
        indice = 2;
        spinnerActive.style.display = "inline-block";
        const idPartner = partnerID;
        await reloadDataActive(idPartner);
    }
    async function obtenerPartner(data) {
        if (data.success) {
            tbodyActive.innerHTML = "";
            let dataActive = [];
            for (let elemento of data.data) {
                const reserved = elemento.reserved;
                const idBookingReview = elemento.bookingID_review;
                let reservationDate = moment(elemento.reserveDate).format("MMMM Do, YYYY");
                if (reserved === 1 && idBookingReview === null) {
                    let myActivesReserves = Object.create(elemento);
                    myActivesReserves['bookID'] = elemento.bookID;
                    myActivesReserves['bookingID'] = elemento.bookingID;
                    myActivesReserves['title'] = elemento.title;
                    myActivesReserves['isbn'] = elemento.isbn;
                    myActivesReserves['author'] = elemento.author;
                    myActivesReserves['reserveDate'] = reservationDate;
                    dataActive.push(myActivesReserves);
                }
            }
            createdTableActive(dataActive);
            return true;
        }
        createdTableActive(data);
    }
    async function createdTableActive(data) {
        tableActiveReserved = $("#tablePartnerActive").DataTable({
            data: data,
            deferRender: true,
            searching: true,
            "info": true,
            "paging": true,
            "orderClasses": false,
            destroy: true,
            language: {
                emptyTable: "No data available in table of Active Reserves"
            },
            stateSave: true,
            responsive: true,
            order: [[3, "desc"]],
            lengthMenu: [[5, 10, 15], [5, 10, 15]],
            pageLength: 5,
            select: true,
            autoWidth: false,
            columns: [
                {
                    data: "bookingID", 
                    visible: false,
                    render : (data) => {
                        return (fillZeros(data));
                    }
                },
                {
                    data: "bookID",
                    render: (data) => {
                        const bookID = fillZeros(data);
                        return (bookID);
                    }
                },
                {
                    data: null,
                    render: (data) => {
                        const title = accentNeutralise(data.title);
                        return (
                            `<a class='Links'  href='/workspace/books/info/${data.bookID}' style="margin-left: 1em">${title}</a>`
                        );
                    }
                },
                { data: "isbn" },
                {
                    data: "author",
                    render : (data) => {
                        return (accentNeutralise(data));
                    }
                },
                { data : "reserveDate"   },
                {
                    data: null,
                    searchable: false,
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
                                columns: [0, 1, 2, 3, 4, 5]
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
                                columns: [0, 1, 2, 3, 4, 5]
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
                                columns: [0, 1, 2, 3, 4, 5]
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
                                columns: [0, 1, 2, 3, 4, 5]
                            },
                            title: 'Liburutegia SAN MIGUEL: Active Reserves',
                        }
                    ]
                },
            ],
        });
        $('#tablePartnerActive_filter input').focus();
    }

// INFO HISTORY
//TODO ✅ INFORMATION HISTORY RESERVED
    async function inforHistory(partnerID) {
        _PARTNERID = partnerID;
        indice = 3;
        spinnerHistory.style.display = "inline-block";
        const idPartner = partnerID;
        await reloadDataActive(idPartner);
    }
    async function obtenerHistory(data) {
        if (data.success) {
            tbodyHistory.innerHTML = "";
            let dataHistory = [];
            for (let elemento of data.data) {
                const starTotal = 5;
                const reserved = elemento.reserved;
                const idBookingReview = elemento.bookingID_review;
                let reservationDate = moment(elemento.reserveDate).format("MMMM Do, YYYY");
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
                    myHistoryReserves['reserveDate'] = reservationDate;
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
    async function createdTableHistory(data) {
        tableHistoryReserved = $("#tablePartnerHistory").DataTable({
            data: data,
            deferRender: true,
            searching: true,
            "info": true,
            "paging": true,
            "orderClasses": false,
            destroy: true,
            language: {
                emptyTable: "No data available in table of Reservation History"
            },
            stateSave: true,
            responsive: true,
            order: [[3, "desc"]],
            lengthMenu: [[5, 10, 15], [5, 10, 15]],
            pageLength: 5,
            select: true,
            autoWidth: false,
            columns: [
                {
                    data: "bookingID",
                    visible: false,
                    render: (data) => {
                        const bookingID = fillZeros(data);
                        return (bookingID);
                    }
                },
                {
                    data: "bookID",
                    render: (data) => {
                        const bookID = fillZeros(data);
                        return (bookID);
                    }
                },
                {
                    data: null,
                    render: (data) => {
                        const title = accentNeutralise(data.title);
                        return (
                            `<a class='Links'  href='/workspace/books/info/${data.bookID}' style="margin-left: 1em">${title}</a>`
                        );
                    }
                },
                { data: "isbn" },
                {
                    data: "author",
                    render: (data) => {
                        return (accentNeutralise(data));
                    }
                },
                { data: "reserveDate" },
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
                                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
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
                                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
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
                                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
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
                                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
                            },
                            title: 'Liburutegia SAN MIGUEL: Reservation History',
                        }
                    ]
                },
            ],
        });
        $('#tablePartnerHistory_filter input').focus();
    }

// ACTIVAR BUTTON / SLIDER
// TODO ✅ ACTIVA EL SLIDER ACTUAL
    async function muestraSlides(n) {
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

// TODO ✅ FUNCTION FOR RESERVE BOOK
    async function editBook(partnerID) {
        const idPartner = partnerID;
        edit(partnerID);
    };
// TODO ✅ FUNCTION FOR RESERVE BOOK
    async function reservedBook(idPartner, dniPartner) {
        const partnerID = idPartner;
        const partnerDni = dniPartner;
        await globalReserveBook(null, null, partnerID, partnerDni);
    };