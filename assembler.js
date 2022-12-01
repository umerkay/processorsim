let instructions = [];

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
            displayError("Assembler error at line " + (i+1) + ": " + instructions[i]);
            instructions = [];
            break;
        }
    }
    if(!globalCompilerError) {
        document.getElementById("asmoutput").innerHTML = instructions.map(x => parseInt(x.machCode, 2).toString(16).padStart(x.machCode.length/4, "0")).join("\n").toUpperCase();
        if(processorMode)
            document.getElementById("asmoutput2").innerHTML = document.getElementById("asmoutput").innerHTML;
    }
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
        let length;
        if (inner[0] == '-') {
            length = 9;
        } else if (inner[inner.length-1].toUpperCase() === "B") {
            length = parseInt(inner, 2).toString(2).length;
        } else if (inner[inner.length - 1].toUpperCase() === "H") {
            length = parseInt(inner, 16).toString(2).length;
        } else {
            length = parseInt(inner).toString(2).length;
        }
        
        result.code = operandTo8086Hex(inner, length <= 8 ? 2 : 4);
        console.log(result.code);
        if(result.code + "" === "NaN") return "Invalid operand"
        if(result.code + "" === "0NaN") return "Invalid operand"

        result.length = result.code.length * 4;
    }
    // console.log(result);
    return result;
    
}

function instructionToMachine(instr, i) {
    // console.log(instr);
    let op = instr.split(" ")[0].toUpperCase();
    let operands = instr.split(" ").slice(1).join("").split(';')[0].toUpperCase().split(",");
    let op1, op2;
    if(operands.length === 1 && operands[0] === "") operands = [];
    
    if(instrSet[op] === undefined) return "Instruction not supported";
    if(instrSet[op].opNo > operands.length) return "Too few operands, expected " + instrSet[op].opNo;
    if(instrSet[op].opNo < operands.length) return "Too many operands, expected " + instrSet[op].opNo;
    
    if(operands.length > 0 && operands[0] !== "")
        op1 = parseOperand(operands[0]);
    if(operands.length > 1)
        op2 = parseOperand(operands[1]);

    if(typeof op1 === "string") return op1;
    if(typeof op2 === "string") return op2;

    let finalParsed;
    if(operands.length === 0) finalParsed = { machCode: instrSet[op].opcode[0], instrTYPE: op };
    if(operands.length === 1) finalParsed = unaryFinalParse(op, op1);
    if(operands.length === 2) finalParsed = generalizedFinalParse(op, op1, op2);
    if(typeof finalParsed === "string") return finalParsed;
    return {...finalParsed, orgInstr: instr}; //string if error otherwise parsed object
}

const delay = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay));

