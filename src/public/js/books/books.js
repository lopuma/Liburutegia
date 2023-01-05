//TODO ✅ FETCH LOADING DATA
(async () => {
  const urlLoad = "/api/books/";
  const datos = await fetch(urlLoad)
    .then((response) => response.json())
    .then((datos) => datos);
  loadDataBooks(datos)
  try {
    document.getElementById("spinnerBook").style.display = "none";
  } catch (error) { }
})();

//TODO ✅ RESERVED
async function reservedBook(bookID) {
  const idBook = bookID;
}

// TODO EDITAR
async function edit(bookID) {
  opcion = "edit";
  const idBook = bookID;
  const url = `/api/books/${idBook}`;
  fetch(url)
    .then(response => response.json())
    .then(datos => {
      $("#bookID").val(datos.bookID);
      $("#title").val(datos.dni);
      $("#author").val(datos.scanner);
      $("#editorial").val(datos.name);
      $("#isbn").val(datos.lastname);
      $("#type").val(datos.direction);
      $("#language").val(datos.population);
      $("#collection").val(datos.phone1);
      $("#purchase_date").val(datos.phone2);
      $("#observations").val(datos.email);
      $(".modal-header").css(
        "background-color",
        "var(--Background-Color-forms-book)"
      );
      $(".modal-header").css("color", "white");
      $(".modal-title").text("EDIT BOOK").css("font-weight", "700");
    })
    .then(result => {
      console.log(result);
    });
}

async function bookDelete(idBook) {
  const url = `/api/books/delete/${idBook}`;
  fetch(url).then(() => {
    console.log("DELETEBOOK", idBook);
    //const table = $("#tableBook").DataTable();
    //table.destroy();
    //setTimeout(() => {
    //  loadData();
    //}, 500);
  });
}

//TODO DELETE
async function deleteBook(bookID, count) {
  opcion = "delete";
  const idBook = bookID;
  Swal.fire({
    title: "Are you sure?",
    text: "Are you sure you want to delete the BOOK!",
    icon: "warning",
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then(result => {
    if (result.isConfirmed) {
      Swal.fire(
        "Deleted! Book " + idBook,
        "Your Book has been deleted.",
        "success",
        bookDelete(idBook)
      );
    }
  });
}

//TODO INFO
async function infoBook(bookID) {
  const idBook = bookID;
  window.location = `/workspace/books/info/${idBook}`;
}

//TODO ✅ MOSTRAR datos en la TABLA BOOK
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
      { data: "title" },
      { data: "author" },
      { data: "editorial", visible: false },
      { data: "isbn" },
      { data: "type", visible: false },
      { data: "language", visible: false },
      { data: "collection", visible: false },
      {
        data: "purchase_date", "searchable": false,
        render: (data) => {
          return (moment(data).format("MMMM Do, YYYY A"));
        }
      },
      {
        data: "lastUpdate", visible: false, "searchable": false,
        render: (data) => {
          return (moment(data).format("MMMM Do, YYYY HH:mm A"));
        }
      },
      { data: "observations", visible: false },
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
                `<button id="btnReservedBook" onClick=reservedBook(` +
                data.bookID +
                `) class="btn btn-secondary" title="Reserved Book" style="cursor: pointer"><i class="fa-solid fa-calendar-days"></i></button>`;
            } else {
              btnDisable = `<button class="btn btn-secondary not-allowed" style="cursor: not-allowed" onclick="return false;"><i class="fa-solid fa-calendar-days"></i></button>`;
            }

            return (
              `
                <div class="ui buttons">
                  ${btnDisable}
                  <button id="btnInfoBook" onClick=infoBook(` + data.bookID + `) class="btn btn-outline-warning" title="Info Book"><i class="fa-sharp fa-solid fa-eye"></i></button>
                  <button id="btnEditBook" onClick=edit(` + data.bookID + `) type="button"  class="btn btn-outline-primary" title="Edit Book" data-toggle="modal" data-target="#modalBook" href="#edit"><i class="fa-regular fa-pen-to-square"></i></button>
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

//UPDATE
$("#formuBook").submit(function(e) {
  e.preventDefault();
  bookID = $.trim($("#bookID").val());
  title = $.trim($("#title").val());
  author = $.trim($("#author").val());
  editorial = $.trim($("#editorial").val());
  isbn = $.trim($("#isbn").val());
  type = $.trim($("#type").val());
  language = $.trim($("#language").val());
  collection = $.trim($("#collection").val());
  purchase_date = $.trim($("#purchase_date").val());
  observations = $.trim($("#observations").val());
  url = `/api/books/update/${bookID}`;
  if (opcion === "edit") {
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        title,
        author,
        editorial,
        isbn,
        type,
        language,
        collection,
        purchase_date,
        observations
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
  }
  location.reload(true);
  $("#modalBook").hide();
});
