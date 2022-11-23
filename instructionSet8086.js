let memStart = "0F01B";
let memLocs = 16;

let instrSet = {
    "MOV": {
        opcode: "100101",
        finalParse: function(op1, op2) {
            let D = "0"; //decide D
            let W = "1"; //decide W
            let MOD = "11"; //decide MOD
            let Reg = "010"; //calc reg
            let RsM = "111"; //calc RsM

            // console.log(op, operands);

            //if(instrSet[op] == undefined) console.error("Operation undefined at line " + i);
            //else
            return instrSet[op].opcode + D + W + MOD + Reg + RsM;
        }
    },
    "ADD": {
        opcode: "101101"
    }
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
        code: "110",
        length: 16,
    },
    "DI": {
        code: "011",
        length: 16,
    },
};