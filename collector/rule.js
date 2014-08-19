function RuleSet(name){
    this.name = name;
    this.rules = {};
}

RuleSet.prototype.addRule = function(rule){
    this.rules[rule.name] = rule;
}

RuleSet.prototype.deleteRule = function(name){
    delete this.rules[name];
}

function Rule(name, selector, capture, follow, parent){
    this.name = name;
    this.selector = selector;
    this.capture = capture;
    this.follow = follow || false;
    this.parent = parent;
    this.elements = {};
}

Rule.prototype.html = function(selectorViewEvent, unselectorViewEvent, editEvent, previewEvent, deleteEvent){
    var holder = noSelectElement("li"),
        nametag = noSelectElement("span"),
        edit = noSelectElement("span"),
        preview = noSelectElement("span"),
        deltog = noSelectElement("span");

    holder.dataset.name = this.name;
    holder.classList.add("savedRule");
    nametag.textContent = this.name;
    nametag.classList.add("savedRuleName");
    edit.textContent = "edit";
    preview.textContent = "preview";
    deltog.innerHTML = "&times;";
    deltog.classList.add("deltog");

    holder.appendChild(nametag);
    holder.appendChild(edit);
    holder.appendChild(preview);
    holder.appendChild(deltog);

    nametag.addEventListener("mouseenter", selectorViewEvent.bind(this), false);
    nametag.addEventListener("mouseleave", unselectorViewEvent.bind(this), false);
    edit.addEventListener("click", editEvent.bind(this), false);
    preview.addEventListener("click", previewEvent.bind(this), false);
    deltog.addEventListener("click", deleteEven.bind(this)t, false);
    
    this.elements = {
        holder: holder,
        nametag: nametag,
        edit: edit,
        preview: preview,
        deltog: deltog
    }

    return holder;
}

