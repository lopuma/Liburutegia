//TODO ✅ CEROS POR DELANTE DEL ID 
    function fillZeros(id) {
        let num = id.toString();
        let large = 5;
        for (let i = 0; i < (large - num.length); i++) {
            num = "0" + num
        }
        return num
    }
    //TODO ✅ REMOVE CEROS POR DELANTE
    function removeZeros(id) {
        return id.toString().replace(/^0+/, "");
    }

//TODO ✅ FUNCION PARA CAMBIAR LAS TILDES
    const accentNeutralise = function (data) {
        return !data ?
            '' :
            typeof data === 'string' ?
                data
                    .replace(/\n/g, ' ')
                    .replace(/[áâàä]/g, 'a')
                    .replace(/[éêèë]/g, 'e')
                    .replace(/[íîìï]/g, 'i')
                    .replace(/[óôòö]/g, 'o')
                    .replace(/[úûùü]/g, 'u')
                    .replace(/ç/g, 'c') :
                data;
    };

// TODO ✅ CAPITALIZAR PRIMERA LETRA 
    function capitalizeFirstLetter(string) {
        return [...string].slice(0, 1).map(c => c.toUpperCase()).concat([...string].slice(1)).join("")
    }

// TODO ✅ CAPITALIZAR PRIMERA LETRA DE TODAS LA PAALABRAS
    function capitalizeWords(str) {
        return str.replace(/(^|\s)[a-zñ]/g, function (letter) {
            return letter.toUpperCase();
        });
    }

// TODO ✅ FUNCT DELETE BOOK
    async function apiBookDelete(idBook) {
        const urlDelete = `/api/books/delete/${idBook}`;
        await fetch(urlDelete)
            .then((response) => response.json())
            .then(async (data) => {
                await responseDeleteBook(data);
            });
    }

    const globalDeleteBook = async (idBook) => {
        window.location.href = "" + `#delete_book?${idBook}`;
        Swal.fire({
            title: "Are you sure?",
            text: "Are you sure you want to delete the BOOK!",
            icon: "warning",
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await apiBookDelete(idBook);
            }
        }) 
    }

// TODO ✅ RESPUESTA AL ELIMINAR BOOK
    async function responseDeleteBook(data) {
        const message = data.messageSuccess || data.errorMessage;
        const title = data.swalTitle;
        const success = data.success;
        if (success) {
            Swal.fire({
                title: title || "Success....!",
                text: message,
                icon: 'success',
                timer: 2000,
                confirmButtonText: 'OK',
            }).then(async () => {
                try {
                    if ($('#stateInfoBook').val() === '') { // 
                        window.location = `/workspace/books/`;
                    }
                    else {
                        await reloadDataBooks();
                    }
                } catch (error) { }
            });
        } else {
            Swal.fire({
                title: title || "Oops....!",
                text: message,
                icon: 'error',
                timer: 2000,
                confirmButtonText: 'OK',
            });
            setTimeout(async () => {
                await reloadDataBooks();
            }, 1000);
        }
    }

// TODO ✅ ACTIVA EL FOCU DEL ELEMENTO QUE TIENE ERROR
    function focusElementBooks() {
        if (field.title === false) {
            document.getElementById("inputTitle").focus();
            document.getElementById("inputTitle").select();
        } else if (!field.author) {
            document.getElementById("inputAuthor").focus();
            document.getElementById("inputAuthor").select();
        }
        Swal.fire('There are items required your attention.');
    }

// TODO ✅ CORRECT FORMS
    async function correctFormsBook(e) {
        e.preventDefault();
        if (field.purchaseDate &&
            field.numReference &&
            field.ISBN &&
            field.title &&
            field.author &&
            field.collection &&
            field.editorial &&
            field.language &&
            field.category &&
            field.observation
        ) {
            await dataBook();

        } else {
            focusElementBooks();
        }
    }

