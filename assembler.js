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

function instructionToMachine(instr, i) {
    let op = instr.split(" ")[0].toUpperCase();
    let operands = instr.split(" ").slice(1).join("").toUpperCase().split(",");

    let D = "0";
    let W = "1";
    let MOD = "11";
    let Reg = "010";
    let RsM = "111";

    if(instrSet[op] == undefined) console.error("Operation undefined at line " + i);
    else return instrSet[op].opcode + D + W + MOD + Reg + RsM;
}

parseAssembly(code);