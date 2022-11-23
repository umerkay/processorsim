let code = 
`MOV ax,BX
MOV ax,@BX
ADD BX,0009H`;
//JMP
//LOOP

function parseAssembly(text) {
    let instructions = text.split("\n").filter(x => x != 0);
    let bin = instructions.map((x,i) => instructionToMachine(x,i)); //err

    for(let i = 0; i < instructions.length; i++) {
        instructionToMachine(instructions[i],i);
    }

    console.log(bin);
}

function parseOperand(op) {
    return {
        isMemory: true,
        regORhex: "H",
        code: "0089H",
        length: 16
    }
}

function instructionToMachine(instr, i) {
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