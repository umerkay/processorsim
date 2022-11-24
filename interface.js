function getRegValue(reg) {
    return document.getElementById("r" + reg).innerHTML;
}

function setRegValue(reg,value) {
    console.log("r" + reg, value);
    document.getElementById("r"+reg).innerHTML = value.padStart(4, '0').toUpperCase();
}

function getMemValue(address) {
    console.log(address);
    return document.getElementById("m" + address.padStart(5, '0').toUpperCase()).innerHTML;
}

function setMemValue(address, value) {
    console.log(address);
    document.getElementById("m"+address.padStart(5, '0').toUpperCase()).innerHTML = value.padStart(4, '0').toUpperCase();
}