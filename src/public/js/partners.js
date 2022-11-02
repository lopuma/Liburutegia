  //EDITAR
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

  //DELETE
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
            window.location = `/api/partners/delete/${idPartner}`
          );
        }
      });
  }

  //INFO PARTNER
  async function infoPartner(id_partner) {
    const idPartner = id_partner;
    window.location = `/workspace/partners/info/${idPartner}`;
  }

  //MOSTRAR
  setTimeout(() => {
    $(document).ready(function (e) {
      const url = '/api/partners/';
      $('#tablePartner').DataTable({
        "ajax": {
          "url": url,
          "dataSrc": ""
        },
        'searching': true,
        'ordering': true,
        'info': true,
        'responsive': true,
        "order": [[0, "desc"]],
        "lengthMenu": [[5, 10, 15, 25, 50, -1], [5, 10, 15, 25, 50, "All"]],
        "pageLength": 15,
        'deferRender': true,
        columns: [
          { data: 'id_partner', 'visible': false },
          { data: 'dni' },
          { data: 'name' },
          { data: 'lastname' },
          { data: 'phone1' },
          { data: 'phone2' },
          { data: 'email' },
          {
            data: null,
            render: function (data, type) {
              return `
                <div class="ui buttons">
                  <button id="btnInfoPartner" onClick=infoPartner(` + data.id_partner + `) class="btn btn-outline-warning" title="Info Partner"><i class="fa-sharp fa-solid fa-eye"></i></button>
                  <button id="btnEditPartner" onClick=edit(` + data.id_partner + `) type="button"  class="btn btn-outline-info" title="Edit Partner" data-toggle="modal" data-target="#modalPARTNER" href="#edit"><i class="fa-regular fa-pen-to-square"></i></button>
                  <button id="btnDeletePartner" onClick=deletePartner(` + data.id_partner + `) class="btn btn-outline-danger" title="Delete Partner"><i class="fa-solid fa-trash-can"></i></button>
                </div>
                `;
            }
          }
        ]
      });
    });
    document.getElementById("spinner").style.display = "none";
    }, "500")

  //UPDATE
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
        method: 'POST',
        body: JSON.stringify({
          dni: dni,
          name: name,
          scanner: scanner,
          lastname: lastname,
          direction: direction,
          population: population,
          phone1: phone1,
          phone2: phone2,
          email: email
        }),
      headers: {
          "Content-type": "application/json; charset=UTF-8"
      }
      });
    }
    location.reload(true);
    $('#modalPARTNER').hide();
  });