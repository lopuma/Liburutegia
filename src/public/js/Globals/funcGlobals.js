
//TODO ✅ CEROS POR DELANTE DEL ID 
function fillZeros(id) {
    let num = id.toString();
    let large = 10;
    for (let i = 0; i < (large - num.length); i++) {
        num = "0" + num
    }
    return num
}