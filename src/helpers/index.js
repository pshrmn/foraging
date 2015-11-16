export const legalName = name => {
  if ( name === null || name === "" ) {
    return false;
  }
  let badCharacters = /[<>:"\/\\\|\?\*]/;
  return name.match(badCharacters) === null
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
