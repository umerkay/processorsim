let instructions;

let globalCompilerError;
let globalRuntimeError;

function parseAssembly(text) {
    instructions = text.split("\n").filter(x => x != 0);
    globalCompilerError = false;
    resetError();
    setRegValue(regs["PC"].code, "0000");
    globalRuntimeError = false;

    for(let i = 0; i < instructions.length; i++) {
        instructions[i] = instructionToMachine(instructions[i],i);
        if(typeof instructions[i] === "string") {
            globalCompilerError = true;
            displayError("Error occured at line " + (i+1) + ": " + instructions[i]);
            instructions = [];
            break;
        }
    }
    if(!globalCompilerError)
        document.getElementById("asmoutput").innerHTML = instructions.map(x => parseInt(x.machCode, 2).toString(16)).join("\n");
}

function parseOperand(op) {
    let result = {};
    result.isMemory = op[0] == '[';

    if(result.isMemory && op[op.length-1] !== "]") return "Expected ]";

    inner = result.isMemory ? op.match(/\[([^)]+)\]/)[1] : op;
    if (regs[inner] != undefined) {
        result.regORhex = "R";
        result.code = regs[inner].code;
        result.length = regs[inner].length;
    } else {
        result.regORhex = "H";
        //conv all other radix to hex
        if(op[op.length-1].toUpperCase() === "B")
            result.code = parseInt(inner, 2).toString(16);
        else if (op[op.length-1].toUpperCase() !== "H")
            result.code = parseInt(inner).toString(16);
        else result.code = inner;
        
        if(result.code === "NaN") return "Invalid operand"

        result.length = result.code.length * 4;
    }
    // console.log(result);
    return result;
    
}

function instructionToMachine(instr, i) {
    // console.log(instr);
    let op = instr.split(" ")[0].toUpperCase();
    let operands = instr.split(" ").slice(1).join("").toUpperCase().split(",");
    let op1, op2;
    
    if(instrSet[op] === undefined) return "Instruction not supported";
    if(instrSet[op].opNo > operands.length) return "Too few operands, expected " + instrSet[op].opNo;
    if(instrSet[op].opNo < operands.length) return "Too many operands, expected " + instrSet[op].opNo;

    if(operands.length > 0 && operands[0] !== "")
        op1 = parseOperand(operands[0]);
    if(operands.length > 1)
        op2 = parseOperand(operands[1]);

    if(typeof op1 === "string") return op1;
    if(typeof op2 === "string") return op2;

    let finalParsed = instrSet[op].finalParse(op1, op2);
    return finalParsed; //string if error otherwise parsed object
}

function executeInstruction(instruction) {
    let {opcode, D, W, MOD, Reg, RsM, imORadd} = instruction;
    let imORaddCNV = parseInt(imORadd.substring(8) + imORadd.substring(0,8), 2).toString(16); //little endian se normal convert

    //general function for an instruction
    if(opcode == instrSet["MOV"].opcode) {
        if(D === "1") {
            if(MOD === "11") { //mov ax, bx
                setRegValue(Reg, getRegValue(RsM), W == "1" ? 16 : 8)
            } else { //MOD == 00
                //mox ax, [bx OR 1234H]
                setRegValue(Reg, getMemValue(((RsM === "110" && imORadd !== "") ? imORaddCNV : getRegValue(RsM))), W == "1" ? 16 : 8);
            }
        } else { //D == 0
            //mov [ax], bx
            //mov [1234], bx
            setMemValue((RsM === "110" && imORadd !== "") ? imORaddCNV : getRegValue(RsM), getRegValue(Reg));
        }
    } else if (opcode === "110001") setMemValue(getRegValue(RsM), imORaddCNV); //mov [ax], 1234h
    else if(opcode === "1011") console.log(Reg, imORaddCNV); setRegValue(Reg, imORaddCNV, W == "1" ? 16 : 8); //mov ax, 1234h


    if(globalRuntimeError) {
        displayError("Runtime error: " + globalRuntimeError);
    }
    //increment PC
    setRegValue(regs["PC"].code, (parseInt(getRegValue(regs["PC"].code), 16) + 1).toString(16), W == "1" ? 16 : 8);
}

function hexToBinary(hex) {
    let result;
    result = parseInt(hex, 16).toString(2);
    while (result.length < 16) {
        result = "0" + result;
    }
    return result;
}