// TODO OBTENER CATEGORIAS 
    async function obtenerCategories(_category) {
        const bookCategory = _category;
        const urlCategory = '/api/books/'
        let valueCategory = [];
        $('#selectCategory').html("");
        await fetch(urlCategory)
            .then((response) => response.json())
            .then((data) => {
                data.forEach(element => {
                    if (element.type !== null && element.type !== undefined) {
                        if (!valueCategory.includes(element.type)) {
                            valueCategory.push(element.type);
                        }
                    }
                });
            })
            .catch(() =>
            window.alert(
                "There is no record in Catehory Book"
                ));
        try {
            valueCategory.forEach(element => {
                let option = document.createElement('option');
                option.value = element;
                option.text = element;
                inputType.add(option);
                
            });
            try {
                if (_STATEEDITBOOK || _STATEBOOK) {
                    let sel = document.getElementById("selectCategory");
                    for (let i = 0; i < sel.length; i++) {
                        let opt = sel[i];
                        if (opt.text === bookCategory) {
                            $("#selectCategory").val(opt.value);
                            return true;
                        }
                    }
                }
            } catch (error) { }
        } catch (error) { }
    }

// TODO ✅ FUNCT EDIT BOOK
    async function globalEditBook(idBook) {
        const bookID = idBook;
        window.location.href = ""+`#edit_book?${bookID}`;
        const urlDataEdit = `/api/books/${bookID}`;
        await fetch(urlDataEdit)
            .then(response => response.json())
            .then(async (datos) => {
                await obtenerCategories(datos.type);
                if (datos.purchase_date !== null) {
                    purchaseDate = moment(datos.purchase_date).format("YYYY-MM-DD");
                    inputPurchaseDate.value = purchaseDate;
                }
                inputNumReference.value = datos.numReference;
                inputBookID.value = datos.bookID;
                inputISBN.value = datos.isbn;
                inputTitle.value = datos.title;
                inputAuthor.value = datos.author;
                inputEditorial.value = datos.editorial;
                inputLanguage.value = datos.language;
                inputCollection.value = datos.collection;
                inputObservation.value = datos.observation;
            });
    }

//TODO ✅ VALIDAR FIELDS
    async function validateField(
        expresion,
        input,
        errorDivValidation,
        errorInputText,
        textError,
        inputField,
        info,
        closeInfo
    ) {
        if (!expresion.test(input.value.trim())) {
            input.classList.add("isError");
            document.getElementById(info).classList.add("isVisible");
            field[inputField] = false;
        } else {
            inputsCorrectValidate(errorDivValidation, errorInputText, input, info, closeInfo, inputField);
        }
        // MENSAJES
        try {
            document.getElementById(info).addEventListener("click", () => {
                activesInfos[inputField] = true;
                document.getElementById(info).classList.remove("isVisible");
                document.getElementById(closeInfo).classList.add("isVisible");
                document.getElementById(errorDivValidation).classList.add("isActive");
                document.getElementById(errorInputText).innerHTML = textError;
                // LLAMADA ABRIR LOS MENSAJES
                infoReviewError();
            });
        } catch (error) { }

        try {
            document.getElementById(closeInfo).addEventListener("click", () => {
                activesInfos[inputField] = false;
                document.getElementById(info).classList.add("isVisible");
                document.getElementById(closeInfo).classList.remove("isVisible");
                document.getElementById(errorDivValidation).classList.remove("isActive");
                document.getElementById(errorInputText).innerHTML = "";
                // LLAMADA A CERRAR LOS MENSAJES
                closeReviewError();
            });
        } catch (error) { };
        return true;
    }

//TODO ✅ VALIDACIONES EXPRESSIONES
    async function fieldEmpty(
        expression, // EXPRESION DEL INPUT
        input, // EL IMPUT
        errorDivValidation, //EL DIV DODE MUESTRA EL ERROR
        errorInputText, // EL LABEL DEL ERROR
        textError, // EL TEXTO DEL ERROR
        inputField, //SI EL FIELD INPUT SEA TRUE O FALSE
        info, //BOTON QUE MUESTRA EL ERROR
        closeInfo // BOTON QUE CIERRA EL ERROR
    ) {
        if (input.value.trim() !== "") {
            await validateField(
                expression,
                input,
                errorDivValidation,
                errorInputText,
                textError,
                inputField,
                info,
                closeInfo
            );
        } else {
            inputsCorrectValidate(errorDivValidation, errorInputText, input, info, closeInfo, inputField);
        }
        return true;
    }

