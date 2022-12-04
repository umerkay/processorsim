function getRegValue(reg, size = 16) {
    if(globalRuntimeError) return "";
    if(size === 8) return document.getElementById("r"+reg).innerHTML.slice(2, 4);
    return document.getElementById("r" + reg).innerHTML;
}

function setRegValue(reg, value, size = 16) {
    if(globalRuntimeError) return "";
    let regel = document.getElementById("r"+reg);
    regel.classList.add("animating");

    if(size === 8) regel.innerHTML = regel.innerHTML.slice(0, 2) + value.padStart(2, '0').toUpperCase();
    else regel.innerHTML = value.padStart(4, '0').toUpperCase();

    setTimeout(() => regel.classList.remove("animating"), 600);
}

function getMemValue(address, byte = 2) {
    if(globalRuntimeError) return "";
    try {
        if (byte === 1) {
            return document.getElementById("m" + address.padStart(5, '0').toUpperCase()).innerHTML;
        } else {
            ret = document.getElementById("m" + address.padStart(5, '0').toUpperCase()).innerHTML + document.getElementById("m" + (parseInt(address, 16) + 1).toString(16).padStart(5, '0').toUpperCase()).innerHTML;
            return ret;
        }
        
    } catch(e) {
        globalRuntimeError = "Error writing to memory"
    }
}

function setMemValue(address, value) {
    if(globalRuntimeError) return "";
    try {
        if (parseInt(value, 16).toString(16).length > 2) {
            let memel1 = document.getElementById("m" + address.padStart(5, '0').toUpperCase());
            let memel2 = document.getElementById("m" + (parseInt(address,16)+1).toString(16).padStart(5, '0').toUpperCase());
            memel1.classList.add("animating");
            memel2.classList.add("animating");

            memel1.innerHTML = value.substring(0,2);
            memel2.innerHTML = value.substring(2);

            setTimeout(() => {
                memel1.classList.remove("animating");
                memel2.classList.remove("animating");
            }, 600);
            
        } else {
            let memel1 = document.getElementById("m"+address.padStart(5, '0').toUpperCase());
            memel1.classList.add("animating");

            memel1.innerHTML = parseInt(value, 16).toString(16).padStart(2, '0').toUpperCase();

            setTimeout(() => {
                memel1.classList.remove("animating");
            }, 600);
        }
    } catch(e) {
        globalRuntimeError = "Error writing to memory";
    }
}

async function executeAll() {
    if(instructions.length === 0) alert("Assemble program first")
    document.getElementById("execbtn").disabled = true;
    document.getElementById("asmbbtn").disabled = true;
    document.getElementById("execOnebtn").disabled = true;
    document.getElementById("resetbtn").disabled = true;
    document.getElementById("tglBlocks").disabled = true;

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
    document.getElementById("tglBlocks").disabled = false;
}

function executeNext() {
    if(globalRuntimeError || globalCompilerError) return;
    resetError("");
    // console.log("hiihihi")
    if(parseInt(getRegValue(regs["PC"].code), 16) < instructions.length) {
        executeInstruction(instructions[parseInt(getRegValue(regs['PC'].code),16)]);
    } else {
        alert("All instructions executed.")
        // console.log("All instructions executed");
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

let animationDelay = 1000;

async function animateFetch(x) {
    processorConnections["cu_mem"].color = "blue";
    processorConnections["cu_mem"].startPlug = "arrow1";
    processorConnections["cu_mem"].startLabel = "FETCH CYCLE";
    // processorConnections["cu_mem"].dash = {animation: true};

    setRegValue("ir", parseInt(x.machCode, 2).toString(16).padStart(x.machCode.length/4, "0"));
    
    // setRegValue(regs["PC"].code, (parseInt(getRegValue(regs["PC"].code), 16) + 1).toString(16));
    await delay(animationDelay/2);
    processorConnections["cu_mem"].color = "rgba(219, 219, 219 ,1)";
    processorConnections["cu_mem"].startPlug = "square";
    processorConnections["cu_mem"].startLabel = "";
    await delay(animationDelay/2);
}

async function animateDecode(x) {

    document.getElementById("cu").classList.add("animate");
    await delay(animationDelay/2);
    document.getElementById("cu").classList.remove("animate");
    setRegValue("ir", x.orgInstr.toLowerCase());
    await delay(animationDelay/2);

}

async function animateFetchOperand(didAccessMemory, dest, src) {
    processorConnections["regs_alu"].color = "blue";
    processorConnections["regs_alu"].endPlug = "arrow1";
    processorConnections["cu_regs"].color = "blue";
    processorConnections["cu_regs"].endPlug = "arrow1";
    processorConnections["alu_cu"].startPlug = "arrow1";
    processorConnections["alu_cu"].color = "blue";

    if(didAccessMemory) {
        processorConnections["alu_mem"].color = "blue";
        processorConnections["alu_mem"].startPlug = "arrow1";
        processorConnections["alu_mem"].endLabel = "FETCH OPERAND";
    }

    await delay(animationDelay/2);

    if(src) {
        setRegValue("a1", src);
    }
    if(dest) {
        setRegValue("a0", dest);
    }

    await delay(animationDelay/2);

    processorConnections["regs_alu"].color = "rgba(219, 219, 219, 1)";
    processorConnections["regs_alu"].endPlug = "square";
    processorConnections["cu_regs"].color = "rgba(219, 219, 219, 1)";
    processorConnections["alu_cu"].color = "rgba(219, 219, 219, 1)";
    processorConnections["alu_cu"].startPlug = "square";
    processorConnections["cu_regs"].endPlug = "square";

    if(didAccessMemory) {
        processorConnections["alu_mem"].color = "rgba(219, 219, 219, 1)";
        processorConnections["alu_mem"].startPlug = "square";
        processorConnections["alu_mem"].endLabel = "";
    }
}

async function animateExecute(result) {
    document.getElementById("alu").classList.add("animate");

    await delay(animationDelay/2);

    if(result) setRegValue("a1", result);
    // setRegValue("a1", "0000");
    document.getElementById("alu").classList.remove("animate");

    await delay(animationDelay/2);
}

async function animateStore(storetype) {
    if(storetype == "REG") {
        processorConnections["regs_alu"].color = "blue";
        processorConnections["regs_alu"].startPlug = "arrow1";
    
        await delay(animationDelay/2);
    
        processorConnections["regs_alu"].color = "rgba(219, 219, 219, 1)";
        processorConnections["regs_alu"].startPlug = "square";
    } else {
        processorConnections["alu_mem"].color = "blue";
        processorConnections["alu_mem"].endPlug = "arrow1";
        processorConnections["alu_mem"].endLabel = "STORE CYCLE";

        await delay(animationDelay/2);

        processorConnections["alu_mem"].color = "rgba(219, 219, 219, 1)";
        processorConnections["alu_mem"].endPlug = "square";
        processorConnections["alu_mem"].endLabel = "";
        await delay(animationDelay/2);
    }
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