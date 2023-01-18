const tbodyPartners       = document.getElementById( "tbodyPartners"      );
const familyLink          = document.getElementById( "familyLink"         );
const selectDni           = document.getElementById( "selectDni"          );
const inputDniCheck       = document.getElementById( "dniCheck"           );
const inputDni            = document.getElementById( "inputDni"           );
const inputPartnerID      = document.getElementById( "partnerID"          );
const inputScanner        = document.getElementById( "inputScanner"       );
const inputName           = document.getElementById( "inputName"          );
const inputLastname       = document.getElementById( "inputLastname"      );
const inputDirection      = document.getElementById( "inputDirection"     );
const inputPopulation     = document.getElementById( "inputPopulation"    );
const inputPhone          = document.getElementById( "inputPhone"         );
const inputPhoneLandline  = document.getElementById( "inputPhoneLandline" );
const inputEmailPartner   = document.getElementById( "inputEmail"         );
let partnerActiveCheck = "";
let _STATEPARTNER = false;
let opcion = "";

//TODO ✅ ACTIVAR CHECK SI ESTA ACTIVA VENTANA PARTNER
    try {
        if ($('#statePartners').val() === '') { // 
            _STATEPARTNER = true;
        }
    } catch (error) { }


//TODO ✅ FETCH LOADING DATA
    const reloadData = async () => {
        if (_STATEPARTNER) {
            const urlLoad = "/api/partners/";
            const data = await fetch(urlLoad)
                .then((response) => response.json())
                .then((datos) => datos);
            loadData(data);
        }
    }
    (async () => {
        await reloadData();    
        try {
            document.getElementById("spinner").style.display = "none";
        } catch (error) { }
    })();

// TODO 👌 CREDIT github @THuRStoN
    function formatNumberLength(num, length) {
        var r = "" + num;
        while (r.length < length) {
            r = "0" + r;
        }
        return r;
    }
// TODO 👌 CREDIT github @THuRStoN
    function charDNI(dni) {
        var chain = "TRWAGMYFPDXBNJZSQVHLCKET";
        var pos = dni % 23;
        var letter = chain.substring(pos, pos + 1);
        return letter;
    }
// TODO 👌 CREDIT github @THuRStoN
    function rand_dni() {
        num = Math.floor(Math.random() * 100000000);
        sNum = formatNumberLength(num, 8);
        return sNum + charDNI(sNum);
    }

//TODO ✅ SELECT 
    (async function loadSelect() {
        await $(".js-example-basic-single").select2();
    })();

