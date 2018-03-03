// extract the first integer from a string
export function integer(value) {
  const intRegEx = /\d+/;
  const match = value.match(intRegEx);
  return match !== null ? parseInt(match[0], 10) : null;
}

// extract the first float from a string
export function float(value) {
  const floatRegEx = /\d+(\.\d+)?/;
  const match = value.match(floatRegEx);
  return match !== null ? parseFloat(match[0]) : null;
}
