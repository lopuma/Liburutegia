const spinner = document.getElementById("spinner");
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
const inputEmail = document.getElementById("inputEmail");


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
        spinner.style.display = "none";
    } catch (error) { }
}, "1600");

//TODO ✅ SELECT 
$(document).ready(function () {
    theme: "bootstrap4", $(".js-example-basic-single").select2();
});

//TODO ✅ LOAD PARTNER
async function loadData() {
    const urlLoad = "/api/partners/";
    $(document).ready(() => {
        myTable = $("#tablePartner").DataTable({
            ajax: {
                url: urlLoad,
                dataSrc: "",
            },
            language: {
                emptyTable: "No data available in table Partners"
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
                { data: "partnerID", visible: false },
                { data: "dni" },
                { data: "name" },
                { data: "lastname" },
                { data: "phone1" },
                { data: "phone2" },
                { data: "email" },
                {
                    data: null,
                    render: function (data) {
                        return (
                            `
                            <div class="ui buttons">
                                <button id="btnInfoPartner" onClick=infoPartner(` + data.partnerID + `) class="btn btn-outline-warning" title="Info Partner"><i class="fa-sharp fa-solid fa-eye"></i></button>
                                <button id="btnEditPartner" onClick=edit(` + data.partnerID + `) type="button"  class="btn btn-outline-primary" title="Edit Partner" data-toggle="modal" data-target="#modalPartner" href="#edit"><i class="fa-regular fa-pen-to-square"></i></button>
                                <button id="btnDeletePartner" onClick=deletePartner(` + data.partnerID + `) class="btn btn-outline-danger" title="Delete Partner"><i class="fa-solid fa-trash-can"></i></button>
                            </div>
                            `
                        );
                    }
                }
            ]
        });
    });
}

//TODO ✅ INFO PARTNER
async function infoPartner(partnerID) {
    const idPartner = partnerID;
    window.location = `/workspace/partners/info/${idPartner}`;
}

//TODO ✅ DELETE PARTMNER
async function partnerDelete(idPartner) {
    const url = `/api/partners/delete/${idPartner}`
    fetch(url).then(() => {
        myTable.destroy();
        tbodyPartners.innerHTML = "";
        setTimeout(() => {
            loadData();
        }, 500);
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
        .then(data => {
            const check = data.activeFamily;
            if (check === 1) {
                checked = true;
                const urlGetDniFamily = `/api/family/${data.dni}`;
                fetch(urlGetDniFamily)
                    .then(response => response.json())
                    .then(async data => {
                        partner_DNI = data.data.partnerDni;
                        activeSelectDniFamily(partner_DNI);
                    });
            } else {
                checked = false;
                $("#selectDni").html("");
                familyLink.classList.remove("isEnable");
                inputDni.focus();
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
            $(".modal-header").css(
                "background-color",
                "var(--Background-Color-forms-partner)"
            );
            $(".modal-header").css("color", "white");
        });
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
        }, 500);
        familyLink.classList.add("isEnable");
    } else {
        $("#selectDni").html("");
        familyLink.classList.remove("isEnable");
        //inputDni.value = "";
        inputDni.focus();
    }
}

inputDniCheck.addEventListener("change", () => {
    activeSelectDniFamily();
});

async function myFunction() {
    const index = selectDni.selectedIndex;
    if (index !== 0) {
        if (inputDni.value === "") {
            inputDni.value = rand_dni();
            selectDni.focus();
        } else {
            selectDni.focus();
        }
    }
};

// TODO AÑADE DNI DE PARTNERS
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
    })
        .then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Removed! partner with ID: " + idPartner, "Your Partner has been deleted.", "success", partnerDelete(idPartner));
            }
        });
}

//TODO UPDATE PARTNER
$('#formu').submit(async function (e) {
    e.preventDefault();
    const url = `/api/partners/update/${partnerID}`
    let data = {
        partnerID: $.trim($('#partnerID').val()),
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
    tbodyPartners.innerHTML = "";
    setTimeout(() => {
        loadData();
    }, 500);
});