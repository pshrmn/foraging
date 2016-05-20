export const validName = (name, takenNames = []) => {
  if ( name === null || name === '' ) {
    return false;
  }
  const badCharacters = /[<>:'\/\\\|\?\*]/;
  if ( name.match(badCharacters) !== null ) {
    return false;
  }
  return takenNames.every(tn => tn !== name);
};

export const abbreviate = (text, max) => {
    if ( text.length <= max ) {
      return text;
    } else if ( max <= 3 ) {
      return '...';
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
    const secondText = ( secondHalf === 0 ) ? '' : text.slice(-secondHalf);
    return `${firstText}...${secondText}`;
};

/*
 * return a string describing what a spec captures
 */
export function describeSpec(spec = {}) {
  switch ( spec.type ) {
  case 'single':
    return describeSingle(spec);
  case 'all':
    return describeAll(spec);
  case 'range':
    return describeRange(spec);
  default:
    return '';
  }
}

function describeSingle(spec) {
  const { index = 0 } = spec;
  return `captures element at index ${index}`;
}

function describeAll(spec) {
  const { name = '' } = spec;
  return `captures all elements, groups them as "${name}"`;
}

function describeRange(spec) {
  const { name = '', low, high } = spec;
  const highText = high === null ? 'end' : high;
  return `captures elements ${low} to ${highText}, groups them as "${name}"`;
}

/*
 * an abbreviated way of describing an element depending on its spec
 */
export function shortElement(selector, spec, optional = false) {
  const shortSelector = abbreviate(selector, 10);
  let text = '';

  if ( !spec ) {
    return shortSelector;
  }

  switch ( spec.type ) {
  case 'single':
    text = `${shortSelector}[${spec.index}]`;
    break;
  case 'all':
    text = `[${shortSelector}]`;
    break;
  case 'range':
    text = `${shortSelector}[${spec.low}:${spec.high || 'end'}]`;
  }
  if ( optional ) {
    text += '*';
  }
  return text;
}