//TODO ✅ CIERRA LOS MENSAJE SI TODO ES OK
    function closeReviewError() {
        try {
            if (activesInfos["title"] === false && activesInfos["author"] === false) {
                document.getElementById("inputBoxTitle").removeAttribute("data-error");
                document.getElementById("inputBoxAuthor").removeAttribute("data-error");
            }
        } catch (error) { }
        try {
            if (activesInfos["name"] === false && activesInfos["lastname"] === false) {
                document.getElementById("inputBoxName").removeAttribute("data-error");
                document.getElementById("inputBoxLastname").removeAttribute("data-error");
            }
        } catch (error) { }
        try {
            if (activesInfos["mobile"] === false && activesInfos["landline"] === false) {
                document.getElementById("inputBoxMobile").removeAttribute("data-error");
                document.getElementById("inputBoxLandline").removeAttribute("data-error");
            }
        } catch (error) { }
    }

//TODO ✅ ABRE LOS MENSAJE SI TODO ES OK
    function infoReviewError() {
        try {
            if (activesInfos["title"] === true && activesInfos["author"] === true || activesInfos["title"] === true && activesInfos["author"] === false) {
                document.getElementById("inputBoxTitle").setAttribute("data-error", "");
                document.getElementById("inputBoxAuthor").setAttribute("data-error", "");
                return true;
            }
        } catch (error) { }
        try {
            if (activesInfos["author"] === true && activesInfos["title"] === true || activesInfos["author"] === true && activesInfos["title"] === false) {
                document.getElementById("inputBoxTitle").setAttribute("data-error", "");
                document.getElementById("inputBoxAuthor").setAttribute("data-error", "");
            }
        } catch (error) { }
        try {
            if (activesInfos["name"] === true && activesInfos["lastname"] === true || activesInfos["name"] === true && activesInfos["lastname"] === false) {
                document.getElementById("inputBoxName").setAttribute("data-error", "");
                document.getElementById("inputBoxLastname").setAttribute("data-error", "");
            }
        } catch (error) { }
        try {
            if (activesInfos["lastname"] === true && activesInfos["name"] === true || activesInfos["lastname"] === true && activesInfos["name"] === false) {
                document.getElementById("inputBoxName").setAttribute("data-error", "");
                document.getElementById("inputBoxLastname").setAttribute("data-error", "");
            }
        } catch (error) { }
        try {
            if (activesInfos["mobile"] === true && activesInfos["landline"] === true || activesInfos["mobile"] === true && activesInfos["landline"] === false) {
                document.getElementById("inputBoxMobile").setAttribute("data-error", "");
                document.getElementById("inputBoxLandline").setAttribute("data-error", "");
            }
        } catch (error) { }
        try {
            if (activesInfos["landline"] === true && activesInfos["mobile"] === true || activesInfos["landline"] === true && activesInfos["mobile"] === false) {
                document.getElementById("inputBoxMobile").setAttribute("data-error", "");
                document.getElementById("inputBoxLandline").setAttribute("data-error", "");
            }
        } catch (error) { }
    }

//TODO ✅ FUNCION QUE VALIDA LOS INPUTS HAYA O NO DATOS
    function inputsCorrectValidate(errorDivValidation, errorInputText, input, info, closeInfo, inputField) {
        document.getElementById(errorDivValidation).classList.remove("isActive");
        document.getElementById(errorInputText).innerHTML = "";
        input.classList.remove("isError");
        document.getElementById(info).classList.remove("isVisible");
        document.getElementById(closeInfo).classList.remove("isVisible");
        field[inputField] = true;
        activesInfos[inputField] = false;
        closeReviewError();
        return true;
    }

// TODO CIERRE DE MODAL
    async function ClosePopup(modal) {
        $(modal).modal('hide');
        $(modal).hide();
        $('.modal-backdrop').remove()
        document.querySelector(".Body").classList.remove('modal-open');
        document.querySelector(".Body").setAttribute("style", "");
    }

// TODO LOAD DNI
    async function loadDni(data) {
        $("#selectDniReserve").html("");
        document.getElementById("reservePartnerID").value = "";
        const partners = data;
        if(partners.data !== null){
            partners.forEach(partner => {
                const option = document.createElement("option");
                option.value = partner.partnerID;
                option.text = partner.dni;
                document.getElementById("selectDniReserve").add(option);
            })
            if (partners.length <= 1) {
                const sel = document.getElementById("selectDniReserve");
                const opt = sel[0];
                $("#selectDniReserve").val(opt.value);
                document.getElementById("reservePartnerID").value = fillZeros(opt.value);
                //return true;
            }
            $(".selectDniReserve").select2({
                placeholder: "Select DNI Partner",
            });
        } else {
            window.alert(partners.messageNotFound);
            document.getElementById('validationReserveDni').classList.add('isActive');
            document.getElementById('inputReservePartnerID').setAttribute('data-error', "");
            document.getElementById('inputReservePartnerDni').setAttribute('data-error', "");
            document.getElementById('errorReserveDni').innerHTML = "[ Error ] : Don't exists partners register in the BD, please add new partner, for reserve BOOKS.";
        }
    }
