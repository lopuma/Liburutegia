
const spinner = document.getElementById("spinner");
const tbodyPartner = document.getElementById("tbodyPartner");



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

//TODO OBTENER DNI FAMILIAR 
function familyDni(data) {

}

function obtenerDniFamiliar() {
  const url = '/api/family/';
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data.dni_familiar_partner;
    });
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
        { 
          data: null,
          render: function (data, type) {
            let response = "";
              if (data.family === 1){
                response = 'Yes';
              } else {
                response = "";
              }
              return response;
          }
        },
        { data: "phone1" },
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
      $("#inputDni").val(datos.inputDni);
      $("#inputScanner").val(datos.inputScanner);
      $("#inputName").val(datos.inputName);
      $("#inputLastname").val(datos.inputLastname);
      $("#inputDirection").val(datos.inputDirection);
      $("#inputPopulation").val(datos.inputPopulation);
      $("#inputPhone").val(datos.inputPhone);
      $("#inputPhoneLandline").val(datos.inputPhoneLandline);
      $("#inputEmail").val(datos.inputEmail);
      $(".modal-header").css("background-color", "var(--Background-Color-forms-partner)");
      $(".modal-header").css("color", "white");
      $(".modal-title").text("EDIT PARTNER").css("font-weight", "700");
    })
}

//TODO UPDATE
$('#formu').submit(async function (e) {
  e.preventDefault();
  const url = `/api/partners/update/${id_partner}`
  let data = {
    id_partner: $.trim($('#id_partner').val()),
    inputDni: $.trim($('#inputDni').val()),
    inputName: $.trim($('#inputName').val()),
    inputScanner: $.trim($('#inputScanner').val()),
    inputLastname: $.trim($('#inputLastname').val()),
    inputDirection: $.trim($('#inputDirection').val()),
    inputPopulation: $.trim($('#inputPopulation').val()),
    inputPhone: $.trim($('#inputPhone').val()),
    inputPhoneLandline: $.trim($('#inputPhoneLandline').val()),
    inputEmail: $.trim($('#inputEmail').val()),
  }
  if (opcion === 'edit') {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(response => response.json())
      .then(data => responseAddPartner(data))
      .catch(error => console.error(error));
  }
  $("#modalPartner").modal("hide");
  myTable.destroy();
  tbodyPartner.innerHTML = "";
  setTimeout(() => {
    mostrarData();
  }, 500);
});