const spinner = document.getElementById("spinner");

//TODO CLOSE LOADING
setTimeout(() => {
    loadData();
}, "1600");

//TODO RESERVED
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
    const table = $("#tableBook").DataTable();
    table.destroy();
    setTimeout(() => {
      loadData();
    }, 500);
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
//TODO MOSTRAR
async function loadData() {

  $(document).ready(async function(e) {
    const url = "/api/books/";
    myTable = $("#tableBook").DataTable({
      ajax: {
        url: url,
        dataSrc: "data"
      },
      searching: true,
      ordering: true,
      info: true,
      responsive: true,
      order: [[0, "desc"]],
      lengthMenu: [[5, 10, 15, 25, 50], [5, 10, 15, 25, 50]],
      pageLength: 15,
      deferRender: true,
      columns: [
        { data: "bookID", visible: false },
        { data: "title" },
        { data: "isbn" },
        { data: "author" },
        { data: "language" },
        { data: "author" },
        { data: "language" },
        { data: "author" },
        { data: "language" },
        { data: "author" },
        { data: "language" },
        {
          data: "reserved",
          render: function(data, type) {
            if (type === "display") {
              if (data === 1) {
                reserved =
                  '<span class="badge rounded-pill bg-warning text-dark" style="cursor: pointer; color: black; font-size: 1em; padding: 0.5em 1em;">Unavailable</span>';
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
          data: null,
          render: function(data, type) {
            if (type === "display") {
              if (data.reserved === 0) {
                btnDisable =
                  `<button id="btnReservedBook" onClick=reservedBook(` +
                  data.bookID +
                  `) class="btn btn-secondary" title="Reserved Book"><i class="fa-solid fa-calendar-days"></i></button>`;
              } else {
                btnDisable = `<button id="btnReservedBook" class="btn btn-secondary disabled" title="Reserved Book"><i class="fa-solid fa-calendar-days"></i></button>`;
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
      ]
    });
  });

  spinner.style.display = "none";

}


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
