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
        memVal.innerHTML = "0000";

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

    // document.body.appendChild(regsEl);
    // document.body.appendChild(memsEl);
});