function toCamelCase(text) {
  return (
    text.charAt(0).toUpperCase() + text.slice(1).replace(/([A-Z])/g, ' $1')
  );
}

export default toCamelCase;
