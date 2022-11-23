let memStart = "0F01B";
let memLocs = 16;

let instrSet = {
    "MOV": {
        opcode: "100101"
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