// TODO LOAD TITLE
    async function loadTitle(data) {
        $("#reserveSelectTitle").html("");
        document.getElementById("reserveBookID").value = "";
        const books = data;
        books.forEach(book => {
            if (book.reserved === 0) {
                const option = document.createElement("option");
                option.value = book.bookID;
                option.text = book.title;
                document.getElementById("reserveSelectTitle").add(option);
            }
        })
        if (books.length <= 1) { 
            const sel = document.getElementById("reserveSelectTitle");
            const opt = sel[0];
            $("#reserveSelectTitle").val(opt.value);
            document.getElementById("reserveBookID").value = fillZeros(opt.value);
        }
        $(".reserveSelectTitle").select2({
            placeholder: "Select BOOK Title",
        });
    }

// TODO LOAD DNI PÀRTNER
    const extractDataFormReserve = async (idBook, titleBook, idPartner, dniPartner) => {
        const bookID = idBook;
        const bookTitle = titleBook;
        const partnerID = idPartner;
        const partnerDni = dniPartner;
        if (bookID !== null && bookTitle !== null) { 
            const data = [{
                bookID,
                title: bookTitle,
                reserved: 0
            }];
            await loadTitle(data)
        } else {
            const urlTitleBooks = `/api/books/`;
            fetch(urlTitleBooks, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                }
            })
                .then(response => response.json())
                .then(async data => await loadTitle(data));
        }
        if (partnerID === null && partnerDni === null) {
            const urlPartners = "/api/partners/"
            fetch(urlPartners, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                }
            })
                .then(response => response.json())
                .then(async data => await loadDni(data));
        } else {
            const data = [{
                partnerID,
                dni: partnerDni
            }];
            await loadDni(data)
        }
    }

// TODO RESERVE BOOK 
    async function globalReserveBook(idBook, titleBook, idPartner, dniPartner) {
        const bookID = idBook;
        const bookTitle = titleBook;
        const partnerID = idPartner;
        const partnerDni = dniPartner;
        window.location.href = ""+`#reserve_book?${bookID}`;
        await extractDataFormReserve(bookID, bookTitle, partnerID, partnerDni);
        document.getElementById("reserveDate").value = moment(new Date()).format("YYYY-MM-DD");
    }

// DELIVER
// TODO ✅ ENTEGA DEL LIBRO
async function deliverBook(bookID, bookingID) {
    try {
        const idBook = bookID;
        const idBooking = bookingID;
        //_PARTNERID = partnerID;
        const urlDeliver = `/api/books/deliver/${idBook}`;
        let dateActual = new Date();
        dateActual = moment(dateActual).format("YYYY-MM-DD HH:mm");
        Swal.fire({
            title: 'Deliver',
            text: `Do you want to add a review, for the book : ${idBook} ?`,
            icon: 'warning',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#474E68',
            confirmButtonText: 'Yes',
            denyButtonText: `Don't review`,
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                $("#deliverPartnerID").val(_PARTNERID);
                $("#bookID").val(idBook);
                $("#bookingID").val(idBooking);
                $('#modalStar').modal('show');
            } else if (result.isDenied) {
                const data = {
                    bookingID: idBooking,
                    score: 0,
                    review: null,
                    deliver_date_review: dateActual,
                    reviewOn: 0
                }
                fetch(urlDeliver, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8"
                    }
                })
                try {
                    inforActive(_PARTNERID);
                } catch (error) { }
                try {
                    if (_STATEBOOKINGS) {
                        await reloadDataBookings();
                        // location.reload(true);
                    }
                } catch (error) { }
            }
        })
    } catch (error) {
        console.error(":error ", error)
    }
}

function generarNuevoColor(){
    var simbolos, color;
    simbolos = "0123456789ABCDEF";
    color = "#";

    for(var i = 0; i < 6; i++){
        color = color + simbolos[Math.floor(Math.random() * 16)];
    }

    return color;
}