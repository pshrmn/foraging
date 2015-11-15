export const legalName = name => {
  if ( name === null || name === "" ) {
    return false;
  }
  let badCharacters = /[<>:"\/\\\|\?\*]/;
  return name.match(badCharacters) === null
};

/*
 * check if an identical selector already exists or one with the same name
 * exists
 */
export const matchSelector = (sel, parent) => {
    var selIndex = sel.spec.type === "single" ? sel.spec.value : undefined;
    var msg = "";
    var found = parent.children.some(function(s){
        if ( sel.spec.type !== s.spec.type ) {
            return false;
        }

        switch ( s.spec.type ) {
        case "single":
            var index = s.spec.value;
            if ( s.selector === sel.selector && index === selIndex ) {
                msg = "a selector with the same selector and index already exists";
                return true;
            }
            break;
        case "all":
            if ( s.spec.value === sel.spec.value ) {
                msg = `a selector with the name "${sel.spec.value}" already exists`;
                return true;
            }
            break;
        }
        return false;
    });

    return {
        error: found,
        msg: msg
    };
};

export const abbreviate = (text, max) => {
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
};
