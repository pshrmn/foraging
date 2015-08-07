// purge a classname from all elements with it
function clearClass(name){
    var eles = document.getElementsByClassName(name),
        len = eles.length;
    // iterate from length to 0 because its a NodeList
    while ( len-- ){
        eles[len].classList.remove(name);
    }
}

function newForm(holder, hidden){
    var form = holder.append("div")
        .classed({
            "form": true,
            "hidden": hidden
        });
    var work = form.append("div")
        .classed("workarea", true);
    var buttons = form.append("div")
        .classed("buttons", true);
    var errors = buttons.append("p")
        .classed("errors", true);

    function clearErrors(){
        errors.text("");
    }

    function showError(msg){
        errors.text(msg);
    }

    return {
        form: form,
        workarea: work,
        buttons: buttons,
        clearErrors: clearErrors,
        showError: showError
    };
}

function abbreviate(text, max) {
    if ( text.length <= max ) {
        return text;
    } else if ( max <= 3 ) {
        return "...";
    }
    // determine the length of the first and second halves of the text
    var firstHalf;
    var secondHalf;
    var leftovers = max-3;
    var half = leftovers/2;
    if ( leftovers % 2 === 0 ) {
        firstHalf = half;
        secondHalf = half;
    } else {
        firstHalf = Math.ceil(half);
        secondHalf = Math.floor(half);
    }

    // splice correct amounts of text
    var firstText = text.slice(0, firstHalf);
    var secondText = ( secondHalf === 0 ) ? "" : text.slice(-secondHalf);
    return `${firstText}...${secondText}`;
}
