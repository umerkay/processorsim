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

    //operands = operands.map(parseOperand);

    let op1 = parseOperand(operands[0]);
    let op2 = parseOperand(operands[1]);
    
    return instrSet[op].finalParse(op1, op2);
    //return instrSet[op].finalParse(...operands);
}

parseAssembly(code);