async function executeInstruction(instruction) {
    // if(instruction.machCode === "11111111101") return "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    // if(instruction.machCode === "111111111011") return "The bits are upset they were associated with Manahil";
    if(processorMode) await animateFetch(instruction);
    if(instruction.machCode === instrSet["NOP"].opcode) return;

    //CYCLE: FETCH PC, CIR
    //decode CU
    let {opcode, D, W, MOD, Reg, RsM, imORadd, op1, op2, instrTYPE, machCode} = instruction;
    let tempCNV, imORaddCNV;
    if(imORadd) {
        tempCNV = imORadd.substring(8) + imORadd.substring(0,8);
        imORaddCNV = parseInt(tempCNV, 2).toString(16).padStart(tempCNV.length/4, tempCNV[0] === "0" ? "0" : "F"); //little endian se normal convert
    }
    // console.log(imORaddCNV);
    // let instrTYPE = instruction.operation;
    let destVal, srcVal;

    //CYCLE: DECODE
    if(processorMode) await animateDecode(instruction);
    //decode operands and fetch operands if required
    let didAccessMemory = false;
    if(instrSet[instrTYPE].opNo === 2) {
        if(opcode === instrSet[instrTYPE].opcode[0]) {
            if(D === "1") {
                //MOD != 11 is fetch operand case
                if(MOD !== "11") {
                    didAccessMemory = true;
                    srcVal = getMemValue(((RsM === "110" && imORadd !== "") ? imORaddCNV : getRegValue(RsM)), W === "1" ? 2: 1);
                }
                if(MOD === "11") srcVal = getRegValue(RsM, W == "1" ? 16 : 8);
                destVal = getRegValue(Reg);
            } else {//D === 0
                //fetch operand case
                //CYCLE: FETCH OPERAND
                didAccessMemory = true;
                destVal = getMemValue((RsM === "110" && imORadd !== "") ? imORaddCNV : getRegValue(RsM));
                srcVal = getRegValue(Reg);
            }
        } else if((D === "" && opcode === instrSet[instrTYPE].opcode[1]) || (D === "1")) {
            
            destVal = getRegValue(opcode === "100000" ? RsM : Reg, W == "1" ? 16 : 8);
            srcVal = imORaddCNV;
        } else if((D === "" && opcode === instrSet[instrTYPE].opcode[2]) || (D === "0")) {
            //CYCLE: FETCH OPERAND
            didAccessMemory = true;
            destVal = getMemValue(getRegValue(RsM));
            srcVal = imORaddCNV;
        }
    } else if(instrSet[instrTYPE].opNo === 1) {
        if (MOD == "11") {
            destVal = getRegValue(RsM, W == "1" ? 16 : 8);
        } else {
            didAccessMemory = true;
            destVal = getMemValue(getRegValue(RsM, W=="1" ? 16: 8))
        }
    } else {
        if(machCode === instrSet["DAA"].opcode[0]) {
            destVal = getRegValue(regs["AL"].code, 8);
        }
        if(machCode === instrSet["CBW"].opcode[0]) {
            destVal = getRegValue(regs["AL"].code, 8);
        }
    }
    if(processorMode) await animateFetchOperand(didAccessMemory, destVal, srcVal);
    
    //execute ALU
    //CYCLE: ALU
    let ALUResult = instrSet[instrTYPE].ALUfunction(destVal, srcVal);

    if(processorMode) await animateExecute(ALUResult);

    // if(opcode === instrSet["XCHG"].opcode[0]) {
        
    // }

    if(globalRuntimeError) {
        displayError("Runtime error: " + globalRuntimeError);
    }

    //store reg to memory
    let didWriteToMemory = false;
    if (instrSet[instrTYPE].opNo === 2) {
        if(opcode == instrSet[instrTYPE].opcode[0]) {
            if(D === "1") {
                // if(MOD === "11") { //mov ax, bx
                    setRegValue(Reg, ALUResult, W == "1" ? 16 : 8)
                // } else { //MOD == 00
                    //mox ax, [bx OR 1234H]
                    // setRegValue(Reg, ALUResult, W == "1" ? 16 : 8);
                // }
            } else { //D == 0
                //mov [ax], bx
                //mov [1234], bx
                //CYCLE: STORE
                didWriteToMemory = true;
                setMemValue((RsM === "110" && imORadd !== "") ? imORaddCNV : getRegValue(RsM), ALUResult);
            }
        } else if(instrTYPE === "MOV") {
            if (opcode === instrSet[instrTYPE].opcode[1]) {
                setRegValue(opcode === "100000" ? RsM : Reg, ALUResult, W == "1" ? 16 : 8); //mov ax, 1234h
            }
            else if(opcode === instrSet[instrTYPE].opcode[2]) {
                didWriteToMemory = true;
                setMemValue(getRegValue(RsM), ALUResult); //mov [ax], 1234h    
            }
        } else {
            if (D === "1") {
                setRegValue(opcode === "100000" ? RsM : Reg, ALUResult, W == "1" ? 16 : 8); //mov ax, 1234h
            }
            else if(D === "0") {
                didWriteToMemory = true;
                setMemValue(getRegValue(RsM), ALUResult); //mov [ax], 1234h    
            }
        }
    }
    else if(instrSet[instrTYPE].opNo === 1){
        if (MOD == "11") {
            if(opcode === "111101" && Reg === "100") {
                setRegValue(regs["AX"].code, ALUResult, 16);
            } else {
                setRegValue(RsM, ALUResult, W=="1" ? 16: 8);
            }
        } else {
            didWriteToMemory = true;
            if(opcode === "111101" && Reg === "100") {
                setMemValue(getRegValue(regs["AX"].code, 16), ALUResult);
            } else {
                setMemValue(getRegValue(RsM, W=="1"? 16 : 8), ALUResult);
            }
        }
    } else {
        if(machCode === instrSet["DAA"].opcode[0]) {
            setRegValue(regs["AL"].code, ALUResult, 8);
        }
        if(machCode === instrSet["CBW"].opcode[0]) {
            setRegValue(regs["AX"].code, ALUResult, 16);
        }
    }
    
    if(processorMode) if(didWriteToMemory) animateStore();

    if(globalRuntimeError) {
        displayError("Runtime error: " + globalRuntimeError);
    }
    //increment PC
    setRegValue(regs["PC"].code, (parseInt(getRegValue(regs["PC"].code), 16) + 1).toString(16), W == "1" ? 16 : 8);
}

function hexToBinary(hex, length=16) {
    let result;
    result = parseInt(hex, 16).toString(2);
    while (result.length < length) {
        result = "0" + result;
    }
    return result;
}

function operandTo8086Hex(op, length = 4) {
    if(op[op.length-1].toUpperCase() === "H") {
        if (parseInt(op, 16) < 0) {
            return parseInt((twosComplement((parseInt(op, 16) * -1).toString(2))).padStart(length * 4, "1"),2).toString(16);
        } else {
            return parseInt(op, 16).toString(16).padStart(length, "0");
        }
    } else if (op[op.length-1].toUpperCase() === "B") {
        if (parseInt(op, 2) < 0) {
            return parseInt((twosComplement((parseInt(op, 2) * -1).toString(2))).padStart(length * 4, "1"),2).toString(16);
        } else {
            return parseInt(op, 2).toString(16).padStart(length, "0");
        }
    } else {
        if (parseInt(op) < 0) {
            return parseInt((twosComplement((parseInt(op) * -1).toString(2))).padStart(length * 4, "1"),2).toString(16);
        } else if (parseInt(op) >= 0) {
            return parseInt(op).toString(16).padStart(length, "0");
        } else {
            return NaN;
        }
    }
}

function hexToJSInt(num) {
    let b16bit = num.split("").map(x => parseInt(x, 16));
    if (b16bit[0] === "1") {
        return -1 * parseInt(twosComplement(parseInt(num, 16).toString(2)), 2);
    } else {
        return parseInt(parseInt(num, 16).toString(2), 2);
    }
    
}

function twosComplement(num) {
    let result = "";
    for (let i=0; i<num.length; i++) {
        if (num[i] === '1') {
            result += "0";
        } else {
            result += '1';
        }
    }
    
    let length = result.length;
    // console.log(parseInt(result))
    return isNaN(parseInt(result)) ? NaN : (parseInt(result, 2) + 1).toString(2).padStart(length, "0")
}