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
function capitalizeWords(string) {
    return string.replace(/\b[a-z]/gi, function (char) {
        return char.toUpperCase();
    });
}

// TODO ✅ FUNCT DELETE BOOK
async function apiBookDelete(idBook) {
    const urlDelete = `/api/books/delete/${idBook}`;
    await fetch(urlDelete)
        .then((response) => response.json())
        .then(async (data) => {
            Swal.fire({
                title: `Removed! Book with ID: ${idBook}`,
                text: data.messageSuccess,
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
            })
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
    }).then((result) => {
        if (result.isConfirmed) {
            apiBookDelete(idBook);
        }
    });
}

// TODO ✅ CORRECT FORMS
async function correctFormsBook(e) {
    e.preventDefault();
    if (fieldsFormBook.purchaseDate &&
        fieldsFormBook.ISBN &&
        fieldsFormBook.title &&
        fieldsFormBook.author &&
        fieldsFormBook.collection &&
        fieldsFormBook.editorial &&
        fieldsFormBook.language &&
        fieldsFormBook.category &&
        fieldsFormBook.observation
    ) {
        await dataBook();

    } else {
        await window.alert("There are items required your attention.");
        //document.querySelector('.select2-container').classList.add('isSelectError');
    }
}

// TODO OBTENER CATEGORIAS 
async function obtenerCategories(_category) {
    console.log("cuando te cargas")
    const bookCategory = _category;
    const urlCategory = '/api/books/'
    let valueCategory = [];
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
        if (_STATEEDITBOOK || _STATEBOOK) { //
            // TODO ✅ CARGA LAS FUNCIONES DE SELECT2

        
        
        valueCategory.forEach(element => {
            let option = document.createElement('option');
            option.value = element;
            option.text = element;
            inputType.add(option);
            let sel = document.getElementById("selectCategory");
            for (let i = 0; i < sel.length; i++) {
                let opt = sel[i];
                if (opt.text === bookCategory) {
                    $("#selectCategory").val(opt.value);
                    return;
                }
            }
        });
    }
    } catch (error) { }
try {
    if (_STATENEWBOOK) { // 
        valueCategory.forEach(element => {
            let option = document.createElement('option');
            option.value = element;
            option.text = element;
            inputType.add(option);
        });
    }
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
            "color": "#fff"
        });
        });
}
