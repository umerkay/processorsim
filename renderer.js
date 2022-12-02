document.body.addEventListener("keypress", e => {
    if(e.key === "T" && e.shiftKey) {
        toggleProcessorMode();
    }
});
window.addEventListener("load", () => {
    let regsEl = document.getElementById("regs");

    for(reg in regs) {
        if(regs[reg].doRender === false) continue;
        let regEl = document.createElement("div");
        let regTitle = document.createElement("div");
        let regVal = document.createElement("div");
        regVal.id = "r" + regs[reg].code;
        regEl.classList.add("register");
        regVal.classList.add("value");
        regTitle.classList.add("title")
        regVal.innerHTML = "0000";
        regTitle.innerHTML = reg;

        regEl.appendChild(regTitle);
        regEl.appendChild(regVal);

        regsEl.appendChild(regEl);

    }

    let memsEl = document.getElementById("memlocs");

    for(let i = 0; i < memLocs; i++) {

        let memEl = document.createElement("div");
        let memAddr = document.createElement("div");
        let memVal = document.createElement("div");

        addr = (parseInt(memStart, 16) + i).toString(16).toUpperCase();
        addr = addr.padStart(5, '0');
        memVal.id = "m" + addr; 
        memAddr.innerHTML = addr; 
        memVal.innerHTML = "00";

        memEl.classList.add("memloc");
        memVal.classList.add("value");
        memAddr.classList.add("addr");

        memEl.appendChild(memAddr);
        memEl.appendChild(memVal);

        memsEl.appendChild(memEl);
    }

    // setRegValue(regs["DS"].code, memStart);

    document.getElementById("asmbbtn").addEventListener("click", () => {
        parseAssembly(document.getElementById("asminptext").value);
    });

    document.getElementById("asminptext").value = `;SAMPLE PROGRAM

;Calculate 5432h + 3040h
mov [ax], 5432h
mov bx, 3040h
add [ax], bx

;Calculate 789h - 234h
inc ax
inc ax
mov [ax], 789h
mov cx, 234h
sub [ax], cx

;Calculate 1011 AND 1110
inc ax
inc ax
mov [ax], 1011b
mov dl, 1110b
and [ax], dl`

    // document.body.appendChild(regsEl);
    // document.body.appendChild(memsEl);
});