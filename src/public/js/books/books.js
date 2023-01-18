let opcion = "";
let _STATEBOOK = false;
let _STATENEWBOOK = false;
let _STATEEDITBOOK = false;
let _STATEINFOBOOK = false;

//TODO ✅ ACTIVAR CHECK SI ESTA ACTIVA VENTANA BOOK
    try {
        if ($('#stateBooks').val() === '') { // 
            _STATEBOOK = true;
        }
    } catch (error) { }

//TODO ✅ SHOW DATA IN THE TABLE BOOK
    async function loadDataBooks(data) {
        dataTableBooks = $("#tableBook").DataTable({
            data: data,
            deferRender: true,
            searching: true,
            "info": true,
            "paging": true,
            "orderClasses": false,
            destroy: true,
            language: {
                emptyTable: "No data available in table Books"
            },
            stateSave: true,
            responsive: true,
            order: [[9, "desc"]],
            lengthMenu: [[5, 10, 15, 25, 50, -1], [5, 10, 15, 25, 50, 'ALL']],
            pageLength: 15,
            select: true,
            autoWidth: false,
            columns: [
                {
                    data: null, "searchable": false,
                    render: (data) => {
                        return (fillZeros(data.bookID));
                    }
                },
                {
                    data: "title",
                    render: (data) => { 
                        return (accentNeutralise(data));
                    }
                },
                {
                    data: "author",
                    render: (data) => {
                        return (accentNeutralise(data));
                    }
                },
                { data: "editorial", visible: false },
                { data: "isbn" },
                { data: "type", visible: false },
                { data: "language", visible: false },
                { data: "collection", visible: false },
                {
                    data: "purchase_date", "searchable": false,
                    render: (data) => {
                        return (moment(data).format("MMMM Do, YYYY"));
                    }
                },
                {
                    data: "lastUpdate", visible: false, "searchable": false,
                    render: (data) => {
                        return (moment(data).format("MMMM Do, YYYY HH:mm A"));
                    }
                },
                { data: "observation", visible: false },
                {
                    data: "reserved",
                    render: function (data, type) {
                        if (type === "display") {
                            if (data === 1) {
                                reserved =
                                    '<span class="badge rounded-pill bg-warning text-dark" style="cursor: pointer; color: black; font-size: 1em; padding: 0.5em 1em;">Not available</span>';
                            } else {
                                reserved =
                                    '<span class="badge rounded-pill bg-success" style="cursor: pointer; font-size: 1em; padding: 0.5em 1em;">Available</span>';
                            }
                            return reserved;
                        }
                        return data;
                    }
                },
                {
                    data: null, "searchable": false,
                    render: function (data, type) {
                        if (type === "display") {
                            if (data.reserved === 0) {
                                btnDisable =
                                    `<button id="btnReservedBook" onClick=reservedBook(` + data.bookID + `) class="btn btn-secondary" title="Reserved Book" style="cursor: pointer"><i class="fa-solid fa-calendar-days" data-toggle="modal" data-target="#modalReserveBook"></i></button>`;
                            } else {
                                btnDisable = `<button class="btn btn-secondary not-allowed" style="cursor: not-allowed" onclick="return false;"><i class="fa-solid fa-calendar-days"></i></button>`;
                            }
                            return (
                                `
                        <div class="ui buttons">
                        ${btnDisable}
                        <button id="btnInfoBook" onClick=infoBook(` + data.bookID + `) class="btn btn-outline-warning" title="Info Book"><i class="fa-sharp fa-solid fa-eye"></i></button>
                        <button id="btnEditBook" onClick=editBook(` + data.bookID + `) type="button"  class="btn btn-outline-primary" title="Edit Book" data-toggle="modal" data-target="#modalEditBook" href="#edit"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button id="btnDeleteBook" onClick=deleteBook(` + data.bookID + `) class="btn btn-outline-danger" title="Delete Book"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                        `
                            );
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
                            title: 'Liburutegia SAN MIGUEL: BOOKS',
                        },
                        //TODO CSV
                        {
                            extend: 'csv',
                            text: '<i class="fa-solid fa-file-csv"></i> CSV',
                            titleAttr: 'Export CSV',
                            className: "buttonCsv",
                            exportOptions: {
                                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
                            },
                            title: 'Liburutegia SAN MIGUEL: BOOKS',
                        },
                        //TODO EXCEL
                        {
                            extend: 'excel',
                            text: '<i class="fa fa-file-excel-o"></i> Excel',
                            titleAttr: 'Export Excel',
                            className: "buttonExcel",
                            exportOptions: {
                                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
                            },
                            title: 'Liburutegia SAN MIGUEL: BOOKS',
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
                                columns: [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11]
                            },
                            title: 'Liburutegia SAN MIGUEL: BOOKS',
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
                                columns: [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11]
                            },
                            title: 'Liburutegia SAN MIGUEL: BOOKS',
                        }
                    ]
                },
            ],
        });
    };

//TODO ✅ FETCH RELOAD DATA BOOKS
    const reloadDataBooks = async () => {
        if (_STATEBOOK) {
            const urlLoad = "/api/books/";
            const data = await fetch(urlLoad)
                .then((response) => response.json())
                .then((datos) => datos);
            loadDataBooks(data);
        }
    };

//TODO ✅ FETCH LOAD DATA BOOKS
    (async () => {
        await reloadDataBooks();
        try {
            document.getElementById("spinnerBook").style.display = "none";
        } catch (error) { }
    })();

//TODO ✅ DELETE
    async function deleteBook(bookID) {
        opcion = "delete";
        const idBook = bookID;
        await globalDeleteBook(idBook);
    }

//TODO ✅ RESERVED
    async function reservedBook(bookID) {
        const idBook = bookID;
        await globalReserveBook(idBook, null, null);
        console.log("Reserved Book -: " + idBook);
    }

// TODO ✅ EDITAR
    async function editBook(idBook) {
        opcion = "edit";
        const bookID = idBook;
        globalEditBook(bookID);
    }

//TODO ✅ INFO
    async function infoBook(bookID) {
        const idBook = bookID;
        window.location = `/workspace/books/info/${idBook}`;
    }
