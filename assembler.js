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

    operands.map(parseOperand);
    
    let D = "0"; //decide D
    let W = "1"; //decide W
    let MOD = "11"; //decide MOD
    let Reg = "010"; //calc reg
    let RsM = "111"; //calc RsM

    console.log(op, operands);
    
    if(instrSet[op] == undefined) console.error("Operation undefined at line " + i);
    else return instrSet[op].opcode + D + W + MOD + Reg + RsM;
}
parseAssembly(code);