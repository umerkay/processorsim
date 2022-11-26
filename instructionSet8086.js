let memStart = "00000";
let memLocs = 16;


function generalizedFinalParse(operation, op1, op2) {
    let Opcode = instrSet[operation].opcode;

    let opcode = Opcode[0];
    let D = "", Reg = "", RsM = "", MOD = "", W = "";
    let imORadd = "";
    if (op1.isMemory === false && op1.regORhex === "H") {
        return "Cannot " + operation + " to immediate value.";
    }
    else if (op1.isMemory === false) {
        D = "1";
        Reg = op1.code;
        if (op2.isMemory === false && op2.regORhex === "R") {
            if (op1.length != op2.length) {
                return "Cannot " + operation + " registers of different sizes.";
            }         
            RsM = op2.code;
            MOD = "11";                    
        } else if (op2.isMemory && op2.regORhex === "R") {           
            RsM = op2.code;
            MOD = "00";
        } else if (op2.isMemory && op2.RegORhex === "H") {       
            MOD = "00";
            RsM = "110";
            code = hexToBinary(op2.code);
            imORadd = code.substring(8) + code.substring(0, 8);
        } else {
            opcode = Opcode[1];
            if (Opcode[0] === "100010") {
                D = ""; // the reg-imm for mov is identified by absence of D, RsM and mod
                RsM = "";
                MOD = "";
            } else {
                if (Opcode[0] === "000000") {
                                // given their same immediate opcode (100000)
                    Reg = "000"; // the reg-imm for add is identified by Reg="000"
                } else if (Opcode[0] === "000101") {
                                    // given their same immediate opcode
                    Reg = "101";    // the reg-imm for sub is identified by Reg="101"
                } else if (Opcode[0] === "001000") {
                                    // given their same immediate opcode
                    Reg = "100";    // the reg-imm for and is identified by Reg="100"
                }
                RsM = op1.code;
                MOD = "00";
            }
            code = hexToBinary(op2.code);
            imORadd = code.substring(8) + code.substring(0,8);
        }
    }
    else {
        D = "0";
        if (op2.isMemory) {
            return "Cannot " + operation + " memory to memory."
        } else if (op1.regORhex === "H" && op2.regORhex === "H") {
            return "Cannot " + operation + " immediate to memory."
        } else if (op1.regORhex === "R" && op2.regORhex === "R") {         
            Reg = op2.code;
            MOD = "00";
            RsM = op1.code;
        } else if (op1.regORhex === "H" && op2.regORhex === "R") {    
            Reg = op2.code;
            MOD = "00";
            RsM = "110";
            code = hexToBinary(op1.code);
            imORadd = code.substring(8) + code.substring(0, 8);
        } else if (op1.regORhex === "R" && op2.regORhex === "H") {
            opcode = Opcode[2];
            RsM = op1.code;
            if (Opcode[0] === "100010") {
                Reg = "000";
            }
            // Given their same [reg]-immediate opcodes
            // The add, sub, and instructions are differenciated by reg values as given
            else if (Opcode[0] === "000000") { // for add
                Reg = "000";
            } else if (Opcode[0] === "000101") { // for sub
                Reg = "101";
            } else if (Opcode[0] === "001000") { // for and
                Reg = "100";
            }
            MOD = "00";
            code = hexToBinary(op2.code);
            imORadd = code.substring(8) + code.substring(0,8);
        }
    }
    W = (op1.length || op2.length) === 16 ? "1": "0";

    return {opcode, D, W, MOD, Reg, RsM, imORadd, machCode: opcode + D + W + MOD + Reg + RsM + imORadd, instrTYPE: operation, op1, op2}
}


