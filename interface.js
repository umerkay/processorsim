function getRegValue(reg) {
    return document.getElementById("r" + reg).innerHTML;
}

function setRegValue(reg,value) {
    document.getElementById("r"+reg).innerHTML = value;
}

function getMemValue(address) {
    return document.getElementById("m" + address).innerHTML;
}

function setMemValue(address, value) {
    document.getElementById("m"+address).innerHTML = value;
}