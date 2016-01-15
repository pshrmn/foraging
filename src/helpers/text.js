export const legalName = name => {
  if ( name === null || name === "" ) {
    return false;
  }
  const badCharacters = /[<>:"\/\\\|\?\*]/;
  return name.match(badCharacters) === null
};

export const abbreviate = (text, max) => {
    if ( text.length <= max ) {
        return text;
    } else if ( max <= 3 ) {
        return "...";
    }
    // determine the length of the first and second halves of the text
    let firstHalf;
    let secondHalf;
    const leftovers = max-3;
    const half = leftovers/2;
    if ( leftovers % 2 === 0 ) {
        firstHalf = half;
        secondHalf = half;
    } else {
        firstHalf = Math.ceil(half);
        secondHalf = Math.floor(half);
    }

    // splice correct amounts of text
    const firstText = text.slice(0, firstHalf);
    const secondText = ( secondHalf === 0 ) ? "" : text.slice(-secondHalf);
    return `${firstText}...${secondText}`;
};