//TODO ✅ LOAD PARTNER
async function loadData(data) {
        dataTablePartners = $("#tablePartner").DataTable({
            data: data,
            deferRender: true,
            searching: true,
            "info": true,
            "paging": true,
            "orderClasses": false,
            destroy: true,
            language: {
                emptyTable: "No data available in table Partners"
            },
            stateSave: true,
            responsive: true,
            order: [[1, "desc"]],
            lengthMenu: [[5, 10, 15, 25, 50, -1], [5, 10, 15, 25, 50, 'ALL']],
            pageLength: 15,
            select: true,
            autoWidth: false,
            columns: [
                {
                    data: null,
                    render: (data) => {
                        return (fillZeros(data.partnerID));
                    }, visible: false, "searchable": false
                },
                { data: "dni" },
                { data: "scanner", visible: false },
                {
                    data: null, render: function (data, _type, _row) {
                        return accentNeutralise(data.lastname) + ', ' + accentNeutralise(data.name);
                    }
                },
                { data: "direction", visible: false },
                { data: "population", visible: false },
                { data: "phone1" },
                { data: "phone2" },
                { data: "email" },
                {
                    data: null, "searchable": false,
                    render: (data) => {
                        return (
                            moment(data.date).format("MMMM Do, YYYY")
                        );
                    }
                    , visible: false
                },
                {
                    data: null, "searchable": false,
                    render: (data) => {
                        return (
                            moment(data.updateDate).format("MMMM Do, YYYY HH:mm")
                        );
                    }
                    , visible: false
                },
                {
                    data: null, "searchable": false,
                    render: function (data) {
                        return (
                            `
                            <div class="ui buttons">
                                <button id="btnInfoPartner" onClick=infoPartner(` + data.partnerID + `) class="btn btn-outline-warning" title="Info Partner"><i class="fa-sharp fa-solid fa-eye"></i></button>
                                <button id="btnEditPartner" onClick=edit(` + data.partnerID + `) type="button"  class="btn btn-outline-dark" title="Edit Partner" data-toggle="modal" data-target="#modalEditPartner" href="#edit"><i class="fa-regular fa-pen-to-square"></i></button>
                                <button id="btnDeletePartner" onClick=deletePartner(` + data.partnerID + `) class="btn btn-outline-danger" title="Delete Partner"><i class="fa-solid fa-trash-can"></i></button>
                            </div>
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
                            title: 'Liburutegia SAN MIGUEL: PARTNERS',
                        },
                        //TODO CSV
                        {
                            extend: 'csv',
                            text: '<i class="fa-solid fa-file-csv"></i> CSV',
                            titleAttr: 'Export CSV',
                            className: "buttonCsv",
                            exportOptions: {
                                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                            },
                            title: 'Liburutegia SAN MIGUEL: PARTNERS',
                        },
                        //TODO EXCEL
                        {
                            extend: 'excel',
                            text: '<i class="fa fa-file-excel-o"></i> Excel',
                            titleAttr: 'Export Excel',
                            className: "buttonExcel",
                            exportOptions: {
                                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                            },
                            title: 'Liburutegia SAN MIGUEL: PARTNERS',
                        },
                        //TODO PDF
                        {
                            extend: 'pdfHtml5',
                            orientation: 'landscape',
                            pageSize: 'LEGAL',
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
                                columns: [0, 1, 3, 4, 5, 6, 7, 8, 9, 10]
                            },
                            title: 'Liburutegia SAN MIGUEL: PARTNERS',
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
                                columns: [0, 1, 3, 4, 5, 6, 7, 8, 9, 10]
                            },
                            title: 'Liburutegia SAN MIGUEL: PARTNERS',
                        }
                    ]
                },
            ],
        });
    }

//TODO ✅ INFO PARTNER
    async function infoPartner(partnerID) {
        const idPartner = partnerID;
        window.location = `/workspace/partners/info/${idPartner}`;
    }

//TODO ✅ DELETE PARTMNER
    async function apiDelete(idPartner) {
        const urlDelete = `/api/partners/delete/${idPartner}`;
        await fetch(urlDelete)
            .then((response) => response.json())
            .then(async (data) => {
                Swal.fire({
                    title: `Removed! Partner with ID: ${idPartner}`,
                    text: data.messageSuccess,
                    icon: 'success',
                    timer: 2000,
                    confirmButtonText: 'OK',
                }).then(async () => {
                    try {
                        if ($('#stateInfoPartner').val() === '') { // 
                            window.location = `/workspace/partners/`;
                        }
                        else {
                            await reloadData();
                        }
                    } catch (error) { }
                })
            });
    }
    async function deletePartner(partnerID) {
        opcion = 'delete';
        const idPartner = partnerID;
        Swal.fire({
            title: 'Are you sure?',
            text: "Are you sure you want to delete the PARTNER!",
            icon: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                apiDelete(idPartner);
            }
        });
    }

//TODO ✅ EDIT PARTNER
    async function edit(partnerID) {
        opcion = "edit";
        const idPartner = partnerID;
        const urlGetPartner = `/api/partners/${idPartner}`;
        let checked = false;
        let _partnerDNI = "";
        await fetch(urlGetPartner)
            .then(response => response.json())
            .then(async (data) => {
                const check = data.activeFamily;
                if (check === 1) {
                    checked = true;
                    inputDniCheck.checked = checked;
                    const urlGetDniFamily = `/api/familys/${data.dni}`;
                    await fetch(urlGetDniFamily)
                        .then(response => response.json())
                        .then(async (data) => {
                            _partnerDNI = data.data.partnerDni;
                            partnerActiveCheck = data.data.partnerDni;
                            await activeSelectDniFamily(_partnerDNI);
                        });
                } else {
                    checked = false;
                    inputDniCheck.checked = checked;
                    await disabledFamilyLink();
                }
                inputPartnerID.value = data.partnerID;
                inputDni.value = data.dni;
                inputScanner.value = data.scanner;
                inputName.value = data.name;
                inputLastname.value = data.lastname;
                inputDirection.value = data.direction;
                inputPopulation.value = data.population;
                inputPhone.value = data.phone1;
                inputPhoneLandline.value = data.phone2;
                inputEmail.value = data.email;
                inputDniCheck.checked = checked;
                if (!checkedNew) {
                    document.getElementById('newBoxesID').removeAttribute('hidden');
                    document.getElementById("creationDate").innerHTML = `
                        <input class="Animation-input" type="date" id="actualDate" value='${moment(data.date).format("YYYY-MM-DD")}' tabindex=0>
                        <label class="Animation-label" for="date">Creation Date</label>
                    `;
                }
            });
    }
    async function disabledFamilyLink() {
        $("#selectDni").html("");
        familyLink.classList.remove("isEnable");
        inputDni.focus();
        inputDni.select();
    }
    async function activeSelectDniFamily(_partnerDNI) {
        const partnerDni = _partnerDNI;
        const urlSelectDni = "/api/partners/";
        if (inputDniCheck.checked) {
            await fetch(urlSelectDni, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                }
            })
                .then(response => response.json())
                .then(async data => await obtenerDni(data, partnerDni))
                .catch(() =>
                    window.alert(
                        "There is no record in partners, to associate."
                    )
                );
            familyLink.classList.add("isEnable");
            selectDni.focus();
        } else {
            await disabledFamilyLink();
        }
    }

// TODO ✅ AL CAMBIAR CHECK
    try {
        inputDniCheck.addEventListener("change", async () => {
            await activeSelectDniFamily();
        });
    } catch (error) { }

// TODO ✅ AÑADE UN DNI ALEATORIO AL INPUT DNI
    async function selectChange() {
        const index = await selectDni.selectedIndex;
        if (index !== 0) {
            if (inputDni.value === "") {
                inputDni.value = rand_dni();
                inputDni.focus();
            } else {
                inputDni.focus();
            }
        document.querySelector(".select2-selection--single").classList.remove("isSelectError");
        }
    };

// TODO ✅ AÑADE DNI DE PARTNERS AL SELECT
    async function obtenerDni(data, _partnerDNI) {
        const partnerDNI = _partnerDNI;
        selectDni.innerHTML = '<option value="" disabled selected hidden>Select family member\'s DNI</option>';
        data.forEach(partner => {
            let option = document.createElement("option");
            option.value = partner.partnerID;
            option.text = partner.dni;
            selectDni.add(option);
            let sel = document.getElementById("selectDni");
            for (let i = 0; i < sel.length; i++) {
                let opt = sel[i];
                if (opt.text === partnerDNI) {
                    $("#selectDni").val(opt.value);
                    return;
                }
            }
        });
    }