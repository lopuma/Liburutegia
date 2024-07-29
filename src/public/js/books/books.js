let opcion = "";
//TODO ✅ ACTIVAR CHECK SI ESTA ACTIVA VENTANA BOOK
try {
    if ($("#stateBooks").val() === "") {
        //
        _STATEBOOK = true;
    }
} catch (error) { }

//TODO ✅ SHOW DATA IN THE TABLE BOOK
async function loadDataBooks(data) {
    dataTableBooks = $("#tableBook").DataTable({
        data: data,
        deferRender: true,
        searching: true,
        info: true,
        paging: true,
        orderClasses: false,
        destroy: true,
        language: {
            emptyTable: "No data available in table Books",
        },
        stateSave: true,
        responsive: true,
        order: [[0, "desc"]],
        lengthMenu: [
            [5, 10, 15, 25, 50, -1],
            [5, 10, 15, 25, 50, "ALL"],
        ],
        pageLength: 15,
        select: true,
        autoWidth: false,
        columns: [
            {
                data: null,
                targets: data.bookID,
                render: (data) => {
                    return fillZeros(data.bookID);
                },
            },
            {
                data: "numReference",
            },
            {
                data: "title",
                render: (data) => {
                    return accentNeutralise(data);
                },
            },
            {
                data: "author",
                render: (data) => {
                    return accentNeutralise(data);
                },
            },
            { data: "editorial", visible: false },
            { data: "isbn" },
            { data: "type", visible: false },
            { data: "language", visible: false },
            { data: "collection", visible: false },
            {
                data: "purchase_date",
                searchable: false,
                render: (data) => {
                    return moment(data).format("MMMM Do, YYYY");
                },
            },
            {
                data: "lastUpdate",
                visible: false,
                searchable: false,
                render: (data) => {
                    return moment(data).format("MMMM Do, YYYY HH:mm A");
                },
            },
            { data: "observation", visible: false },
            {
                data: null,
                render: function (data, type) {
                    if (type === "display") {
                        if (data.reserved === 1) {
                            reserved = `<div style="margin-bottom: 1em;"><span class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">Not Available</span>

                            </div>
                            <div style="margin-bottom: 0.5em;">
                            <button type="button" id="btnNotify" onClick="notify('${data.bookID}', '${data.isbn}', '${data.title}')" pointer" data-toggle="modal" data-target="#modalNotify" href="#notify" class="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
<svg class="w-3 h-3 text-white me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
<path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
<path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
</svg>
Notify me</button>
                            </div>
                            `;
                        } else {
                            reserved = `<span class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">Available</span>`;
                        }
                        return reserved;
                    }
                    return data;
                },
            },
            {
                data: null,
                searchable: false,
                render: function (data, type) {
                    if (type === "display") {
                        if (data.reserved === 0) {
                            btnDisable = `<button id="btnReservedBook" onClick="reservedBook(${data.bookID}, '${data.title}')" class="btn btn-secondary" title="Reserved Book" style="cursor: pointer" data-toggle="modal" data-target="#modalReserveBook"><i class="fa-solid fa-calendar-days" ></i></button>`;
                        } else {
                            btnDisable = `<button class="btn btn-secondary not-allowed" style="cursor: not-allowed" onClick="return false;" title="Reserved Book"><i class="fa-solid fa-calendar-days"></i></button>`;
                        }
                        return (
                            `
                        <div class="ui buttons">
                        ${btnDisable}
                        <button id="btnInfoBook" onClick=infoBook(` +
                            data.bookID +
                            `) class="btn btn-outline-warning" title="Info Book"><i class="fa-sharp fa-solid fa-eye"></i></button>
                        <button id="btnEditBook" onClick=editBook(` +
                            data.bookID +
                            `) type="button"  class="btn btn-outline-primary" title="Edit Book" data-toggle="modal" data-target="#modalEditBook" href="#edit"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button id="btnDeleteBook" onClick="deleteBook(${data.bookID}, ${data.isbn})" class="btn btn-outline-danger" title="Delete Book"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                        `
                        );
                    }
                    return data;
                },
            },
        ],
        dom: "Bfrtip",
        buttons: [
            {
                extend: "pageLength",
            },
            {
                extend: "colvis",
            },
            {
                extend: "collection",
                text: "Export Data",
                autoClose: true,
                buttons: [
                    {
                        extend: "copy",
                        text: '<i class="fa fa-files-o"></i> Copy',
                        titleAttr: "Copy",
                        className: "buttonCopy",
                        exportOptions: {
                            columns: [0, ":visible"],
                        },
                        title: "Liburutegia SAN MIGUEL: BOOKS",
                    },
                    {
                        extend: "csv",
                        text: '<i class="fa-solid fa-file-csv"></i> CSV',
                        titleAttr: "Export CSV",
                        className: "buttonCsv",
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                        },
                        title: "Liburutegia SAN MIGUEL: BOOKS",
                    },
                    //TODO EXCEL
                    {
                        extend: "excel",
                        text: '<i class="fa fa-file-excel-o"></i> Excel',
                        titleAttr: "Export Excel",
                        className: "buttonExcel",
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                        },
                        title: "Liburutegia SAN MIGUEL: BOOKS",
                    },
                    //TODO PDF
                    {
                        extend: "pdfHtml5",
                        orientation: "landscape",
                        pageSize: "LEGAL",
                        text: '<i class="fa-solid fa-file-pdf"></i> PDF',
                        titleAttr: "Export PDF",
                        className: "buttonPdf",
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                        },
                        title: "Liburutegia SAN MIGUEL: BOOKS",
                        customize: function (doc) {
                            doc.styles.title = {
                                width: "100",
                                color: "black",
                                fontSize: "16",
                                background: "#CEEDC7",
                                alignment: "center",
                            };
                        },
                    },
                    {
                        extend: "print",
                        text: '<i class="fa-solid fa-print"></i> Print',
                        titleAttr: "Print",
                        className: "buttonPrint",
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                        },
                        title: "Liburutegia SAN MIGUEL: BOOKS",
                    },
                ],
            },
        ],
    });
    $("#tableBook_filter input").focus();
    $(document).ready(function() {
        setupInputListener('tableBook_filter', 'btnClearBooks');
    });
}

//TODO ✅ FETCH RELOAD DATA BOOKS
const reloadDataBooks = async () => {
    if (_STATEBOOK) {
        const urlLoad = "/workspace/books/books";
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
async function deleteBook(bookID, ISBN) {
    opcion = "delete";
    const idBook = bookID;
    const isbn = ISBN;
    await globalDeleteBook(idBook, isbn);
}

//TODO ✅ RESERVED
async function reservedBook(bookID, title) {
    const idBook = bookID;
    const titleBook = title;
    await globalReserveBook(idBook, titleBook, null, null);
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


//TODO ✅ NOTIFY
async function notify(idBook, _isbn, _title) {
    opcion = "notify";
    const bookID = idBook;
    const isbn = _isbn;
    const title = _title;
    notificador(bookID, isbn, title);
    listDni();
}
