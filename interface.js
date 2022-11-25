function getRegValue(reg, size = 16) {
    if(globalRuntimeError) return "";
    if(size === 8) return document.getElementById("r"+reg).innerHTML.slice(0, 2);
    return document.getElementById("r" + reg).innerHTML;
}

function setRegValue(reg, value, size = 16) {
    if(globalRuntimeError) return "";
    if(size === 8) document.getElementById("r"+reg).innerHTML = document.getElementById("r"+reg).innerHTML.slice(0, 2) + value.padStart(2, '0').toUpperCase();
    else document.getElementById("r"+reg).innerHTML = value.padStart(4, '0').toUpperCase();
}

function getMemValue(address) {
    if(globalRuntimeError) return "";
    try {
        return document.getElementById("m" + address.padStart(5, '0').toUpperCase()).innerHTML;
    } catch(e) {
        globalRuntimeError = "Error writing to memory"
    }
}

function setMemValue(address, value) {
    if(globalRuntimeError) return "";
    try {
        document.getElementById("m"+address.padStart(5, '0').toUpperCase()).innerHTML = value.padStart(4, '0').toUpperCase();
    } catch(e) {
        globalRuntimeError = "Error writing to memory";
    }
}

async function executeAll() {
    if(globalRuntimeError || globalCompilerError) return;
    resetError("");
    setRegValue(regs["PC"].code, "0000");
    instructions.forEach(executeInstruction);

    // for(let i = 0; i < instructions.length; i++) {
    //     await (new Promise(() => setTimeout(() => executeInstruction(instructions[i]), 500)));
    // }
}

function executeNext() {
    if(globalRuntimeError || globalCompilerError) return;
    resetError("");
    if(parseInt(getRegValue(regs["PC"].code), 16) < instructions.length) {
        executeInstruction(instructions[parseInt(getRegValue(regs['PC'].code),16)]);
    } else {
        console.log("All instructions executed");
    }
}

function reset() {
    globalRuntimeError = false;
    resetError("");

    for(reg in regs) {
        setRegValue(regs[reg].code, "0000");
    }

    for(let i = 0; i < memLocs; i++) {
        setMemValue(i.toString(16), "0000");
    }
}

function displayError(err) {
    document.getElementById("asmoutput").innerHTML = err;
    document.getElementById("asmoutput").classList.add("err");
}

function resetError() {
    if(document.getElementById("asmoutput").classList.contains("err")) {
        document.getElementById("asmoutput").innerHTML = "";
        document.getElementById("asmoutput").classList.remove("err");
    }
}