
    // MOSTRAR DATOS
    $(document).ready(function () {
      var tabla = $("#table-partners").DataTable({
        'searching': true,
        'ordering': true,
        'info': true,
        'responsive': true,
        "scrollCollapse": true,
        "order": [[0, "desc"]],
        "lengthMenu": [[5, 10, 15, 25, 50, -1], [5, 10, 15, 25, 50, "All"]],
        "pageLength": 5,
        'ajax': '/api/partners',
        columns: [
          { data: 'id_partner' },
          { data: 'dni' },
          { data: 'nombre' },
          { data: 'apellidos' },
          { data: 'direccion' },
          { data: 'telefono' },
          { data: 'email' },
          {
            defaultContent: `
                    <div class="ui buttons">
                      <button id="btnEditPartner" type="button"  class="btn btn-outline-info" data-toggle="modal" data-target="#modalPARTNER" title="Edit partner"><i class="fa-regular fa-pen-to-square"></i></button>
                      <div class="or" data-text="or">                          
                    </div>
                      <button id="btnDeleteBook" class="btn btn-outline-danger" title="Delete book"><i class="fa-solid fa-trash-can"></i></button>
                    </div>`
          }
        ]
      });
    });
