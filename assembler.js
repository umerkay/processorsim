let code = 
`MOV bx, 1234
mov [ax], 1234
MOV ax, [bx]`;


function parseAssembly(text) {
    console.log(text);
    let instructions = text.split("\n").filter(x => x != 0);
    for(let i = 0; i < instructions.length; i++) {
        instructionToMachine(instructions[i],i);
    }
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
    console.log(instrSet[op].finalParse(op1, op2));

}

function executeInstruction(instruction) {
    let {opcode, D, W, MOD, Reg, RsM, imORadd} = instruction;
    if(opcode == instrSet["MOV"].opcode) {
        if(D === "1") {
            if(MOD === "11") { //mov ax, bx
                setRegValue(Reg, getRegValue(RsM), W == "1" ? 16 : 8)
            } else { //MOD == 00
                //mox ax, [bx OR 1234H]
                setRegValue(Reg, getMemValue(RsM == "110" ? imORadd : RsM));
            }
        } else { //D == 0
            //mov [ax], bx
            //mov [1234], bx
            setMemValue(RsM === "110" ? imORadd : RsM, getRegValue(Reg));
        }
    } else if (opcode === "110001") setMemValue(RsM, imORadd);
    else if(opcode === "1011") setMemValue(Reg, imORadd);
}


function hexToBinary(hex) {
    let result;
    result = parseInt(hex, 16).toString();
    result = parseInt(result).toString(2);
    while (result.length < 16) {
        result = "0" + result;
    }
    return result;
}
parseAssembly(code);