function unaryFinalParse(operation, op) {
    let opcode = operation.opcode[0];
    //1111011w oo010mmm 
    let Reg, D = "1", RsM = "", MOD = "", W = "";
    let imORadd = "";

    // This section chooses reg value for NOT, INC, or DEC according to book
    if (opcode[0] === "111101") {   // for NOT
        Reg = "010";
    } else if (opcode[0] === "111111") {    // for INC
        Reg = "000";
    } else if (opcode[0] === "111111") {    // for DEC
        Reg = "001";
    }

    // This section checks operation type and returns the DWetc object
    if (op.isMemory === false && op.regORhex === "H") {
        return "Cannot perform " + op + " on immediate value.";
    } else if (op.isMemory === false && op.regORhex === "R") {
        //reg field fixed in unary ops, rsm act as reg here
        MOD="11";
        RsM = op.code;
    } else if (op.isMemory && op.regORhex === "R") {
        MOD = "00";
        RsM = op.code;
    } else {
        return "Cannot perform " + op + " on immediate memory adress.";
    }
    W = op.length === 16 ? "1": "0";

    return {opcode, D, W, MOD, Reg, RsM, imORadd, machCode: opcode + D + W + MOD + Reg + RsM + imORadd}
}


let instrSet = {
    "MOV": {
        opcode: ["100010","1011", "110001"],
        opNo: 2, //total operands
        ALUfunction: (dest, source) => source,
        //input are two operands in format
        // {
        // code: "000" to "111"
        // isMemory: false/true
        // length: 16 or 8
        // regORhex: "R" or "h"
        // }, 
        // {
        // code: "000" to "111"
        // isMemory: false/true
        // length: 16 or 8
        // regORhex: "R" or "h"
        // }
        //finalParse should calculate all values and return
            // {opcode, D, W, MOD, Reg, RsM, imORadd, machCode: opcode + D + W + MOD + Reg + RsM + imORadd}
        //if, for example, d or w does not exist in format, return empty string ""
        //if there is an error i.e operand types are not supported (word length unequal, writing to memory, displacement)
        //return string with error text in string format only "Unequal operand length"
    },
    "ADD": {
        opcode: ["000000","100000", "100000"],                                       
        opNo: 2,
        ALUfunction: (dest, source) => (parseInt(dest, 16) + parseInt(source, 16)).toString(16),
    },
    "SUB": {
        opcode: ["000101","100000","100000"],
        opNo: 2,
        ALUfunction: (dest, source) => (parseInt(dest, 16) - parseInt(source, 16)).toString(16),

    },
    "AND":{
        opcode:["001000", "100000","100000"],
        opNo:2,
        ALUfunction: (dest, source) => {
            console.log(dest, source);
            return (parseInt(dest, 16) & parseInt(source, 16)).toString(16)
        },
        // ALUfunction: console.log
    },
    "OR":{
        opcode:["000010", "100000","100000"],
        opNo:2,
        ALUfunction: (dest, source) => (parseInt(dest, 16) | parseInt(source, 16)).toString(16),
    },
    "XOR":{
        //same with diff opcode
        //000110dw oorrrmmm disp 
        //when xor ax,1234h //when xor mem, 1234h 
        // change to 100000sw oo110mmm data
        opcode:["000110", "100000","100000"],
        opNo:2,
        ALUfunction: (dest, source) => (parseInt(dest, 16) ^ parseInt(source, 16)).toString(16),
    
    },
    "NOT":{
        opcode: ["111101"],
        opNo:1,
    },

    "INC":{
    opcode:["111111"],
    opNo:1,
    },

    "DEC":{
        opcode: ["111111"],
        opNo:1,
},
};

let regs = {
    "AX": {
        code: "000",
        length: 16,
    },
    "AL": {
        code: "000",
        length: 8,
        doRender: false
    },
    "CX": {
        code: "001",
        length: 16,
    },
    "CL": {
        code: "001",
        length: 8,
        doRender: false
    },
    "DX": {
        code: "010",
        length: 16,
    },
    "DL": {
        code: "010",
        length: 8,
        doRender: false
    },
    "BL": {
        code: "110",
        length: 8,
        doRender: false
    },
    "BX": {
        code: "110",
        length: 16,
    },
    "PC": {
        code: "011",
        length: 16,
    },
    "DS": {
        code: "111",
        length: 16,
    },
    "DI": {
        code: "011",
        length: 16,
    },
}