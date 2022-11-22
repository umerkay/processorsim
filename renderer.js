window.addEventListener("load", () => {
    let regsEl = document.getElementById("regs");

    for(reg in regs) {
        let regEl = document.createElement("span");
        regEl.id = "r" + regs[reg];
        regEl.classList.add("register");
        regEl.innerHTML = "0000";

        regsEl.appendChild(regEl);
    }

    let memsEl = document.getElementById("mem");

    for(let i = 0; i < 16; i++) {
        let memEl = document.createElement("span");
        memEl.id = "m" + i.toString(2); 
        memEl.classList.add("memory");
        memEl.innerHTML = "0000";
        memsEl.appendChild(memEl);
    }

    document.body.appendChild(regsEl);
    document.body.appendChild(memsEl);
});