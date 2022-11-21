window.addEventListener("load", () => {
    let regsEl = document.getElementById("regs");
    
    for(reg in regs) {
        let regEl = document.createElement("span");
        regEl.id = "r" + regs[reg];
        regEl.classList.add("register");
        regEl.innerHTML = "0000";
        regsEl.appendChild(regEl);
    }

    document.body.appendChild(regsEl);
});