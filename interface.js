function getRegValue(reg, size = 16) {
    if(globalRuntimeError) return "";
    if(size === 8) return document.getElementById("r"+reg).innerHTML.slice(2, 4);
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
    document.getElementById("execbtn").disabled = true;
    document.getElementById("asmbbtn").disabled = true;
    document.getElementById("execOnebtn").disabled = true;
    document.getElementById("resetbtn").disabled = true;

    if(globalRuntimeError || globalCompilerError) return;
    resetError("");
    setRegValue(regs["PC"].code, "0000");
    // instructions.forEach(executeInstruction);

    for(let i = 0; i < instructions.length; i++) {
        await executeInstruction(instructions[i]);
    }

    document.getElementById("execbtn").disabled = false;
    document.getElementById("asmbbtn").disabled = false;
    document.getElementById("execOnebtn").disabled = false;
    document.getElementById("resetbtn").disabled = false;
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
        setMemValue(i.toString(16), "00");
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

let processorMode = false;

let processorConnections = {};

function connect(a, b, objs = {}) {
    processorConnections[a+"_"+b] = new LeaderLine(
        document.getElementById(a),
        document.getElementById(b),
        { path: "grid", startPlug: "square", endPlug: "square", color: 'rgba(219, 219, 219 ,1)', ...objs }
    );
}

let animationDelay = 500;

async function animateFetch(x) {
    processorConnections["cu_mem"].color = "blue"
    processorConnections["cu_mem"].startPlug = "arrow1"
    // processorConnections["cu_mem"].dash = {animation: true};

    document.getElementById("rir").innerHTML = parseInt(x.machCode, 2).toString(16).padStart(x.machCode.length/4, "0");
    setRegValue(regs["PC"].code, (parseInt(getRegValue(regs["PC"].code), 16) + 1).toString(16));
    await delay(animationDelay);
    processorConnections["cu_mem"].color = "rgba(219, 219, 219 ,1)";
    processorConnections["cu_mem"].startPlug = "square";
}

async function animateDecode(x) {

    document.getElementById("cu").classList.add("animate");
    await delay(animationDelay);
    document.getElementById("cu").classList.remove("animate");
    document.getElementById("rir").innerHTML = x.orgInstr.toLowerCase();
}

async function animateFetchOperand(didAccessMemory, dest, src) {
    processorConnections["regs_alu"].color = "blue";
    processorConnections["regs_alu"].endPlug = "arrow1";

    if(didAccessMemory) {
        processorConnections["alu_mem"].color = "blue";
        processorConnections["alu_mem"].startPlug = "arrow1";
    }

    await delay(animationDelay);

    if(dest) document.getElementById("a0").innerHTML = dest;
    if(src) document.getElementById("a1").innerHTML = dest;

    processorConnections["regs_alu"].color = "rgba(219, 219, 219, 1)";
    processorConnections["regs_alu"].endPlug = "square";

    if(didAccessMemory) {
        processorConnections["alu_mem"].color = "rgba(219, 219, 219, 1)";
        processorConnections["alu_mem"].startPlug = "square";
    }
}

async function animateExecute(result) {
    document.getElementById("alu").classList.add("animate");

    await delay(animationDelay);

    if(result) document.getElementById("a0").innerHTML = result;
    document.getElementById("alu").classList.remove("animate");

}

async function animateStore() {
    processorConnections["alu_mem"].color = "blue";
    processorConnections["alu_mem"].endPlug = "arrow1";

    await delay(animationDelay);

    processorConnections["alu_mem"].color = "rgba(219, 219, 219, 1)";
    processorConnections["alu_mem"].endPlug = "square";
}

function toggleProcessorMode() {
    processorMode = !processorMode;
    if(processorMode) {
        document.getElementById("main").classList.add("task2");
        // document.getElementById("rightUI").removeChild(document.getElementById("regs"));
        document.getElementById("leftUI").appendChild(document.getElementById("regs"));
        // document.getElementById("mem").appendChild(document.getElementById("asmoutput"));
        setTimeout(() => {
            connect("regs", "alu", {startSocket: 'right', endSocket: 'right'});
            connect("alu", "cu", {startSocket: 'left', endSocket: 'left'});
            connect("cu", "regs", {startSocket: 'left', endSocket: 'left'});
            connect("alu", "mem", {startSocket: 'right', endSocket: 'left'});
            connect("cu", "mem", {startSocket: 'right', endSocket: 'bottom'});
            // connect("cu", "bu");
            // connect("bu", "mem", {startSocket: 'right', endSocket: 'bottom'});
        }, 200);
        //if not error
        if(!globalCompilerError && !globalRuntimeError)
            document.getElementById("asmoutput2").innerHTML = document.getElementById("asmoutput").innerHTML;


        
    } else {
        for(let c in processorConnections) {
            processorConnections[c]?.remove();
        }
        // document.getElementById("asminpcontainer").appendChild(document.getElementById("asmoutput"));
        document.getElementById("main").classList.remove("task2");
        document.getElementById("rightUI").appendChild(document.getElementById("regs"));
    }
}