    // MOSTRAR DATOS
    // $(document).ready(function (e) {
    //     var tabla = $("#table-bookings").DataTable({
    //       e.preventDefault(),
    //       'searching': true,
    //       'ordering': true,
    //       'info': true,
    //       'responsive': true,
    //       "scrollCollapse": true,
    //       "order": [[0, "desc"]],
    //       "lengthMenu": [[5, 10, 15, 25, 50, -1], [5, 10, 15, 25, 50, "All"]],
    //       "pageLength": 5,
    //       "ajax": '/api/bookings',
    //       columns: [
    //         { data: 'id_booking' },
    //         { data: 'id_book' },
    //         { data: 'title' },
    //         { data: 'dni' },
    //         { data: 'nombre' },
    //         { data: 'apellidos' },
    //         {
    //           data: 'fecha_entrega',
    //           render: function (data, type) {
    //             console.log(data)
    //             var fecha = new Date(data);
    //             return fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();
    //           }
    //         },
    //         {
    //           defaultContent: `
    //                   <div class="ui buttons">
    //                     <button id="btnEditBooking" type="button"  class="btn btn-outline-info" data-toggle="modal" data-target="#modalCRUD" title="Edit bookin"><i class="fa-regular fa-pen-to-square"></i></button>
    //                     <div class="or" data-text="or">
    //                   </div>
    //                     <button id="btnDeleteBook" class="btn btn-outline-danger" title="Delete book"><i class="fa-solid fa-trash-can"></i></button>
    //                   </div>`
    //         }
    //       ]
    //     });
    //   });
      //EDITAR
      $(document).on("click", "#btnEditBooking", function () {
        opcion = 'edit';
        fila_booking = $(this).closest("tr");
        id_booking = fila_booking.find('td:eq(0)').text();
        id_book = fila_booking.find('td:eq(1)').text();
        title_book = fila_booking.find('td:eq(2)').text();
        dni = fila_booking.find('td:eq(3)').text();
        firstname = fila_booking.find('td:eq(4)').text();
        lastname = fila_booking.find('td:eq(5)').text();
        deliver_date = fila_booking.find('td:eq(6)').text();
        $("#id_booking").val(id_booking);
        $("#id_book").val(id_book);
        $("#title_book").val(title_book);
        $("#dni").val(dni);
        $("#firstname").val(firstname);
        $("#lastname").val(lastname);
        $("#deliver_date").val(deliver_date);
        $(".modal-header").css("background-color", "#7303c0");
        $(".modal-header").css("color", "white");
        $(".modal-title").text("Edit Booking");
      });
  
  
  
      //DELETE
      $(document).on("click", "#btnDeleteBook", function () {
        fila_booking = $(this).closest("tr");
        id_booking = fila_booking.find('td:eq(0)').text();
        Swal.fire({
          title: 'Are you sure?',
          text: "Are you sure you want to delete the BOOKING!",
          icon: 'warning',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire(
              'Deleted! Booking ' + id_booking,
              'Your booking has been deleted.',
              'success',
            )//.then((result) => {
            //window.location = '../workspace/bookings';
            //});
          }
        });
      });
  
      //submit para el CREAR y EDITAR
      $('#formu').submit(function (e) {
        e.preventDefault();
        url = "/api/bookings/"
        id_booking = $.trim($('#id_booking').val());
        dni = $.trim($('#dni').val());
        deliver_date = $.trim($('#deliver_date').val());
        if (opcion == 'edit') {
          console.log("EDITAR");
          $.ajax({
            url: url + id_booking,
            method: 'put',
            contentType: 'application/json',
            data: JSON.stringify({
              dni: dni, deliver_date: deliver_date
            }
            )
          });
          $(document).ajaxStop(function () {
            location.reload(true);
          });
        }
        $('#modalCRUD').hide();
        $('#modal').hide();
        window.location.reload(true);
      });