function toLowerCamelCase(text) {
  return (
      text.charAt(0).toLowerCase() + text.slice(1).replace(' ', '')
  );
}

export default toLowerCamelCase;
