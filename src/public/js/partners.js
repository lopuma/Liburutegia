
const spinner = document.getElementById("spinner");
const tbodyPartner = document.getElementById("tbodyPartner");

//TODO MESSAGE
function menssage(txt) {
    const msg = `
    <div id="alertLogin" class="alert alert-message alert-success alert-dismissible fade show" role="alert">
        <h4 class="alert-heading">Well done!</h4>
        ${txt}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span>
        </button>
    </div>
    `;
    $("#msg").html(msg);
    $("#msg").fadeOut(5000, function(){
      $(this).html("");
      $(this).fadeIn(3000);
    })
}

//TODO DELETE
async function partnerDelete(idPartner) {
  const url = `/api/partners/delete/${idPartner}`
  fetch(url).then(() => {
    console.log(tbodyPartner)
    myTable.destroy();
    tbodyPartner.innerHTML = "";
    setTimeout(() => {
      mostrarData();
    }, 500);
  });
}
async function deletePartner(id_partner) {
  opcion = 'delete';
  const idPartner = id_partner;
  Swal.fire({
    title: 'Are you sure?',
    text: "Are you sure you want to delete the PARTNER!",
    icon: 'warning',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  })
    .then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted! Book ' + idPartner,
          'Your Partner has been deleted.',
          'success',
          partnerDelete(idPartner)
        );
      }
    });
}

//TODO INFO PARTNER
async function infoPartner(id_partner) {
  const idPartner = id_partner;
  window.location = `/workspace/partners/info/${idPartner}`;
}

//TODO MOSTRAR
async function mostrarData() {
  const url = "/api/partners/";
  $(document).ready(async () => {
    myTable = await $("#tablePartner").DataTable({
      ajax: {
        url: url,
        dataSrc: ""
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
        { data: "id_partner", visible: false },
        { data: "dni" },
        { data: "name" },
        { data: "lastname" },
        { data: "phone1" },
        { data: "phone2" },
        { data: "email" },
        {
          data: null,
          render: function (data, type) {
            return (
              `
                <div class="ui buttons">
                  <button id="btnInfoPartner" onClick=infoPartner(` +
              data.id_partner +
              `) class="btn btn-outline-warning" title="Info Partner"><i class="fa-sharp fa-solid fa-eye"></i></button>
                  <button id="btnEditPartner" onClick=edit(` +
              data.id_partner +
              `) type="button"  class="btn btn-outline-info" title="Edit Partner" data-toggle="modal" data-target="#modalPartner" href="#edit"><i class="fa-regular fa-pen-to-square"></i></button>
                  <button id="btnDeletePartner" onClick=deletePartner(` +
              data.id_partner +
              `) class="btn btn-outline-danger" title="Delete Partner"><i class="fa-solid fa-trash-can"></i></button>
                </div>
                `
            );
          }
        }
      ]
    });
  });
  spinner.style.display = "none";
}
setTimeout(async () => {
  spinner.style.display = "block";
  mostrarData();
}, "300")

//TODO EDITAR
async function edit(id_partner) {
  opcion = 'edit';
  const idPartner = id_partner;
  const url = `/api/partners/${idPartner}`;
  fetch(url)
    .then((response) => response.json())
    .then((datos) => {
      $("#id_partner").val(datos.id_partner);
      $("#dni").val(datos.dni);
      $("#scanner").val(datos.scanner);
      $("#name").val(datos.name);
      $("#lastname").val(datos.lastname);
      $("#direction").val(datos.direction);
      $("#population").val(datos.population);
      $("#phone1").val(datos.phone1);
      $("#phone2").val(datos.phone2);
      $("#email").val(datos.email);
      $(".modal-header").css("background-color", "var(--Background-Color-forms-partner)");
      $(".modal-header").css("color", "white");
      $(".modal-title").text("EDIT PARTNER").css("font-weight", "700");
    })
}
//TODO UPDATE
$('#formu').submit(async function (e) {
  e.preventDefault();
  id_partner = $.trim($('#id_partner').val());
  dni = $.trim($('#dni').val());
  name = $.trim($('#name').val());
  scanner = $.trim($('#scanner').val());
  lastname = $.trim($('#lastname').val());
  direction = $.trim($('#direction').val());
  population = $.trim($('#population').val());
  phone1 = $.trim($('#phone1').val());
  phone2 = $.trim($('#phone2').val());
  email = $.trim($('#email').val());
  url = `/api/partners/update/${id_partner}`
  if (opcion === 'edit') {
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        dni,
        name,
        scanner,
        lastname,
        direction,
        population,
        phone1,
        phone2,
        email
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(response => response.json())
      .then(data => menssage(data.messageUpdate))
      .catch(error => {
        console.error("Error:", error);
      });
  }
  $("#modalPartner").modal("hide");
  myTable.destroy();
  tbodyPartner.innerHTML = "";
  setTimeout(() => {
    mostrarData();
  }, 500);
});