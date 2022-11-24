let instructions;

function parseAssembly(text) {
    instructions = text.split("\n").filter(x => x != 0);
    instructions = instructions.map(instructionToMachine);
    document.getElementById("asmoutput").innerHTML = instructions.map(x => parseInt(x.machCode, 2).toString(16)).join("\n");
    // console.log(instructions);
    // for(let i = 0; i < instructions.length; i++) {
    //     instructionToMachine(instructions[i],i);
    // }
}

function parseOperand(op) {
    let result = {};
    if (op[0] == '[') {
        result.isMemory = true;
        inner = op.match(/\[([^)]+)\]/)[1];
        if (regs[inner] != undefined) {
            result.regORhex = "R";
            result.code = regs[inner].code;
            result.length = regs[inner].length;
        } else {
            result.regORhex = "H";
            result.code = inner;
            result.length = 0;
        }
    } else {
        result.isMemory = false;
        if (regs[op] != undefined) {
            result.regORhex = "R";
            result.code = regs[op].code;
            result.length = regs[op].length;
        } else {
            result.regORhex = "H";
            result.code = op;
            result.length = 0;
        }
    }
    return result;
    
}

function instructionToMachine(instr, i) {
    // console.log(instr);
    let op = instr.split(" ")[0].toUpperCase();
    let operands = instr.split(" ").slice(1).join("").toUpperCase().split(",");

    let op1 = parseOperand(operands[0]);
    let op2 = parseOperand(operands[1]);
    return instrSet[op].finalParse(op1, op2);
}

function executeAll() {
    setRegValue(regs["PC"].code, "0000")
    instructions.forEach(executeInstruction);
}

function executeNext() {
    if(parseInt(getRegValue(regs["PC"].code), 16) < instructions.length) {
        executeInstruction(instructions[parseInt(getRegValue(regs['PC'].code),16)]);
    } else {
        console.log("All instructions executed");
    }
}

function executeInstruction(instruction) {
    let {opcode, D, W, MOD, Reg, RsM, imORadd} = instruction;
    let imORaddCNV = parseInt(imORadd.substring(8) + imORadd.substring(0,8), 2).toString(16);
    if(opcode == instrSet["MOV"].opcode) {
        if(D === "1") {
            if(MOD === "11") { //mov ax, bx
                setRegValue(Reg, getRegValue(RsM), W == "1" ? 16 : 8)
            } else { //MOD == 00
                //mox ax, [bx OR 1234H]
                setRegValue(Reg, getMemValue(((RsM === "110" && imORadd !== "") ? imORaddCNV : getRegValue(RsM))));
            }
        } else { //D == 0
            //mov [ax], bx
            //mov [1234], bx
            setMemValue((RsM === "110" && imORadd !== "") ? imORaddCNV : getRegValue(RsM), getRegValue(Reg));
        }
    } else if (opcode === "110001") setMemValue(getRegValue(RsM), imORaddCNV);
    else if(opcode === "1011") setRegValue(Reg, imORaddCNV);

    setRegValue(regs["PC"].code, (parseInt(getRegValue(regs["PC"].code), 16) + 1).toString(16))
}


function hexToBinary(hex) {
    let result;
    result = parseInt(hex, 16).toString(2);
    while (result.length < 16) {
        result = "0" + result;
    }
    return result;
}