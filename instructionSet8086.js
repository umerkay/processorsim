let memStart = "0F01B";
let memLocs = 16;

let instrSet = {
    "MOV": {
        opcode: "100010",
        finalParse: function(op1, op2) {
            let opcode = this.opcode;
            let D, Reg, RsM = "", MOD = "", W;
            let imORadd = "";
            if (op1.isMemory === false) {
                D = "1";
                Reg = op1.code;
                if (op2.isMemory === false && op2.regORhex === "R") {
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
                    // for mov ax, 1234h
                    // opcode + 1 + w(1) + MOD(00) + 000 + RsM (registercode or 110) + address, address, immediate
                    opcode = "1011";
                    D = "";
                    RsM = "";
                    MOD = "";
                    code = hexToBinary(op2.code);
                    imORadd = code.substring(8) + code.substring(0,8);
                }
            } else {
                D = "0";
                if (op1.regORhex === "R" && op2.regORhex === "R") {
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
                    // code for mov [bx], 1234h goes here
                    opcode = "110001";
                    RsM = op1.code;
                    Reg = "000";
                    MOD = "00";
                    code = hexToBinary(op2.code);
                    imORadd = code.substring(8) + code.substring(0,8);
                }
            }
            W = (op1.length || op2.length) === 16 ? "1": "0";


            return opcode + D + W + MOD + Reg + RsM + imORadd;
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