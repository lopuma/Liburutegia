const tbodyPartners = document.getElementById("tbodyPartners");
const familyLink = document.getElementById("familyLink");
const selectDni = document.getElementById("selectDni");
const inputDniCheck = document.getElementById("dniCheck");
const inputDni = document.getElementById("inputDni");
const inputPartnerID = document.getElementById("partnerID");
const inputScanner = document.getElementById("inputScanner");
const inputName = document.getElementById("inputName");
const inputLastname = document.getElementById("inputLastname");
const inputDirection = document.getElementById("inputDirection");
const inputPopulation = document.getElementById("inputPopulation");
const inputPhone = document.getElementById("inputPhone");
const inputPhoneLandline = document.getElementById("inputPhoneLandline");
const inputEmailPartner = document.getElementById("inputEmail");
var partnerActiveCheck = "";
let statePartner = false;
//TODO ACTIVAR CHECK SI ESTA ACTIVA VENTANA PARTNER
try {
    if ($('#statePartners').val() === '') { // 
        statePartner = true;
    }
} catch (error) { }

$(".modal-title").text("EDIT PARTNER").css("font-weight", "600");

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

//TODO ✅ CLOSE LOADING
setTimeout(() => {
    loadData();
    try {
        document.getElementById("spinner").style.display = "none";
    } catch (error) { }
}, "1600");

//TODO ✅ SELECT 
$(document).ready(function () {
    theme: "bootstrap4", $(".js-example-basic-single").select2();
});

function fillZeros(id) {
    let num = id;
    let large = 12
    for (let i = 0; i < (large - num.length); i++) {
        num = "0" + num
    }
    return num
}

//TODO ✅ LOAD PARTNER
async function loadData() {
    const urlLoad = "/api/partners/";
    $(document).ready(() => {
        dataTablePartners = $("#tablePartner").DataTable({
            ajax: {
                url: urlLoad,
                dataSrc: "",
            },
            language: {
                emptyTable: "No data available in table Partners"
            },
            stateSave: true,
            searching: true,
            ordering: true,
            info: true,
            responsive: true,
            order: [[0, "desc"]],
            lengthMenu: [[5, 10, 15, 25, 50, -1], [5, 10, 15, 25, 50, 'ALL']],
            pageLength: 15,
            deferRender: true,
            colReorder: true,
            select: true,
            columns: [
                {
                    data: null,
                    render: (data) => {
                        return (fillZeros(data.partnerID));
                    }, visible: false
                },
                { data: "dni" },
                { data: "scanner", visible: false },
                {
                    data: null, render: function (data, _type, _row) {
                        // Combine the first and last names into a single table field
                        return data.lastname + ', ' + data.name;
                    }
                },
                { data: "direction", visible: false },
                { data: "population", visible: false },
                { data: "phone1" },
                { data: "phone2" },
                { data: "email" },
                {
                    data: null,
                    render: (data) => {
                        return (
                            moment(data.date).format("MMMM Do, YYYY HH:mm A")
                        );
                    }
                    , visible: false
                },
                {
                    data: null,
                    render: (data) => {
                        return (
                            moment(data.dateUpdate).format("MMMM Do, YYYY HH:mm A")
                        );
                    }
                    , visible: false
                },
                {
                    data: null,
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
            'autoWidth': true,
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
        $('#tablePartner tbody').on('click', 'tr', function () {
            $(this).toggleClass('selected');
        });
        dataTablePartners.buttons().container()
            .appendTo($('div.column.is-half', dataTablePartners.table().container()).eq(0));
    });
}

var _PARTNERID = "";
//TODO ✅ INFO PARTNER
async function infoPartner(partnerID) {
    const idPartner = partnerID;
    window.location = `/workspace/partners/info/${idPartner}`;
}

//TODO ✅ DELETE PARTMNER
async function apiDelete(idPartner) {
    const urlDelete = `/api/partners/delete/${idPartner}`;
    fetch(urlDelete).then(() => {
        dataTablePartners.ajax.reload(null, false);
        setTimeout(() => {
            try {
                if ($('#stateInfoPartner').val() === '') { // 
                    window.location = `/workspace/partners/`;
                }
            } catch (error) { }
        }, 1000);
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
    }).then(async (result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: `Removed! partner with ID: ${idPartner}`,
                text: "The partner has been REMOVED.",
                icon: 'success',
                timer: 2000,
                confirmButtonText: 'OK',
            });
            await apiDelete(idPartner);
        }
    });
}

//TODO ✅ EDIT PARTNER
async function edit(partnerID) {
    opcion = "edit";
    const idPartner = partnerID;
    const urlGetPartner = `/api/partners/${idPartner}`;
    let checked = false;
    let partner_DNI = "";
    fetch(urlGetPartner)
        .then(response => response.json())
        .then(async (data) => {
            const check = data.activeFamily;
            if (check === 1) {
                checked = true;
                const urlGetDniFamily = `/api/familys/${data.dni}`;
                fetch(urlGetDniFamily)
                    .then(response => response.json())
                    .then(async data => {
                        partner_DNI = data.data.partnerDni;
                        partnerActiveCheck = data.data.partnerDni;
                        activeSelectDniFamily(partner_DNI);
                    });
            } else {
                checked = false;
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
                    <input class="Animation-input" type="date" id="actualDate" value='${moment(data.date).format("YYYY-MM-DD")}'>
                    <label class="Animation-label" for="date">Creation Date</label>
                `;
            }
            $(".modal-header").css(
                "background-color",
                "var(--Background-Color-forms-partner)"
            );
            $(".modal-header").css("color", "white");
        });
}

async function disabledFamilyLink() {
    $("#selectDni").html("");
    familyLink.classList.remove("isEnable");
    inputDni.focus();
}

async function activeSelectDniFamily(partner_DNI) {
    const urlSelectDni = "/api/partners/";
    if (inputDniCheck.checked) {
        setTimeout(() => {
            fetch(urlSelectDni, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                }
            })
                .then(response => response.json())
                .then(async data => await obtenerDni(data, partner_DNI))
                .catch(() =>
                    window.alert(
                        "There is no record in partners, to associate."
                    )
                );
            familyLink.classList.add("isEnable");
        }, 500);
    } else {
        await disabledFamilyLink();
    }
}

// TODO ✅ AL CAMBIAR CHECK
try {
    inputDniCheck.addEventListener("change", () => {
        activeSelectDniFamily();
    });
} catch (error) { }

// TODO ✅ AÑADE UN DNI ALEATORIO AL INPUT DNI
async function selectChange() {
    const index = selectDni.selectedIndex;
    if (index !== 0) {
        if (inputDni.value === "") {
            inputDni.value = rand_dni();
            inputDni.focus();
            inputDni.select();
        } else {
            selectDni.focus();
        }
    }
};

// TODO ✅ AÑADE DNI DE PARTNERS AL SELECT
async function obtenerDni(data, partner_DNI) {
    selectDni.innerHTML =
        '<option value="" disabled selected hidden>Select family member\'s DNI</option>';
    data.forEach(partner => {
        let option = document.createElement("option");
        option.value = partner.partnerID;
        option.text = partner.dni;
        selectDni.add(option);
        let sel = document.getElementById("selectDni");
        for (let i = 0; i < sel.length; i++) {
            let opt = sel[i];
            if (opt.text === partner_DNI) {
                $("#selectDni").val(opt.value);
                return;
            }
        }
    });
}