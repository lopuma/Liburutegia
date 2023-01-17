//TODO ✅ CEROS POR DELANTE DEL ID 
    function fillZeros(id) {
        let num = id.toString();
        let large = 10;
        for (let i = 0; i < (large - num.length); i++) {
            num = "0" + num
        }
        return num
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
        });
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
        const urlDataEdit = `/api/books/${bookID}`;
        await fetch(urlDataEdit)
            .then(response => response.json())
            .then(async (datos) => {
                await obtenerCategories(datos.type);
                if (datos.purchase_date !== null) {
                    purchaseDate = moment(datos.purchase_date).format("YYYY-MM-DD");
                    inputPurchaseDate.value = purchaseDate;
                }
                inputBookID.value = datos.bookID;
                inputISBN.value = datos.isbn;
                inputTitle.value = datos.title;
                inputAuthor.value = datos.author;
                inputEditorial.value = datos.editorial;
                inputLanguage.value = datos.language;
                inputCollection.value = datos.collection;
                inputObservation.value = datos.observation;
                $(".modal-header").css(
                    "background-color",
                    "var(--Background-Color-forms-book)"
                );
                $(".modal-title").text("EDIT BOOK").css({
                    "font-weight": "600",
                    "font-size": "1.3em",
                    "color": "var(--Color-forms-book)"
                });
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
